import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		prerender: {
			// Some links point at pages that aren't built yet (the company pages,
			// /blog). Note them during the build instead of failing it.
			handleHttpError: ({ status, path, referrer, message }) => {
				if (status === 404) {
					console.warn(`prerender: ${path} not found (linked from ${referrer})`);
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;
