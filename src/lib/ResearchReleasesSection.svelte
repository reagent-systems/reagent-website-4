<script lang="ts">
	import ResearchNumText from '$lib/ResearchNumText.svelte';
	import { researchReleases, type ResearchReleaseRow } from '$lib/research-releases';

	interface Props {
		rows?: ResearchReleaseRow[];
		/** Home embed: section title reads "research" and links to /research. */
		linkTitleToResearch?: boolean;
		/** When true, show the top divider used on the research route. */
		showTopRule?: boolean;
	}

	let { rows = researchReleases, linkTitleToResearch = false, showTopRule = false }: Props = $props();

	const sectionTitleId = $derived(linkTitleToResearch ? 'home-research-title' : 'releases-title');
</script>

<section
	class="research-releases"
	class:research-releases--home={linkTitleToResearch}
	class:research-releases--ruled={showTopRule}
	aria-labelledby={sectionTitleId}
>
	<header class="releases-header">
		{#if linkTitleToResearch}
			<h2 id={sectionTitleId} class="research-releases-title">
				<a class="research-releases-title-link" href="/research">research</a>
			</h2>
		{:else}
			<h2 id={sectionTitleId} class="research-releases-title">releases</h2>
		{/if}
	</header>
	<div class="releases-scroll">
		<table class="releases-table">
			<thead>
				<tr>
					<th scope="col" class="col-idx"></th>
					<th scope="col">project name</th>
					<th scope="col">type</th>
					<th scope="col">details</th>
					<th scope="col">release date</th>
					<th scope="col">size</th>
				</tr>
			</thead>
			<tbody>
				{#each rows as row, i}
					<tr>
						<td class="col-idx"><span class="research-num">{i}</span></td>
						<td class="col-name">
							<a href={row.url} target="_blank" rel="noopener noreferrer">
								<ResearchNumText text={row.name} />
							</a>
						</td>
						<td class="col-type">{row.type}</td>
						<td class="col-details"><ResearchNumText text={row.details} /></td>
						<td class="col-date"><span class="research-num">{row.date}</span></td>
						<td class="col-size">
							{#if row.size}<span class="research-num">{row.size}</span>{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<style>
	.research-releases {
		width: 100%;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}

	.research-releases--ruled {
		border-top: 1px solid #e8e8e8;
		padding-top: clamp(2rem, 4vw, 3rem);
	}

	.research-releases--home {
		--research-veil: var(--page-background);

		position: relative;
		z-index: 1;
		width: 100%;
		max-width: none;
		margin-left: 0;
		margin-right: 0;
		margin-bottom: 0;
		padding: clamp(3.25rem, 6.5vw, 5rem) clamp(2rem, 4vw, 4rem) clamp(4rem, 8vw, 6.25rem);
		box-sizing: border-box;
		border: none;
		background: color-mix(in srgb, var(--research-veil) 58%, transparent);
		backdrop-filter: blur(18px) saturate(1.08);
		-webkit-backdrop-filter: blur(18px) saturate(1.08);
		box-shadow:
			0 0 64px 32px var(--research-veil),
			0 28px 56px 28px var(--research-veil),
			0 -28px 56px 28px var(--research-veil);
		isolation: isolate;
	}

	.research-releases--home .releases-header,
	.research-releases--home .releases-scroll {
		max-width: 72rem;
		margin-left: auto;
		margin-right: auto;
		width: 100%;
	}

	.releases-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem 1.5rem;
		margin-bottom: 1.5rem;
	}

	.research-releases-title {
		font-size: clamp(1.5rem, 3vw, 2.1rem);
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		margin: 0;
		font-family: var(--main-font);
		letter-spacing: -0.01em;
	}

	.research-releases-title-link {
		color: inherit;
		text-decoration: none;
		transition: color 0.25s ease;
	}

	.research-releases-title-link:hover,
	.research-releases-title-link:focus-visible {
		color: #6b6b6b;
	}

	.releases-scroll {
		width: 100%;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.releases-table {
		width: 100%;
		border-collapse: collapse;
		min-width: 720px;
		font-family: var(--main-font);
	}

	.releases-table th {
		text-align: left;
		font-weight: 300;
		font-size: 0.8rem;
		color: #888;
		text-transform: lowercase;
		letter-spacing: 0.04em;
		padding: 0.65rem 0.75rem 0.85rem 0;
		border-bottom: 1px solid #e8e8e8;
		white-space: nowrap;
	}

	.releases-table td {
		padding: 1rem 0.75rem 1rem 0;
		border-bottom: 1px solid #f0f0f0;
		vertical-align: top;
		font-weight: 300;
		font-size: clamp(0.95rem, 1.4vw, 1.05rem);
		color: #6b6b6b;
	}

	.releases-table tr:hover td {
		background: rgba(255, 255, 255, 0.55);
	}

	.research-num {
		font-family: var(--ascii-font);
		font-weight: 100;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.01em;
	}

	.col-idx {
		width: 2.5rem;
		color: #b0b0b0 !important;
		font-family: var(--ascii-font);
		font-size: 0.85rem !important;
	}

	.col-name {
		min-width: 10rem;
	}

	.col-name a {
		color: #1a1a1a;
		text-decoration: none;
		text-transform: lowercase;
		transition: color 0.3s ease;
	}

	.col-name a:hover {
		color: #6b6b6b;
	}

	.col-type {
		text-transform: uppercase;
		font-family: var(--ascii-font);
		font-weight: 100;
		font-size: 0.75rem !important;
		letter-spacing: 0.06em;
		color: #888 !important;
		white-space: nowrap;
		width: 6.5rem;
	}

	.col-details {
		max-width: 28rem;
		line-height: 1.45;
	}

	.col-date {
		font-family: var(--ascii-font);
		font-size: 0.85rem !important;
		white-space: nowrap;
		width: 5.5rem;
		color: #888 !important;
	}

	.col-size {
		font-family: var(--ascii-font);
		font-size: 0.85rem !important;
		white-space: nowrap;
		width: 3.5rem;
		color: #888 !important;
	}
</style>
