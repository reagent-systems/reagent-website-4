// Links shared by the footer and the sitemap page.
import { COMPANIES } from '$lib/home/companies';

// Each service is described in the words of the homepage statements.
export type Service = { id: string; name: string; text: string; link?: { href: string; label: string } };

export const SERVICES: Service[] = [
	{
		id: 'readiness-assessment',
		name: 'readiness assessment',
		text: 'we estimate the true technology or manufacturing readiness of the company and identify its constraints.'
	},
	{
		id: 'founder-partnership',
		name: 'founder partnership',
		text: 'first, we talk with the founder. from there, we work in a partnership capacity towards solutions.'
	},
	{
		id: 'raise-preparation',
		name: 'raise preparation',
		text: 'we build up companies to a stage ready to reach a capital raise. we take no equity and no percentage of any introduction, because to us it stifles the forward progress of a company.'
	},
	{
		id: 'founder-network',
		name: 'founder network',
		text: 'we gathered the resources, the knowledge, and the capital in one place. the most invaluable thing is a network of founders that reach out and assist.'
	},
	{
		id: 'spark-inference',
		name: 'spark inference',
		text: 'a shared nvidia dgx spark, open to the community. it serves open models through an openai-compatible api.',
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
