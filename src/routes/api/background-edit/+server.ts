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
    const { prompt, imageBase64, mimeType, selfImageBase64, remoteImageBase64, photoIndex = 0 } = await request.json();

    if (!imageBase64) {
      return json({ error: 'No image provided' }, { status: 400 });
    }

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Only classify on the first photo — same prompt applies to the whole batch
    if (photoIndex === 0) {
      const allowed = await withTimeout(isBackgroundEditRequest(prompt.trim()), TIMEOUT_MS);
      if (!allowed) {
        return json(
          { error: 'I can only edit photo backgrounds. Try something like "a beach at sunset" or "outer space".' },
          { status: 422 }
        );
      }
    }

    const isTwoUsers = !!(selfImageBase64 && remoteImageBase64);
    const actualMimeType = mimeType || 'image/png';

    const systemPrompt = isTwoUsers
      ? `You are an image compositor for a two-person photobooth app. ` +
        `You are given two separate portrait photos — one person per image. ` +
        `Your task: create a single natural-looking photograph where both people appear together in the same scene. ` +
        `STRICT RULES — you must follow these exactly: ` +
        `1. Detect both people using precise subject segmentation. ` +
        `2. Remove ONLY the background pixels — every pixel that is not part of a person must be replaced. ` +
        `3. Do NOT alter any person in any way — no changes to face, hair, skin, clothing, body shape, or pose. ` +
        `4. Do NOT add borders, dividers, frames, or seams between the two people. ` +
        `5. Apply consistent lighting and shadows across both people to match the new scene. ` +
        `6. The final result must look like a single natural photo taken in the requested scene. ` +
        `New background scene: ${prompt.trim()}`
      : `You are a background replacement editor for a photobooth app. ` +
        `Your task is to replace the background of this photo with the scene the user describes. ` +
        `STRICT RULES — you must follow these exactly: ` +
        `1. Use precise subject segmentation to identify every person in the photo. ` +
        `2. Replace ONLY the background pixels — every pixel not part of a person must be replaced with the new scene. ` +
        `3. Do NOT change any person in any way — their face, hair, skin tone, clothing, body, and pose must be pixel-perfect identical to the original. ` +
        `4. Do NOT add any overlays, borders, vignettes, or filters on top of the people. ` +
        `5. Blend the edges between the people and the new background naturally, with no harsh cutout lines. ` +
        `6. Apply lighting and shadows on the people that match the new background scene. ` +
        `New background scene: ${prompt.trim()}`;

    const contents = isTwoUsers
      ? [
          { text: systemPrompt },
          { inlineData: { mimeType: 'image/jpeg', data: selfImageBase64 } },
          { inlineData: { mimeType: 'image/jpeg', data: remoteImageBase64 } }
        ]
      : [
          { text: systemPrompt },
          { inlineData: { mimeType: actualMimeType, data: imageBase64 } }
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
