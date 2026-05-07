import adapterNode from '@sveltejs/adapter-node';
import adapterVercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const adapter = process.env.VERCEL ? adapterVercel() : adapterNode();

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter
	}
};

export default config;
