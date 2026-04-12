import type { PageServerLoad } from './$types';
import { METRICS, type MetricDefinition } from '$lib/metrics-data';
import { automationCommitSearchFromEnv, githubMetricsFromEnv } from '$lib/server/github-metrics';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async () => {
	const [gh, automation] = await Promise.all([
		githubMetricsFromEnv(env),
		automationCommitSearchFromEnv(env)
	]);

	let metrics: MetricDefinition[] = METRICS.map((m) => ({ ...m }));

	if (gh?.ok) {
		metrics = metrics.map((m) => {
			switch (m.id) {
				case 'projects-started':
					return { ...m, value: gh.projectsStarted };
				case 'projects-released':
					return { ...m, value: gh.projectsReleased };
				case 'start-release-gap':
					return { ...m, value: gh.startReleaseGapDays, unit: 'days' };
				case 'fastest-release':
					return { ...m, value: gh.fastestReleaseGapHours, unit: 'hours' };
				case 'github-stars':
					return { ...m, value: gh.githubStars };
				case 'updates-shipped':
					return { ...m, value: gh.updatesShipped };
				default:
					return m;
			}
		});
	}

	if (automation?.ok) {
		metrics = metrics.map((m) => {
			if (m.id === 'commits') return { ...m, value: automation.commitCount };
			if (m.id === 'automation') return { ...m, value: automation.percent };
			return m;
		});
	}

	return { metrics };
};
