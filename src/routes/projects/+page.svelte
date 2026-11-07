<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { asciiArt } from '$lib/ascii-art-2';
	import PageSubnav from '$lib/PageSubnav.svelte';
	import { PROJECTS } from '$lib/projects';

	interface Repository {
		name: string;
		description: string | null;
		html_url: string;
		readme?: string;
		image_url?: string; // Image URL from README or static folder
	}

	let mounted = $state(false);
	let repositories = $state<Repository[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let animationId: number | null = null;
	let startTime = Date.now();
	const imageOffsets = new Map<HTMLElement, number>();
	// ASCII background animation (same as main page)
	let asciiRotateX = $state(0);
	let asciiRotateY = $state(0);
	let asciiScale = $state(1);
	const asciiMaxRotation = 15;
	const asciiAnimationSpeed = 0.0003;
	const asciiBreathingSpeed = 0.0005;
	const asciiBreathingAmount = 0.05;


	// Animation parameters - only Y rotation (swivel), no X rotation
	const maxRotation = 15; // Maximum rotation in degrees
	const animationSpeed = 0.0003; // Speed of rotation
	const breathingSpeed = 0.0005; // Speed of breathing effect
	const breathingAmount = 0.05; // Amount of scale change (5% zoom in/out)

	function initializeImageOffsets() {
		const wrappers = document.querySelectorAll('.project-image-wrapper');
		wrappers.forEach((wrapper) => {
			const htmlWrapper = wrapper as HTMLElement;
			if (!imageOffsets.has(htmlWrapper)) {
				imageOffsets.set(htmlWrapper, Math.random());
			}
		});
	}

	// Cache DOM queries to avoid forced reflows
	let cachedWrappers: NodeListOf<Element> | null = null;
	
	function getWrappers() {
		// Only re-query if cache is invalid
		if (!cachedWrappers || cachedWrappers.length === 0) {
			cachedWrappers = document.querySelectorAll('.project-image-wrapper');
		}
		return cachedWrappers;
	}

	function animate() {
		if (!mounted) {
			animationId = requestAnimationFrame(animate);
			return;
		}

		// Use performance.now() for better accuracy and performance
		const now = performance.now();
		const baseElapsed = (now - startTime) * animationSpeed;
		const baseBreathingElapsed = (now - startTime) * breathingSpeed;
		
		// Apply transform to all project image wrappers with their individual offsets
		const wrappers = getWrappers();
		if (wrappers.length > 0) {
			// Batch DOM updates using requestAnimationFrame
			wrappers.forEach((wrapper) => {
				const htmlWrapper = wrapper as HTMLElement;
				const offset = imageOffsets.get(htmlWrapper) || 0;
				
				// Apply offset to elapsed time
				const elapsed = baseElapsed + (offset * Math.PI * 2);
				const breathingElapsed = baseBreathingElapsed + (offset * Math.PI * 2);
				
				// Only Y rotation (swivel), no X rotation
				const rotateY = Math.cos(-elapsed) * maxRotation;
				
				// Breathing effect - slow zoom in and out
				const scale = 1 + Math.sin(breathingElapsed) * breathingAmount;
				
				htmlWrapper.style.transform = 
					`perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`;
			});
		}

		// ASCII background animation (mirrors main page)
		const asciiElapsed = (now - startTime) * asciiAnimationSpeed;
		const asciiBreathingElapsed = (now - startTime) * asciiBreathingSpeed;
		asciiRotateX = Math.sin(-asciiElapsed) * asciiMaxRotation;
		asciiRotateY = Math.cos(-asciiElapsed) * asciiMaxRotation;
		asciiScale = 1 + Math.sin(asciiBreathingElapsed) * asciiBreathingAmount;
		
		animationId = requestAnimationFrame(animate);
	}

	// The project list lives in $lib/projects so the creative page can share it.
	const staticProjects: Omit<Repository, 'readme'>[] = PROJECTS.map((p) => ({
		name: p.name,
		description: p.description,
		html_url: p.url,
		image_url: undefined
	}));

	async function loadProjects() {
		if (!browser) return;
		
		try {
			// Check for static images in project-images folder (both .png and .jpg)
			const projectsWithImages = await Promise.all(
				staticProjects.map(async (project) => {
					let imageUrl = project.image_url;
					
					// Check for .mp4, .png, then .jpg
					const extensions = ['.mp4', '.png', '.jpg'];
					for (const ext of extensions) {
						const staticMediaUrl = `/project-images/${project.name}${ext}`;
						try {
							const mediaCheck = await fetch(staticMediaUrl, { method: 'HEAD' });
							if (mediaCheck.ok) {
								imageUrl = staticMediaUrl;
								break;
							}
						} catch (e) {
							// Continue to next extension
						}
					}
					
					return {
						...project,
						image_url: imageUrl,
						readme: ''
					};
				})
			);
			
			repositories = projectsWithImages;
			loading = false;
			// Invalidate cache when projects load (DOM changes)
			cachedWrappers = null;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load projects';
			loading = false;
			console.error('Error loading projects:', err);
		}
	}

	onMount(() => {
		mounted = true;
		loadProjects();
		startTime = Date.now();
		animate();
		
		// Initialize offsets after a short delay to ensure DOM is ready
		setTimeout(() => {
			initializeImageOffsets();
			// Cache wrappers after DOM is ready
			cachedWrappers = document.querySelectorAll('.project-image-wrapper');
		}, 100);
		
		return () => {
			if (animationId !== null) {
				cancelAnimationFrame(animationId);
			}
			cachedWrappers = null;
		};
	});

	onDestroy(() => {
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
		}
	});
