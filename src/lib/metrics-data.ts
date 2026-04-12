/**
 * Placeholder metrics for /metrics. Replace with +page.server.ts load + env-backed APIs.
 */
export type MetricFormat = 'number' | 'currency' | 'percent' | 'duration' | 'score';

export interface MetricDefinition {
	id: string;
	label: string;
	value: number | string;
	format: MetricFormat;
	/** Unit suffix when format is duration (e.g. 'days') */
	unit?: string;
	/** Short hint for operators (not shown on the public page) */
	sourceHint?: string;
}

export const METRICS: MetricDefinition[] = [
	{
		id: 'flywheel',
		label: 'Flywheel Score',
		value: 72,
		format: 'score',
		sourceHint: 'Composite index from internal analytics'
	},
	{
		id: 'models-trained',
		label: 'AI Models Trained',
		value: 1,
		format: 'number',
		sourceHint: 'ML platform or training job API'
	},
	{
		id: 'users',
		label: 'Users',
		value: 62,
		format: 'number',
		sourceHint: 'Auth provider or product database'
	},
	{
		id: 'social-posts',
		label: 'Social Media Posts',
		value: 5407,
		format: 'number',
		sourceHint: 'Social scheduling API or platform APIs'
	},
	{
		id: 'tokens',
		label: 'Tokens Processed (30d)',
		value: 321_121_991,
		format: 'number',
		sourceHint: 'Last 30 days; wire to usage API when ready'
	},
	{
		id: 'updates-shipped',
		label: 'Updates Shipped to Existing Projects',
		value: 89,
		format: 'number',
		sourceHint: 'GitHub: sum of max(0, releases − 1) per repo (server +page)'
	},
	{
		id: 'projects-started',
		label: 'Projects Started',
		value: 24,
		format: 'number',
		sourceHint: 'GitHub: repos in lookback (non-fork/archived unless opted in)'
	},
	{
		id: 'projects-released',
		label: 'Projects Released',
		value: 11,
		format: 'number',
		sourceHint: 'GitHub: repos with ≥1 published Release'
	},
	{
		id: 'start-release-gap',
		label: 'Start to Release Time Gap',
		value: 47,
		format: 'duration',
		unit: 'days',
		sourceHint: 'GitHub: mean days from repo createdAt to first published release'
	},
	{
		id: 'fastest-release',
		label: 'Fastest Release',
		value: 288,
		format: 'duration',
		unit: 'hours',
		sourceHint: 'GitHub: min whole hours to first published release among repos with a release'
	},
	{
		id: 'github-stars',
		label: 'GitHub Stars',
		value: 2400,
		format: 'number',
		sourceHint: 'GitHub: sum of stargazerCount on filtered org repos'
	},
	{
		id: 'mrr',
		label: 'MRR Revenue',
		value: 29,
		format: 'currency',
		sourceHint: 'Stripe / Paddle / billing provider'
	},
	{
		id: 'commits',
		label: 'Commits',
		value: 0,
		format: 'number',
		sourceHint: 'GitHub commit search: comma-separated authors + org (same query as automation; max 1000)'
	},
	{
		id: 'automation',
		label: 'Automation Percentage',
		value: 34,
		format: 'percent',
		sourceHint:
			'GitHub commit search: long message > threshold = automated share; short ≤ threshold = human (server)'
	}
];

export function formatMetricValue(m: MetricDefinition): string {
	const v = m.value;
	if (m.format === 'score') return String(v);
	if (m.format === 'percent') return `${v}%`;
	if (m.format === 'currency') {
		const n = typeof v === 'number' ? v : Number(v);
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(n);
	}
	if (m.format === 'duration') {
		return `${v} ${m.unit ?? ''}`.trim();
	}
	if (typeof v === 'number') {
		return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v);
	}
	return String(v);
}
