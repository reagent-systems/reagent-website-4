import type { Handle } from '@sveltejs/kit';

/**
 * Server hook: fix viewport meta for accessibility, remove unused preconnect hints.
 * (Stylesheet links are left unchanged so CSS loads in order and opacity/visibility work on reload.)
 */
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	
	// Only modify HTML responses
	if (response.headers.get('content-type')?.includes('text/html')) {
		let html = await response.text();
		
		// Fix viewport meta tag - remove maximum-scale for accessibility
		html = html.replace(
			/<meta[^>]+name=["']viewport["'][^>]*>/gi,
			(match) => {
				// Remove maximum-scale and user-scalable=no
				let fixed = match
					.replace(/maximum-scale=["']?\d+["']?/gi, '')
					.replace(/user-scalable=["']?no["']?/gi, '')
					.replace(/\s+/g, ' ')
					.replace(/\s*>/g, '>');
				// Clean up any double spaces or trailing commas
				fixed = fixed.replace(/,\s*,/g, ',').replace(/,\s*>/g, '>');
				return fixed;
			}
		);
		
		// Remove unused preconnect hints
		// These are often added by platforms but not actually used
		const unusedPreconnects = [
			'avatars.githubusercontent.com',
			'assets.vercel.com'
		];
		
		unusedPreconnects.forEach(origin => {
			// Remove preconnect links for unused origins (handle various formats)
			const patterns = [
				// Standard preconnect
				new RegExp(`<link[^>]+rel=["']preconnect["'][^>]*href=["']https?://${origin.replace(/\./g, '\\.')}[^"']*["'][^>]*>`, 'gi'),
				// With crossorigin
				new RegExp(`<link[^>]+crossorigin[^>]*href=["']https?://${origin.replace(/\./g, '\\.')}[^"']*["'][^>]*>`, 'gi'),
				// HTTP header format in HTML comments or meta
				new RegExp(`<[^>]*${origin.replace(/\./g, '\\.')}[^>]*rel=["']preconnect["'][^>]*>`, 'gi')
			];
			
			patterns.forEach(regex => {
				html = html.replace(regex, '');
			});
		});
		
		return new Response(html, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	}
	
	return response;
};
