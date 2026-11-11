import { capitalArt } from './capital-art';
import { defenseArt } from './defense-art';
import { logisticsArt } from './logistics-art';
import { matterArt } from './matter-art';
import { researchArt } from './research-art';

export interface Company {
	slug: string;
	name: string;
	fullName: string;
	line: string;
	email: string;
	logo: string;
	/** Three lines shown in the hero while this company is up. */
	slogan: [string, string, string];
	/** Text art for the hero, used as-is instead of dithering `logo`. */
	art?: string;
	/** What the company does, for its page. */
	about?: string[];
}

// Logos in /static/company-logos are placeholders until the final marks arrive.
export const COMPANIES: Company[] = [
	{
		slug: 'matter',
		name: 'matter',
		fullName: 'reagent matter',
		line: 'materials and physical products.',
		email: 'matter@reagent-systems.com',
		logo: '/company-logos/matter.svg',
		art: matterArt,
		slogan: ['u.s.', 'made', 'materials'],
		about: [
			"reagent matter is working toward production of its own, beginning with plastics, so the materials founders depend on can be made in the united states."
		],
	},
	{
		slug: 'defense',
		name: 'defense',
		fullName: 'reagent defense',
		line: 'technology that protects.',
		email: 'defense@reagent-systems.com',
		logo: '/company-logos/defense.svg',
		art: defenseArt,
		slogan: ['for', 'new', 'swords'],
		about: [
			"reagent defense connects founders, engineers and manufacturers who want to change how defense technology gets built, and links them into one supply chain.",
			"we take early projects from an idea to a working prototype, and handle the compliance work that usually slows founders down.",
			"that includes SAM.gov registration, a CAGE code, SBIR and STTR applications, and introductions to manufacturers with relevant experience."
		],
	},
	{
		slug: 'logistics',
		name: 'logistics',
		fullName: 'reagent logistics',
		line: 'moving what we make.',
		email: 'logistics@reagent-systems.com',
		logo: '/company-logos/logistics.svg',
		art: logisticsArt,
		slogan: ['easy', 'supply', 'chains'],
		about: [
			"reagent logistics is working to bring the cost of a hardware prototype close to zero by pre-selling it before it is built.",
			"that depends on accurate, instant manufacturing quotes and a platform that connects founders to the supply chain, so anyone with an idea can get it made."
		],
	},
	{
		slug: 'capital',
		name: 'capital',
		fullName: 'reagent capital',
		line: 'funding the earliest stage.',
		email: 'capital@reagent-systems.com',
		logo: '/company-logos/capital.svg',
		art: capitalArt,
		slogan: ['funds', 'for', 'excellence'],
		about: [
			"reagent capital handles the fundraising side of reagent.",
			"it connects founders with investors who back ambitious ideas, then steps aside; the terms stay between the founder and the investor.",
			"before an introduction, founders get ready with a pitch deck, a cap table, a website, and a data room that sets out the product, what makes it defensible, and where it sits on the roadmap."
		],
	},
	{
		slug: 'research',
		name: 'research',
		fullName: 'reagent research',
		line: 'open science and new architectures.',
		email: 'research@reagent-systems.com',
		logo: '/company-logos/research.svg',
		art: researchArt,
		slogan: ['the', 'new', 'frontier'],
		about: [
			"reagent research runs open science on shared compute, with free training time and inference for people doing machine learning work.",
			"it also funds and curates datasets, so builders get the data, users and testers they would otherwise have to pay for."
		],
	},
	{
		slug: 'creative',
		name: 'creative',
		fullName: 'reagent creative',
		line: 'the community and the craft.',
		email: 'creative@reagent-systems.com',
		logo: '/company-logos/creative.svg',
		slogan: ['the', 'idea', 'factory'],
		about: [
			"reagent began as a studio for builders, and reagent creative is where that community lives: software developers, hardware developers, and people from every background.",
			"members meet on discord to share projects, test each other's work and trade ideas, with free inference, compute and models to build with."
		],
	}
];

// Hero order: creative always loads first.
export const HERO_ORDER = ['creative', 'capital', 'matter', 'research', 'logistics', 'defense'];
