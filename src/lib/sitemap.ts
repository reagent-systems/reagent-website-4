// Every page on the site, for the sitemap page and sitemap.xml.
import { AREAS, REGIONS, displayName } from '$lib/areas';
import { SERVICES } from '$lib/site-links';

export const SITE = 'https://reagent-systems.com';

export type SitemapGroup = { title: string; links: { href: string; label: string }[] };

export const SITEMAP: SitemapGroup[] = [
	{
		title: 'general',
		links: [
			{ href: '/', label: 'home' },
			{ href: '/plan', label: 'the plan' },
			{ href: '/careers', label: 'careers' },
			{ href: '/community', label: 'community' },
			{ href: '/areas-served', label: 'areas served' }
		]
	},
	{
		title: 'services',
		links: [
			{ href: '/services', label: 'all services' },
			...SERVICES.map((s) => ({ href: `/services#${s.id}`, label: s.name }))
		]
	},
	{
		title: 'resources',
		links: [
			{ href: '/research', label: 'research' },
			{ href: '/projects', label: 'projects' },
			{ href: '/portal', label: 'portal' },
			{ href: '/metrics', label: 'metrics' }
		]
	},
	{
		title: 'legal',
		links: [
			{ href: '/terms', label: 'terms & conditions' },
			{ href: '/privacy', label: 'privacy statement' }
		]
	},
	...REGIONS.map((r) => ({
		title: r.name,
		links: r.areas.map((a) => ({ href: `/areas-served/${a.slug}`, label: displayName(a.name) }))
	}))
];

/** Paths for sitemap.xml: whole pages only, no in-page anchors. */
export const SITEMAP_PATHS: string[] = [
	'/',
	'/plan',
	'/careers',
	'/community',
	'/services',
	'/research',
	'/projects',
	'/portal',
	'/metrics',
	'/areas-served',
	'/terms',
	'/privacy',
	'/sitemap',
	...AREAS.map((a) => `/areas-served/${a.slug}`)
];
