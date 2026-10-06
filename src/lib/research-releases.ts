export type ResearchReleaseRow = {
	name: string;
	type: string;
	details: string;
	date: string;
	size: string;
	url: string;
};

const releaseRows: ResearchReleaseRow[] = [
	{
		name: 'phone-agent',
		type: 'agent',
		details: 'typescript agent stack for phone-centric workflows with docker-friendly deploy paths.',
		date: '04/03/26',
		size: '',
		url: 'https://github.com/reagent-systems/phone-agent'
	},
	{
		name: 'dandelion',
		type: 'research',
		details: 'cuda / python / common lisp workshop for neuro-symbolic prototypes.',
		date: '04/02/26',
		size: '',
		url: 'https://github.com/reagent-systems/dandelion'
	},
	{
		name: 'bently coder 7b',
		type: 'model',
		details: 'qlora coding model on qwen2.5-coder-7b-instruct; bigcodebench hard 92%, humaneval 86%.',
		date: '03/01/26',
		size: '7B',
		url: 'https://huggingface.co/Bentlybro/bently-coder-7b'
	},
	{
		name: 'simple-agent-protocol',
		type: 'framework',
		details: 'websocket hub coordinating simple-agent-websocket instances and task delegation.',
		date: '05/31/25',
		size: '',
		url: 'https://github.com/reagent-systems/Simple-Agent-Protocol'
	},
	{
		name: 'simple-agent-websocket',
		type: 'framework',
		details: 'thin websocket wrapper around simple-agent-core for real-time web sessions.',
		date: '05/28/25',
		size: '',
		url: 'https://github.com/reagent-systems/Simple-Agent-Websocket'
	},
	{
		name: 'simple-agent-tools',
		type: 'tools',
		details: 'remote command catalog loaded on demand by simple-agent-core.',
		date: '05/23/25',
		size: '',
		url: 'https://github.com/reagent-systems/Simple-Agent-Tools'
	},
	{
		name: 'simple-agent-core',
		type: 'framework',
		details: 'minimalist python agent loop with dynamic tools, loop detection, and sandboxing.',
		date: '04/16/25',
		size: '',
		url: 'https://github.com/reagent-systems/Simple-Agent-Core'
	},
	{
		name: 'dither',
		type: 'tool',
		details: 'desktop dither dock: floyd-steinberg, ordered, atkinson, and shape dithering.',
		date: '07/08/25',
		size: '',
		url: 'https://github.com/reagent-systems/dither'
	},
	{
		name: 'orc',
		type: 'agent',
		details: 'autonomous multi-agent system on google adk with shared-workspace coordination.',
		date: '06/28/25',
		size: '',
		url: 'https://github.com/reagent-systems/orc'
	},
	{
		name: 'tetra',
		type: 'agent',
		details: 'android automation agent using screen analysis and accessibility actions.',
		date: '06/23/25',
		size: '',
		url: 'https://github.com/reagent-systems/tetra'
	},
	{
		name: 'spark',
		type: 'model',
		details: 'on-device android llm chat companion with optional local api server.',
		date: '06/24/25',
		size: '',
		url: 'https://github.com/reagent-systems/Spark'
	}
];

function parseReleaseDate(d: string): number {
	const [mm, dd, yy] = d.split('/').map(Number);
	return new Date(2000 + yy, mm - 1, dd).getTime();
}

/** Curated research releases, table shaped like nousresearch.com/releases */
export const researchReleases: ResearchReleaseRow[] = [...releaseRows].sort(
	(a, b) => parseReleaseDate(b.date) - parseReleaseDate(a.date)
);
