import type { Handle } from '@sveltejs/kit';

/**
 * Optimize network requests:
 * 1. Defer non-critical CSS to reduce render blocking
 * 2. Remove unused preconnect hints
 * 3. Ensure CSS loads in parallel
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
		
		// Polyfill for browsers that don't support onload on link elements
		const polyfill = `<script>!function(e){"use strict";var t=function(t,n,o){var i,r=e.document,a=r.createElement("link");if(o)i=o;else{var l=(r.body||r.getElementsByTagName("head")[0]).childNodes;i=l[l.length-1]}var d=r.styleSheets;a.rel="stylesheet",a.href=t,a.media="only x",function e(t){if(r.body)return t();setTimeout(function(){e(t)})}(function(){i.parentNode.insertBefore(a,o?i:i.nextSibling)});var f=function(e){for(var t=a.href,n=d.length;n--;)if(d[n].href===t)return e();setTimeout(function(){f(e)})};return a.addEventListener&&a.addEventListener("load",function(){this.media=o||"all"}),a.onloadcssdefined=f,f(function(){a.media!==o&&(a.media=o||"all")}),a};"undefined"!=typeof exports?exports.loadCSS=t:e.loadCSS=t}("undefined"!=typeof global?global:this);</script>`;
		
		// Find all stylesheet links and defer non-critical ones
		const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]*>/gi;
		let isFirst = true;
		let hasDeferred = false;
		const stylesheetMatches: string[] = [];
		
		// First pass: collect all stylesheets
		html.replace(linkRegex, (match) => {
			if (!match.includes('defer') && !match.includes('async') && !match.includes('preload')) {
				stylesheetMatches.push(match);
			}
			return match;
		});
		
		// Second pass: defer non-critical stylesheets
		// More aggressive: defer ALL stylesheets except the very first one
		html = html.replace(linkRegex, (match) => {
			// Skip if already has defer, async, or preload
			if (match.includes('defer') || match.includes('async') || match.includes('preload')) {
				return match;
			}
			
			// Keep ONLY the very first stylesheet synchronous (critical/base CSS)
			// This ensures at least base styles load immediately
			if (isFirst) {
				isFirst = false;
				// Only keep first if it's clearly the base/layout CSS
				if (match.includes('_layout') || match.includes('app') || match.includes('0.') || match.includes('immutable/assets/0.')) {
					return match;
				}
				// If first isn't clearly base CSS, defer it too and mark as deferred
				hasDeferred = true;
			} else {
				hasDeferred = true;
			}
			
			// Extract href (handle query strings)
			const hrefMatch = match.match(/href=["']([^"']+)["']/);
			if (!hrefMatch) return match;
			
			const href = hrefMatch[1];
			
			// Extract other attributes (preserve integrity, crossorigin, etc.)
			const otherAttrs = match
				.replace(/rel=["']stylesheet["']/gi, '')
				.replace(/href=["'][^"']+["']/gi, '')
				.trim();
			
			// Convert to preload with onload for parallel loading
			// This allows all CSS to load in parallel instead of sequentially
			return `<link rel="preload" as="style" href="${href}" ${otherAttrs} onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}" ${otherAttrs}></noscript>`;
		});
		
		// Add polyfill if we deferred any CSS
		const finalHtml = hasDeferred && !html.includes('loadCSS')
			? html.replace('</head>', `${polyfill}</head>`)
			: html;
		
		return new Response(finalHtml, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	}
	
	return response;
};
