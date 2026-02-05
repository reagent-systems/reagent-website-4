import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true, // Listen on all network interfaces
		port: 5173
	},
	build: {
		cssMinify: true,
		minify: 'esbuild', // Use esbuild for faster builds
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['three', 'troika-three-text']
				}
			}
		}
	}
});
