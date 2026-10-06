<script lang="ts">
	import { researchHighlights, type ResearchHighlight } from '$lib/research-highlights';

	interface Props {
		items?: ResearchHighlight[];
	}

	let { items = researchHighlights }: Props = $props();
</script>

<section class="home-research" aria-labelledby="home-research-heading">
	<header class="home-research-header">
		<h2 id="home-research-heading" class="home-research-title">research</h2>
		<a class="home-research-all" href="/research">all research</a>
	</header>

	<ul class="home-research-grid">
		{#each items as item (item.id)}
			<li>
				<article class="home-research-card">
					<a class="home-research-media" href={item.link} target="_blank" rel="noopener noreferrer">
						<img src={item.image} alt="" width="640" height="640" loading="lazy" decoding="async" />
					</a>
					<div class="home-research-body">
						<p class="home-research-kind">{item.kind}</p>
						<h3 class="home-research-name">
							<a href={item.link} target="_blank" rel="noopener noreferrer">{item.name}</a>
						</h3>
						<p class="home-research-description">{item.description}</p>
						<a class="home-research-link" href={item.link} target="_blank" rel="noopener noreferrer">
							{item.linkLabel}
						</a>
					</div>
				</article>
			</li>
		{/each}
	</ul>
</section>

<style>
	.home-research {
		position: relative;
		z-index: 1;
		width: 100%;
		padding: clamp(2.5rem, 6vw, 4.5rem) clamp(2rem, 4vw, 4rem) clamp(4rem, 8vw, 6rem);
		background-color: var(--page-background);
	}

	.home-research-header {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem 2rem;
		margin-bottom: clamp(2rem, 4vw, 3rem);
		max-width: 72rem;
		margin-left: auto;
		margin-right: auto;
	}

	.home-research-title {
		margin: 0;
		font-size: clamp(2.75rem, 8vw, 5.5rem);
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: -0.02em;
		font-family: var(--main-font);
		line-height: 1.05;
	}

	.home-research-all {
		font-size: 1.15rem;
		font-weight: 300;
		color: #6b6b6b;
		text-decoration: none;
		text-transform: lowercase;
		letter-spacing: 0.04em;
		font-family: var(--main-font);
		transition: color 0.25s ease;
	}

	.home-research-all:hover,
	.home-research-all:focus-visible {
		color: #1a1a1a;
	}

	.home-research-grid {
		list-style: none;
		margin: 0 auto;
		padding: 0;
		max-width: 72rem;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(2rem, 4vw, 3rem);
	}

	.home-research-card {
		display: grid;
		grid-template-columns: minmax(7rem, 38%) minmax(0, 1fr);
		gap: clamp(1rem, 2.5vw, 1.5rem);
		align-items: center;
	}

	.home-research-media {
		display: block;
		aspect-ratio: 1;
		overflow: hidden;
		text-decoration: none;
	}

	.home-research-media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		image-rendering: pixelated;
		transition: transform 0.35s ease;
	}

	.home-research-media:hover img,
	.home-research-media:focus-visible img {
		transform: scale(1.03);
	}

	.home-research-body {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		min-width: 0;
	}

	.home-research-kind {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 300;
		color: #9a9a9a;
		text-transform: lowercase;
		letter-spacing: 0.1em;
		font-family: var(--main-font);
	}

	.home-research-name {
		margin: 0;
		font-size: clamp(1.25rem, 2.2vw, 1.65rem);
		font-weight: 300;
		line-height: 1.2;
		font-family: var(--main-font);
		text-transform: lowercase;
	}

	.home-research-name a {
		color: #1a1a1a;
		text-decoration: none;
		transition: color 0.25s ease;
	}

	.home-research-name a:hover,
	.home-research-name a:focus-visible {
		color: #2d4a8a;
	}

	.home-research-description {
		margin: 0;
		font-size: clamp(0.98rem, 1.6vw, 1.12rem);
		font-weight: 300;
		color: #6b6b6b;
		line-height: 1.55;
		font-family: var(--main-font);
	}

	.home-research-link {
		align-self: flex-start;
		margin-top: 0.25rem;
		font-size: 0.98rem;
		font-weight: 300;
		color: #888;
		text-decoration: none;
		text-transform: lowercase;
		font-family: var(--main-font);
		transition: color 0.25s ease;
	}

	.home-research-link:hover,
	.home-research-link:focus-visible {
		color: #1a1a1a;
	}

	@media (max-width: 768px) {
		.home-research-grid {
			grid-template-columns: 1fr;
		}

		.home-research-card {
			grid-template-columns: minmax(6rem, 34%) minmax(0, 1fr);
		}
	}
</style>
