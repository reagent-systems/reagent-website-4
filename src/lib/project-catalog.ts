export type FeaturedProject = {
	id: string;
	name: string;
	tagline: string;
	category: string;
	href: string;
	image: string;
	mediaType?: 'video';
};

/** Curated home-page projects — full grid + GitHub sync live on /projects */
export const featuredProjects: FeaturedProject[] = [
	{
		id: 'brick',
		name: 'BRICK',
		tagline: 'Developer dashboard with MCP, git context, and a monospace inbox for feedback.',
		category: 'product',
		href: 'https://github.com/reagent-systems/BRICK',
		image: '/project-images/BRICK.png'
	},
	{
		id: 'simple-agent-core',
		name: 'simple-agent-core',
		tagline: 'Minimal python agent loop with dynamic tools, loop detection, and sandboxing.',
		category: 'framework',
		href: 'https://github.com/reagent-systems/Simple-Agent-Core',
		image: '/project-images/Simple-Agent-Core.png'
	},
	{
		id: 'openlawn',
		name: 'openlawn',
		tagline: 'AI-powered CRM for lawn care—crews, routes, GPS, and customer summaries.',
		category: 'product',
		href: 'https://github.com/reagent-systems/openlawn',
		image: '/project-images/openlawn.jpg'
	},
	{
		id: 'forgecast',
		name: 'forgecast',
		tagline: 'Terminal manager with mobile companion, session mirror, and finish alerts.',
		category: 'tool',
		href: 'https://github.com/reagent-systems/forgecast',
		image: '/project-images/forgecast.png'
	},
	{
		id: 'tetra',
		name: 'tetra',
		tagline: 'Android agent that reads the screen and acts through accessibility services.',
		category: 'agent',
		href: 'https://github.com/reagent-systems/tetra',
		image: '/project-images/tetra.mp4',
		mediaType: 'video'
	},
	{
		id: 'dither',
		name: 'dither',
		tagline: 'Dither dock for floyd-steinberg, ordered, atkinson, and shape dithering.',
		category: 'tool',
		href: 'https://github.com/reagent-systems/dither',
		image: '/project-images/dither.png'
	},
	{
		id: 'spark',
		name: 'spark',
		tagline: 'On-device LLM chat on Android with optional local API server.',
		category: 'model',
		href: 'https://github.com/reagent-systems/Spark',
		image: '/project-images/Spark.jpg'
	},
	{
		id: 'orc',
		name: 'orc',
		tagline: 'Multi-agent coordination on Google ADK with a shared workspace.',
		category: 'agent',
		href: 'https://github.com/reagent-systems/orc',
		image: '/project-images/orc.png'
	}
];
