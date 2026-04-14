import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenAI } from '@google/genai';

// Allow large base64 image payloads (photo strips can be several MB)
export const config = {
  api: { bodyLimit: '10mb' }
};

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function isBackgroundEditRequest(prompt: string): Promise<boolean> {
  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        text:
          `You are a strict classifier for a photobooth background editor chatbot. ` +
          `Your only job is to decide if the user's message is asking to change or edit the background of a photo. ` +
          `Valid requests describe a background scene, environment, setting, color, or style to apply to a photo. ` +
          `Invalid requests are anything else — questions, jokes, coding help, general conversation, harmful content, etc. ` +
          `Reply with ONLY the single word "yes" or "no". ` +
          `User message: "${prompt}"`
      }
    ]
  });

  const answer = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
  return answer === 'yes';
}

const TIMEOUT_MS = 60_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out. The model is taking too long — please try again.')), ms)
    )
  ]);
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { prompt, imageBase64, mimeType } = await request.json();

    if (!imageBase64) {
      return json({ error: 'No image provided' }, { status: 400 });
    }

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return json({ error: 'Prompt is required' }, { status: 400 });
    }

    const allowed = await withTimeout(isBackgroundEditRequest(prompt.trim()), TIMEOUT_MS);
    if (!allowed) {
      return json(
        { error: 'I can only edit photo backgrounds. Try something like "a beach at sunset" or "outer space".' },
        { status: 422 }
      );
    }

    const contents = [
      {
        text:
          `You are a photo background editor for a photobooth app. ` +
          `Edit only the background of this photo strip image based on the user's request. ` +
          `Keep all people and subjects in the foreground intact and unmodified. ` +
          `User request: ${prompt.trim()}`
      },
      {
        inlineData: {
          mimeType: mimeType || 'image/png',
          data: imageBase64
        }
      }
    ];

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents,
        config: { responseModalities: ['TEXT', 'IMAGE'] }
      }),
      TIMEOUT_MS
    );

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData) {
        return json({
          imageBase64: part.inlineData.data,
          mimeType: part.inlineData.mimeType ?? 'image/png'
        });
      }
    }

    return json({ error: 'No image was returned by the model' }, { status: 500 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return json({ error: message }, { status: 500 });
  }
};
