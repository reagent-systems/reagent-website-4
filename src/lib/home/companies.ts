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
	/** What the company does, in our own words (from founder calls). */
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
			"matter is the long road. we want to get into production ourselves, starting with plastics."
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
			"a strategic partnership network of people who want to make change in the defense industry, and bring together a supply chain for new technology.",
			"if you're at a zero, we want to get you to a five. we take care of the compliance roadblocks ourselves, because that's just paperwork, and paperwork is easy.",
			"SAM.gov registration, a CAGE code, SBIR and STTR applications, and introductions to manufacturers who have built this before."
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
			"we want to get the cost of prototyping hardware to zero, by pre-selling it as much as possible.",
			"that takes accurate, instant quotes, and a platform that connects the manufacturing supply chain. one button, so hardware is essentially free to prototype and make for everybody with an idea."
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
			"capital is the one tied to the fundraising.",
			"we know a network of investors who invest in ideas that are high in the sky, but really good. we make the introduction; we don't take part in the negotiation.",
			"before that, you'll need a pitch deck, a cap table, a website, and a data room: here's the product, here's the moat, here's the stage on the roadmap, and how defensible it is."
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
			"we're a research company. we offer free compute and free inference to people doing ML work, and we fund the data.",
			"let me give you that data set, those users, those testers, the things you would have spent the money on. let me just get you them directly."
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
			"i built reagent as a builder platform, modeled on an indie studio: software developers, hardware developers, and people from all walks of life.",
			"creative is that community. it lives on discord, where it's easy to get everybody working together, show off projects and come up with ideas. we give developers free inference, compute and models."
		],
	}
];

// Hero order: creative always loads first.
export const HERO_ORDER = ['creative', 'capital', 'matter', 'research', 'logistics', 'defense'];
