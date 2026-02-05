import type { Handle } from '@sveltejs/kit';

/**
 * Defer non-critical CSS to reduce render blocking
 * Converts stylesheet links to async-loaded stylesheets
 */
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	
	// Only modify HTML responses
	if (response.headers.get('content-type')?.includes('text/html')) {
		const html = await response.text();
		
		// Polyfill for browsers that don't support onload on link elements
		const polyfill = `<script>!function(e){"use strict";var t=function(t,n,o){var i,r=e.document,a=r.createElement("link");if(o)i=o;else{var l=(r.body||r.getElementsByTagName("head")[0]).childNodes;i=l[l.length-1]}var d=r.styleSheets;a.rel="stylesheet",a.href=t,a.media="only x",function e(t){if(r.body)return t();setTimeout(function(){e(t)})}(function(){i.parentNode.insertBefore(a,o?i:i.nextSibling)});var f=function(e){for(var t=a.href,n=d.length;n--;)if(d[n].href===t)return e();setTimeout(function(){f(e)})};return a.addEventListener&&a.addEventListener("load",function(){this.media=o||"all"}),a.onloadcssdefined=f,f(function(){a.media!==o&&(a.media=o||"all")}),a};"undefined"!=typeof exports?exports.loadCSS=t:e.loadCSS=t}("undefined"!=typeof global?global:this);</script>`;
		
		// Find all stylesheet links
		const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]*>/gi;
		let isFirst = true;
		let hasDeferred = false;
		
		const modifiedHtml = html.replace(linkRegex, (match) => {
			// Skip if already has defer, async, or preload
			if (match.includes('defer') || match.includes('async') || match.includes('preload')) {
				return match;
			}
			
			// Keep first stylesheet synchronous (critical/base CSS)
			// Usually the layout CSS which contains base styles
			if (isFirst && (match.includes('_layout') || match.includes('app') || match.includes('0.'))) {
				isFirst = false;
				return match;
			}
			
			isFirst = false;
			hasDeferred = true;
			
			// Extract href
			const hrefMatch = match.match(/href=["']([^"']+)["']/);
			if (!hrefMatch) return match;
			
			const href = hrefMatch[1];
			
			// Extract other attributes
			const otherAttrs = match
				.replace(/rel=["']stylesheet["']/gi, '')
				.replace(/href=["'][^"']+["']/gi, '')
				.trim();
			
			// Convert to preload with onload
			return `<link rel="preload" as="style" href="${href}" ${otherAttrs} onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}" ${otherAttrs}></noscript>`;
		});
		
		// Add polyfill if we deferred any CSS
		const finalHtml = hasDeferred && !html.includes('loadCSS')
			? modifiedHtml.replace('</head>', `${polyfill}</head>`)
			: modifiedHtml;
		
		return new Response(finalHtml, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	}
	
	return response;
};
