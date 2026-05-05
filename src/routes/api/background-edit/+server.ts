import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenAI } from '@google/genai';

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
					`You are a strict classifier for a photobooth background editor. ` +
					`Return only "yes" or "no". ` +
					`User message: "${prompt}"`
			}
		]
	});

	const answer =
		result.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();

	return answer === 'yes';
}

const TIMEOUT_MS = 60_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	return Promise.race([
		promise,
		new Promise<never>((_, reject) =>
			setTimeout(() => reject(new Error('Request timed out')), ms)
		)
	]);
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const {
			prompt,
			imageBase64,
			mimeType,
			selfImageBase64,
			remoteImageBase64,
			photoIndex = 0
		} = await request.json();

		if (!imageBase64) {
			return json({ error: 'No image provided' }, { status: 400 });
		}

		if (!prompt || typeof prompt !== 'string') {
			return json({ error: 'Prompt is required' }, { status: 400 });
		}

		// Only classify first image in batch
		if (photoIndex === 0) {
			const allowed = await withTimeout(
				isBackgroundEditRequest(prompt.trim()),
				TIMEOUT_MS
			);

			if (!allowed) {
				return json(
					{ error: 'I can only edit photo backgrounds.' },
					{ status: 422 }
				);
			}
		}

		const isTwoUsers = !!(selfImageBase64 && remoteImageBase64);

		const systemPrompt = isTwoUsers
			? `Combine both people into one realistic scene. Background: ${prompt}`
			: `Replace the background of this image. Background: ${prompt}`;

		const contents = isTwoUsers
			? [
					{ text: systemPrompt },
					{ inlineData: { mimeType: 'image/jpeg', data: selfImageBase64 } },
					{ inlineData: { mimeType: 'image/jpeg', data: remoteImageBase64 } }
			  ]
			: [
					{ text: systemPrompt },
					{ inlineData: { mimeType: mimeType || 'image/png', data: imageBase64 } }
			  ];

		const response = await withTimeout(
			ai.models.generateContent({
				model: 'gemini-2.5-flash-image',
				contents,
				config: { responseModalities: ['TEXT', 'IMAGE'] }
			}),
			TIMEOUT_MS
		);

		let imageBase64Out: string | null = null;
		let mimeTypeOut = 'image/png';

		for (const part of response.candidates?.[0]?.content?.parts ?? []) {
			// ✅ FIX: safely narrow type so TS knows it's a string
			if (typeof part.inlineData?.data === 'string') {
				imageBase64Out = part.inlineData.data;
				mimeTypeOut = part.inlineData.mimeType ?? 'image/png';
			}
		}

		if (!imageBase64Out) {
			return json(
				{ error: 'No image was returned by the model' },
				{ status: 500 }
			);
		}

		return json({
			imageBase64: imageBase64Out,
			mimeType: mimeTypeOut
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';

		return json(
			{ error: message },
			{ status: 500 }
		);
	}
};