import { writable } from 'svelte/store';

export const stripStore = writable<{ base64: string; mimeType: string } | null>(null);
