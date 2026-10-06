export type ResearchHighlight = {
	id: string;
	name: string;
	description: string;
	link: string;
	linkLabel: string;
	image: string;
	kind: 'architecture' | 'model';
};

export const researchHighlights: ResearchHighlight[] = [
	{
		id: 'dandelion',
		name: 'dandelion',
		description:
			'cuda, python, and common lisp research codebase for neuro-symbolic prototypes that need hardware contact.',
		link: 'https://github.com/reagent-systems/dandelion',
		linkLabel: 'github',
		image: '/research-images/dandelion.png',
		kind: 'architecture'
	},
	{
		id: 'simple-agent-core',
		name: 'simple-agent-core',
		description:
			'minimalist python agent framework: dynamic tool loading, loop detection, sandboxed file work, multi-provider.',
		link: 'https://github.com/reagent-systems/Simple-Agent-Core',
		linkLabel: 'github',
		image: '/research-images/simple-agent-core.png',
		kind: 'architecture'
	},
	{
		id: 'phone-agent',
		name: 'phone-agent',
		description:
			'typescript agent stack oriented toward phone-centric workflows, with docker-friendly deployment paths.',
		link: 'https://github.com/reagent-systems/phone-agent',
		linkLabel: 'github',
		image: '/research-images/phone-agent.png',
		kind: 'architecture'
	},
	{
		id: 'bently-coder-7b',
		name: 'bently coder 7b',
		description:
			'apache-2.0 coding model: qwen2.5-coder-7b-instruct plus qlora on about 7k personal github instruction pairs.',
		link: 'https://huggingface.co/Bentlybro/bently-coder-7b',
		linkLabel: 'huggingface',
		image: '/research-images/bently-coder-7b.png',
		kind: 'model'
	}
];
