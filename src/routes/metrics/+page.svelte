<script lang="ts">
	import { formatMetricValue, type MetricDefinition } from '$lib/metrics-data';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	const metrics = $derived(data.metrics);

	const sections: { slug: string; title: string; ids: string[] }[] = [
		{ slug: 'composite', title: 'Composite', ids: ['flywheel'] },
		{
			slug: 'ai-usage',
			title: 'AI & usage',
			ids: ['models-trained', 'tokens']
		},
		{ slug: 'reach', title: 'Reach', ids: ['users', 'social-posts'] },
		{
			slug: 'projects',
			title: 'Projects',
			ids: [
				'projects-started',
				'projects-released',
				'start-release-gap',
				'fastest-release',
				'updates-shipped',
				'github-stars',
				'commits',
				'automation'
			]
		},
		{ slug: 'business', title: 'Business', ids: ['mrr'] }
	];

	function byId(id: string): MetricDefinition | undefined {
		return metrics.find((m: MetricDefinition) => m.id === id);
	}
</script>

<svelte:head>
	<title>metrics — reagent systems</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="metrics-page">
	<header class="metrics-header">
		<h1 class="metrics-title">metrics</h1>
	</header>

	<div class="metrics-sections">
		{#each sections as section (section.slug)}
			<section class="metrics-block" aria-labelledby="section-{section.slug}">
				<h2 id="section-{section.slug}" class="section-heading">{section.title}</h2>
				<ul class="metric-grid">
					{#each section.ids as id (id)}
						{@const m = byId(id)}
						{#if m}
							<li class="metric-card">
								<span class="metric-label">{m.label}</span>
								<span class="metric-value">{formatMetricValue(m)}</span>
							</li>
						{/if}
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</div>

<style>
	.metrics-page {
		min-height: 100vh;
		padding: 4rem clamp(1.5rem, 4vw, 4rem) 5rem;
		max-width: 960px;
		margin: 0 auto;
		background: var(--page-background);
		color: #1a1a1a;
		font-family: var(--main-font);
	}

	.metrics-header {
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid #e4e4e4;
	}

	.metrics-title {
		font-size: clamp(2.25rem, 5vw, 3.25rem);
		font-weight: 100;
		text-transform: lowercase;
		letter-spacing: -0.03em;
		line-height: 1.05;
		margin: 0;
	}

	.metrics-sections {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.metrics-block {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section-heading {
		font-size: 0.85rem;
		font-weight: 400;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #6b6b6b;
		margin: 0;
		padding-bottom: 0.35rem;
		border-bottom: 1px solid #ececec;
	}

	.metric-grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1rem 1.5rem;
	}

	.metric-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 1.1rem 1.15rem;
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 2px;
		box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
	}

	.metric-label {
		font-size: 0.9rem;
		font-weight: 300;
		color: #4a4a4a;
		line-height: 1.35;
	}

	.metric-value {
		font-family: var(--ascii-font);
		font-weight: 300;
		font-size: 1.65rem;
		line-height: 1.1;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
		color: #111;
	}

	@media (max-width: 520px) {
		.metrics-page {
			padding-top: 2.5rem;
		}

		.metric-value {
			font-size: 1.45rem;
		}
	}
</style>