</script>

<svelte:head>
	<title>reagent's projects - reagent systems</title>
	<meta name="title" content="reagent's projects - reagent systems" />
	<meta name="description" content="explore reagent systems' open source projects" />
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="projects-page" class:mounted>
	<div class="projects-ascii-bg" aria-hidden="true">
		<pre
			class="projects-ascii-art"
			style="transform: perspective(1000px) rotateX({asciiRotateX}deg) rotateY({asciiRotateY}deg) scale({asciiScale});"
		>{asciiArt}</pre>
	</div>
	<div class="projects-content">
		<div class="projects-header">
			<h1 class="projects-title">projects</h1>
		</div>

	{#if loading}
		<div class="loading">loading projects...</div>
	{:else if error}
		<div class="error">{error}</div>
	{:else if repositories.length === 0}
		<div class="no-projects">no projects found</div>
	{:else}
		<div class="projects-grid">
			{#each repositories as repo, index}
				<div class="project-image-container">
					{#if repo.image_url}
						<div class="project-image-wrapper">
							{#if repo.image_url.endsWith('.mp4')}
								<video
									src={repo.image_url}
									class="project-image"
									autoplay
									loop
									muted
									playsinline
									onerror={(e) => {
										(e.target as HTMLVideoElement).style.display = 'none';
										const container = (e.target as HTMLVideoElement).closest('.project-image-container');
										if (container) {
											const placeholder = container.querySelector('.project-image-placeholder');
											if (placeholder) {
												(placeholder as HTMLElement).style.display = 'flex';
											}
										}
									}}
								></video>
							{:else}
								<img 
									src={repo.image_url} 
									alt="{repo.name}"
									class="project-image"
									onerror={(e) => {
										(e.target as HTMLImageElement).style.display = 'none';
										const container = (e.target as HTMLImageElement).closest('.project-image-container');
										if (container) {
											const placeholder = container.querySelector('.project-image-placeholder');
											if (placeholder) {
												(placeholder as HTMLElement).style.display = 'flex';
											}
										}
									}}
								/>
							{/if}
						</div>
						<div class="project-image-placeholder" style="display: none;">
							<span>{repo.name.charAt(0).toUpperCase()}</span>
						</div>
					{:else}
						<div class="project-image-placeholder">
							<span>{repo.name.charAt(0).toUpperCase()}</span>
						</div>
					{/if}
				</div>
				<div class="project-content">
					<h2 class="project-name">
						<a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
					</h2>
					<p class="project-description">{repo.description}</p>
				</div>
			{/each}
		</div>
	{/if}

		<PageSubnav />
	</div>
</div>

<style>
	.projects-page {
		min-height: 100vh;
		padding: 4rem 4rem 4rem 8rem;
		opacity: 0;
		transition: opacity 0.4s ease;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.projects-page.mounted {
		opacity: 1;
	}

	/* ASCII art background - fixed to viewport (locked to scroll, like plan Three.js) */
	.projects-ascii-bg {
		position: fixed;
		right: -35%;
		top: 10%;
		width: 50%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 2rem;
		pointer-events: none;
		z-index: 0;
	}

	.projects-ascii-art {
		font-family: var(--ascii-font);
		font-size: 1.5rem;
		line-height: 1.2;
		background: linear-gradient(90deg, #fafafa, #f0f0f0, #fafafa);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		white-space: pre;
		margin: 0;
		letter-spacing: 0;
		user-select: none;
		display: block;
		text-align: right;
		transform-style: preserve-3d;
		will-change: transform;
		animation: projects-gradient-shift 8s linear infinite;
	}

	@keyframes projects-gradient-shift {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}

	.projects-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.projects-header {
		margin-bottom: 6rem;
	}

	.projects-title {
		font-size: 6rem;
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: -0.02em;
		margin: 0;
		font-family: var(--main-font);
	}

	.loading, .error, .no-projects {
		font-size: 1.5rem;
		color: #6b6b6b;
		margin-bottom: 6rem;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem 2rem;
		margin-bottom: 6rem;
		max-width: 1200px;
	}

	.project-image-container {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		width: 100%;
		min-height: 600px;
		position: relative;
		overflow: visible;
	}

	.project-image-wrapper {
		border-radius: 20px;
		overflow: hidden;
		max-width: 500px;
		max-height: 600px;
		display: flex;
		align-items: center;
		justify-content: center;
		transform-style: preserve-3d;
		will-change: transform;
	}

	.project-image {
		width: 100%;
		height: auto;
		max-width: 500px;
		max-height: 600px;
		object-fit: contain;
		opacity: 0;
		transition: opacity 0.6s ease;
		display: block;
	}

	.projects-page.mounted .project-image {
		opacity: 1;
	}

	.project-image-placeholder {
		width: 100%;
		height: 100%;
		max-width: 500px;
		border-radius: 20px;
		background-color: #e0e0e0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 4rem;
		color: #888;
		opacity: 0;
		transition: opacity 0.6s ease;
	}

	.projects-page.mounted .project-image-placeholder {
		opacity: 1;
	}

	.project-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 2rem;
	}

	.project-name {
		font-size: 2rem;
		font-weight: 300;
		color: #1a1a1a;
		margin: 0 0 1rem 0;
		font-family: var(--main-font);
		text-transform: lowercase;
	}

	.project-name a {
		color: #1a1a1a;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.project-name a:hover {
		color: #6b6b6b;
	}

	.project-description {
		font-size: 1.5rem;
		font-weight: 300;
		color: #6b6b6b;
		line-height: 1.6;
		margin: 0;
		font-family: var(--main-font);
		text-align: justify;
	}

	@media (max-width: 768px) {
		.projects-page {
			padding: 2rem;
		}

		.projects-ascii-bg {
			display: none;
		}

		.projects-title {
			font-size: 4rem;
		}

		.projects-grid {
			grid-template-columns: 1fr;
			gap: 3rem;
		}

		.project-image-container {
			grid-column: 1;
		}

		.project-content {
			grid-column: 1;
		}

		.project-name {
			font-size: 1.75rem;
		}

		.project-description {
			font-size: 1.25rem;
		}
	}
</style>
