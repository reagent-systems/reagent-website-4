export type HomeFriend = {
	id: string;
	name: string;
	href?: string;
	logoSrc: string;
	logoAlt: string;
};

export const homeFriends: HomeFriend[] = [
	{
		id: 'nvidia',
		name: 'NVIDIA',
		href: 'https://www.nvidia.com/',
		logoSrc: '/friends-of-reagent/nvidia.svg',
		logoAlt: 'NVIDIA'
	},
	{
		id: 'florida-poly',
		name: 'Florida Polytechnic University',
		href: 'https://floridapoly.edu/',
		logoSrc: '/friends-of-reagent/florida-poly.png',
		logoAlt: 'Florida Polytechnic University'
	},
	{
		id: 'fca',
		name: 'Florida College of the Arts',
		href: 'https://www.fcarocks.com/',
		logoSrc: '/friends-of-reagent/fca.webp',
		logoAlt: 'Florida College of the Arts'
	},
	{
		id: 'github',
		name: 'GitHub',
		href: 'https://github.com/',
		logoSrc: '/friends-of-reagent/github.png',
		logoAlt: 'GitHub'
	},
	{
		id: 'nsf',
		name: 'National Science Foundation',
		href: 'https://www.nsf.gov/',
		logoSrc: '/friends-of-reagent/nsf.svg',
		logoAlt: 'National Science Foundation'
	}
];
