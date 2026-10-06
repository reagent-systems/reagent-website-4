export type HomePartner = {
	name: string;
	href?: string;
	logoSrc?: string;
	logoAlt?: string;
};

/** Edit this list with real partner names, links, and optional logo paths under /static/partners/. */
export const homePartners: HomePartner[] = [
	{ name: 'github', href: 'https://github.com/reagent-systems' },
	{ name: 'discord', href: 'https://discord.reagent-systems.com/' },
	{ name: 'openlawn', href: 'https://github.com/reagent-systems/openlawn' },
	{ name: 'simple agent', href: 'https://github.com/reagent-systems/Simple-Agent-Core' },
	{ name: 'brick', href: 'https://github.com/reagent-systems/BRICK' },
	{ name: 'forgecast', href: 'https://github.com/reagent-systems/forgecast' },
	{ name: 'dandelion', href: 'https://github.com/reagent-systems/dandelion' },
	{ name: 'x', href: 'https://x.com/Reagent_Systems' }
];
