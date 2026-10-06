<script lang="ts">
	import { featuredProjects, type FeaturedProject } from '$lib/project-catalog';

	interface Props {
		projects?: FeaturedProject[];
	}

	let { projects = featuredProjects }: Props = $props();

	/** Two laps on the same large ring → tighter angular spacing (~7 faces in view). */
	const cylinderPanels = $derived([...projects, ...projects]);
	const count = $derived(cylinderPanels.length);
</script>

{#snippet projectCard(project: FeaturedProject)}
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
{/snippet}

<section class="home-projects" aria-labelledby="home-projects-title">
	<header class="home-projects-header">
		<h2 id="home-projects-title" class="home-projects-title">
			<a class="home-projects-title-link" href="/projects">projects</a>
		</h2>
	</header>

	<div class="cylinder-scene">
		<div class="cylinder" style="--cylinder-count: {count}">
			{#each cylinderPanels as project, i (`${i}-${project.id}`)}
				<div class="cylinder-panel" style="--cylinder-index: {i}">
					{@render projectCard(project)}
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
		--cylinder-card-w: min(52vw, 9.25rem);
		--cylinder-card-h: 15.5rem;
		--cylinder-radius: clamp(28rem, 72vw, 44rem);

		position: relative;
		z-index: 1;
		width: 100%;
		margin-top: clamp(1.5rem, 3.5vw, 2.75rem);
		padding: 0 0 clamp(3.5rem, 8vw, 5.5rem);
		overflow: visible;
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
		z-index: 2;
		max-width: 72rem;
		margin: clamp(-2rem, -4vw, -1.25rem) auto clamp(3.25rem, 7vw, 4.75rem);
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

	.cylinder-scene {
		position: relative;
		z-index: 1;
		width: 100%;
		min-height: calc(var(--cylinder-card-h) + 8rem);
		padding: 2.5rem 0 3.5rem;
		perspective: clamp(1000px, 120vw, 1600px);
		perspective-origin: 50% 48%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: visible;
	}

	.cylinder {
		position: relative;
		width: var(--cylinder-card-w);
		height: var(--cylinder-card-h);
		transform-style: preserve-3d;
		-webkit-transform-style: preserve-3d;
		will-change: transform;
		animation: cylinder-rotate 64s linear infinite;
	}

	.cylinder-scene:hover .cylinder {
		animation-play-state: paused;
	}

	@media (prefers-reduced-motion: reduce) {
		.cylinder-scene {
			height: auto;
			perspective: none;
			overflow-x: auto;
			justify-content: flex-start;
			padding: 0 clamp(2rem, 4vw, 4rem) 0.5rem;
			scrollbar-width: none;
		}

		.cylinder-scene::-webkit-scrollbar {
			display: none;
		}

		.cylinder {
			display: flex;
			width: max-content;
			height: auto;
			gap: 1.25rem;
			animation: none;
			transform: none !important;
		}

		.cylinder-panel {
			position: relative !important;
			transform: none !important;
			width: min(62vw, 11rem);
		}
	}

	.cylinder-panel {
		position: absolute;
		inset: 0;
		transform-style: preserve-3d;
		-webkit-transform-style: preserve-3d;
		backface-visibility: hidden;
		transform: rotateY(calc(var(--cylinder-index) * (360deg / var(--cylinder-count))))
			translateZ(var(--cylinder-radius));
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
		box-shadow: 0 12px 32px -20px rgba(26, 26, 26, 0.45);
		transition:
			box-shadow 0.3s ease,
			filter 0.3s ease;
	}

	.home-project-card-link:hover,
	.home-project-card-link:focus-visible {
		box-shadow: 0 20px 44px -18px rgba(26, 26, 26, 0.5);
		filter: brightness(1.02);
	}

	.home-project-media {
		aspect-ratio: 4 / 5;
		flex: 1 1 auto;
		min-height: 0;
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
		gap: 0.25rem;
		padding: 0.75rem 0.85rem 0.9rem;
		flex: 0 0 auto;
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
		font-size: clamp(0.95rem, 1.6vw, 1.1rem);
		font-weight: 300;
		line-height: 1.2;
		color: #1a1a1a;
		text-transform: lowercase;
		font-family: var(--main-font);
	}

	.home-project-tagline {
		margin: 0;
		font-size: clamp(0.78rem, 1.2vw, 0.88rem);
		font-weight: 300;
		line-height: 1.4;
		color: #6b6b6b;
		font-family: var(--main-font);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
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

	@keyframes cylinder-rotate {
		from {
			transform: rotateY(0deg);
		}
		to {
			transform: rotateY(-360deg);
		}
	}

	@media (min-width: 900px) {
		.home-projects {
			--cylinder-card-w: 9rem;
			--cylinder-card-h: 15.25rem;
			--cylinder-radius: 42rem;
		}
	}
</style>
