<script lang="ts">
	import { featuredProjects, type FeaturedProject } from '$lib/project-catalog';

	interface Props {
		projects?: FeaturedProject[];
	}

	let { projects = featuredProjects }: Props = $props();
</script>

{#snippet projectCard(project: FeaturedProject)}
	<article class="home-project-card">
		<a
			class="home-project-card-link"
			href={project.href}
			target="_blank"
			rel="noopener noreferrer"
		>
			<div class="home-project-media">
				{#if project.mediaType === 'video'}
					<video
						class="home-project-visual"
						src={project.image}
						autoplay
						loop
						muted
						playsinline
						preload="metadata"
					></video>
				{:else}
					<img
						class="home-project-visual"
						src={project.image}
						alt=""
						width="480"
						height="560"
						loading="lazy"
						decoding="async"
					/>
				{/if}
			</div>
			<div class="home-project-body">
				<span class="home-project-category">{project.category}</span>
				<h3 class="home-project-name">{project.name}</h3>
				<p class="home-project-tagline">{project.tagline}</p>
			</div>
		</a>
	</article>
{/snippet}

<section class="home-projects" aria-labelledby="home-projects-title">
	<header class="home-projects-header">
		<h2 id="home-projects-title" class="home-projects-title">
			<a class="home-projects-title-link" href="/projects">projects</a>
		</h2>
		<p class="home-projects-lede">open repos we ship and maintain</p>
	</header>

	<div class="home-projects-carousel">
		<div class="home-projects-track">
			{#each [0, 1] as copy (copy)}
				<div class="home-projects-row" aria-hidden={copy === 1 ? true : undefined}>
					{#each projects as project (copy + project.id)}
						{@render projectCard(project)}
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<ul class="home-projects-sr-list">
		{#each projects as project (project.id)}
			<li>
				<a href={project.href}>{project.name}</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	.home-projects {
		--projects-veil: var(--page-background);
		--projects-marquee-gap: clamp(1.25rem, 2.5vw, 1.75rem);

		position: relative;
		z-index: 1;
		width: 100%;
		padding: clamp(2.25rem, 5vw, 3.5rem) 0 clamp(3.5rem, 8vw, 5.5rem);
		border: none;
		background: color-mix(in srgb, var(--projects-veil) 58%, transparent);
		backdrop-filter: blur(18px) saturate(1.08);
		-webkit-backdrop-filter: blur(18px) saturate(1.08);
		box-shadow:
			0 0 64px 32px var(--projects-veil),
			0 28px 56px 28px var(--projects-veil),
			0 -28px 56px 28px var(--projects-veil);
		isolation: isolate;
	}

	.home-projects-header {
		position: relative;
		z-index: 1;
		max-width: 72rem;
		margin: 0 auto clamp(1.75rem, 3.5vw, 2.5rem);
		padding: 0 clamp(2rem, 4vw, 4rem);
	}

	.home-projects-title {
		margin: 0;
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 100;
		line-height: 1.05;
		font-family: var(--main-font);
		text-transform: lowercase;
		letter-spacing: -0.02em;
	}

	.home-projects-title-link {
		color: #1a1a1a;
		text-decoration: none;
		transition: color 0.25s ease;
	}

	.home-projects-title-link:hover,
	.home-projects-title-link:focus-visible {
		color: #6b6b6b;
	}

	.home-projects-lede {
		margin: 0.65rem 0 0;
		font-size: clamp(1rem, 1.8vw, 1.15rem);
		font-weight: 300;
		color: #888;
		font-family: var(--main-font);
		text-transform: lowercase;
		letter-spacing: 0.03em;
	}

	.home-projects-carousel {
		position: relative;
		z-index: 1;
		overflow: hidden;
		padding-inline: clamp(2rem, 4vw, 4rem);
		mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
	}

	.home-projects-track {
		display: flex;
		width: max-content;
		gap: var(--projects-marquee-gap);
		will-change: transform;
		animation: projects-marquee 72s linear infinite;
	}

	.home-projects-carousel:hover .home-projects-track {
		animation-play-state: paused;
	}

	@media (prefers-reduced-motion: reduce) {
		.home-projects-track {
			animation: none;
		}

		.home-projects-carousel {
			overflow-x: auto;
			scrollbar-width: none;
			mask-image: none;
		}

		.home-projects-carousel::-webkit-scrollbar {
			display: none;
		}
	}

	.home-projects-row {
		display: flex;
		flex: 0 0 auto;
		gap: var(--projects-marquee-gap);
	}

	.home-project-card {
		flex: 0 0 min(78vw, 19rem);
		width: min(78vw, 19rem);
	}

	.home-project-card-link {
		display: flex;
		flex-direction: column;
		height: 100%;
		text-decoration: none;
		color: inherit;
		border-radius: 1.25rem;
		overflow: hidden;
		background: color-mix(in srgb, var(--projects-veil) 82%, #ffffff 18%);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.home-project-card-link:hover,
	.home-project-card-link:focus-visible {
		transform: translateY(-4px);
		box-shadow: 0 18px 40px -24px rgba(26, 26, 26, 0.35);
	}

	.home-project-media {
		aspect-ratio: 4 / 5;
		overflow: hidden;
		background: #ececec;
	}

	.home-project-visual {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		image-rendering: pixelated;
	}

	.home-project-body {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 1.1rem 1.15rem 1.25rem;
		min-height: 7.5rem;
	}

	.home-project-category {
		font-family: var(--ascii-font);
		font-size: 0.68rem;
		font-weight: 100;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #9a9a9a;
	}

	.home-project-name {
		margin: 0;
		font-size: clamp(1.15rem, 2vw, 1.35rem);
		font-weight: 300;
		line-height: 1.2;
		color: #1a1a1a;
		text-transform: lowercase;
		font-family: var(--main-font);
	}

	.home-project-tagline {
		margin: 0;
		font-size: clamp(0.92rem, 1.5vw, 1rem);
		font-weight: 300;
		line-height: 1.45;
		color: #6b6b6b;
		font-family: var(--main-font);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		overflow: hidden;
	}

	.home-projects-sr-list {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@keyframes projects-marquee {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			transform: translate3d(calc(-50% - var(--projects-marquee-gap) / 2), 0, 0);
		}
	}

	@media (min-width: 900px) {
		.home-project-card {
			flex-basis: 17.5rem;
			width: 17.5rem;
		}
	}
</style>
