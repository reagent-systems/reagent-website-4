import { capitalArt } from './capital-art';
import { defenseArt } from './defense-art';
import { logisticsArt } from './logistics-art';
import { matterArt } from './matter-art';

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
		slogan: ['u.s.', 'made', 'materials']
	},
	{
		slug: 'defense',
		name: 'defense',
		fullName: 'reagent defense',
		line: 'technology that protects.',
		email: 'defense@reagent-systems.com',
		logo: '/company-logos/defense.svg',
		art: defenseArt,
		slogan: ['for', 'new', 'swords']
	},
	{
		slug: 'logistics',
		name: 'logistics',
		fullName: 'reagent logistics',
		line: 'moving what we make.',
		email: 'logistics@reagent-systems.com',
		logo: '/company-logos/logistics.svg',
		art: logisticsArt,
		slogan: ['easy', 'supply', 'chains']
	},
	{
		slug: 'capital',
		name: 'capital',
		fullName: 'reagent capital',
		line: 'funding the earliest stage.',
		email: 'capital@reagent-systems.com',
		logo: '/company-logos/capital.svg',
		art: capitalArt,
		slogan: ['funds', 'for', 'excellence']
	},
	{
		slug: 'research',
		name: 'research',
		fullName: 'reagent research',
		line: 'open science and new architectures.',
		email: 'research@reagent-systems.com',
		logo: '/company-logos/research.svg',
		slogan: ['the', 'new', 'frontier']
	},
	{
		slug: 'creative',
		name: 'creative',
		fullName: 'reagent creative',
		line: 'the community and the craft.',
		email: 'creative@reagent-systems.com',
		logo: '/company-logos/creative.svg',
		slogan: ['the', 'idea', 'factory']
	}
];

// Hero order: creative always loads first.
export const HERO_ORDER = ['creative', 'capital', 'matter', 'research', 'logistics', 'defense'];
