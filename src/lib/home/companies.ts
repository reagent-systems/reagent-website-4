export interface Company {
	slug: string;
	name: string;
	fullName: string;
	line: string;
	email: string;
	logo: string;
}

// Logos in /static/company-logos are placeholders until the final marks arrive.
export const COMPANIES: Company[] = [
	{
		slug: 'matter',
		name: 'matter',
		fullName: 'reagent matter',
		line: 'materials and physical products.',
		email: 'matter@reagent-systems.com',
		logo: '/company-logos/matter.svg'
	},
	{
		slug: 'defense',
		name: 'defense',
		fullName: 'reagent defense',
		line: 'technology that protects.',
		email: 'defense@reagent-systems.com',
		logo: '/company-logos/defense.svg'
	},
	{
		slug: 'logistics',
		name: 'logistics',
		fullName: 'reagent logistics',
		line: 'moving what we make.',
		email: 'logistics@reagent-systems.com',
		logo: '/company-logos/logistics.svg'
	},
	{
		slug: 'capital',
		name: 'capital',
		fullName: 'reagent capital',
		line: 'funding the earliest stage.',
		email: 'capital@reagent-systems.com',
		logo: '/company-logos/capital.svg'
	},
	{
		slug: 'research',
		name: 'research',
		fullName: 'reagent research',
		line: 'open science and new architectures.',
		email: 'research@reagent-systems.com',
		logo: '/company-logos/research.svg'
	},
	{
		slug: 'creative',
		name: 'creative',
		fullName: 'reagent creative',
		line: 'the community and the craft.',
		email: 'creative@reagent-systems.com',
		logo: '/company-logos/creative.svg'
	}
];
