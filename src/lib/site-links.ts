// Links shared by the footer and the sitemap page.
import { COMPANIES } from '$lib/home/companies';

// Each service is described in our own words, from founder calls.
export type Service = { id: string; name: string; text: string; link?: { href: string; label: string } };

export const SERVICES: Service[] = [
	{
		id: 'readiness-assessment',
		name: 'readiness assessment',
		text: "we ask the questions that show how defensible you are, and from that we gauge your technology readiness level and your manufacturing readiness level."
	},
	{
		id: 'founder-partnership',
		name: 'founder partnership',
		text: "we take founders from very early stage to a technology readiness level of five and a manufacturing readiness level of six: compliance in check, paperwork in check, a business model that scales, and operators in wherever they're needed."
	},
	{
		id: 'raise-preparation',
		name: 'raise preparation',
		text: "investors expect confident decisions backed by numbers and research. that means a pitch deck, a cap table, a data room, a website, branding, and your own research documents, ready before the introduction."
	},
	{
		id: 'founder-network',
		name: 'founder network',
		text: "introductions to founders who are ahead of you, and to the engineers and manufacturers who have built it before."
	},
	{
		id: 'spark-inference',
		name: 'spark inference',
		text: "we opened our DGX Spark for free compute and free inference for people doing ML work.",
		link: { href: 'https://spark.reagent-systems.com', label: 'enter the portal' }
	}
];

export type SiteLink = { href: string; label: string; external?: boolean };

export const LINK_GROUPS: { title: string; links: SiteLink[] }[] = [
	{
		title: 'general',
		links: [
			{ href: '/#mission', label: 'about & mission' },
			{ href: '/plan', label: 'the plan' },
			{ href: '/careers', label: 'careers' },
			{ href: '/community', label: 'community' },
			{ href: '/areas-served', label: 'areas served' },
			{ href: '/#join', label: 'contact us' }
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
			{ href: '/blog', label: 'news' },
			{ href: '/#join', label: 'newsletter' },
			{ href: 'https://spark.reagent-systems.com', label: 'portal', external: true },
			{ href: 'https://spark.reagent-systems.com/docs', label: 'portal docs', external: true }
		]
	},
	{
		title: 'industries',
		links: COMPANIES.map((c) => ({ href: `/${c.slug}`, label: c.fullName }))
	}
];

export const LEGAL_LINKS: SiteLink[] = [
	{ href: '/terms', label: 'terms & conditions' },
	{ href: '/privacy', label: 'privacy statement' },
	{ href: '/sitemap', label: 'sitemap' }
];
