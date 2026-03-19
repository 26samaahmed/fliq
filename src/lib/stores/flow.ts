import { writable } from 'svelte/store';

export const frameStore = writable<string>('1x3');
