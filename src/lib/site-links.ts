// Links shared by the footer and the sitemap page.
import { COMPANIES } from '$lib/home/companies';

// Each service, as described on the services page.
export type Service = { id: string; name: string; text: string; link?: { href: string; label: string } };

export const SERVICES: Service[] = [
	{
		id: 'readiness-assessment',
		name: 'readiness assessment',
		text: "we start with a structured set of questions about your product and market, and use the answers to place you on the technology and manufacturing readiness scales."
	},
	{
		id: 'founder-partnership',
		name: 'founder partnership',
		text: "we work alongside you to reach technology readiness level five and manufacturing readiness level six, sorting out compliance, paperwork, a business model that can scale, and the operators you need."
	},
	{
		id: 'raise-preparation',
		name: 'raise preparation',
		text: "investors look for decisions backed by research and numbers. we help you put together the pitch deck, cap table, data room, website and branding before any introduction."
	},
	{
		id: 'founder-network',
		name: 'founder network',
		text: "introductions to founders a few steps ahead of you, and to engineers and manufacturers who have solved similar problems."
	},
	{
		id: 'spark-inference',
		name: 'spark inference',
		text: "free compute and inference on our DGX Spark for anyone doing machine learning work.",
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
