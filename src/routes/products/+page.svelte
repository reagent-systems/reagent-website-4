<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	interface Repository {
		name: string;
		description: string | null;
		html_url: string;
		readme?: string;
	}

	let mounted = $state(false);
	let repositories = $state<Repository[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let animationId: number | null = null;
	let startTime = Date.now();
	const imageOffsets = new Map<HTMLElement, number>();

	// Animation parameters - only Y rotation (swivel), no X rotation
	const maxRotation = 15; // Maximum rotation in degrees
	const animationSpeed = 0.0003; // Speed of rotation
	const breathingSpeed = 0.0005; // Speed of breathing effect
	const breathingAmount = 0.05; // Amount of scale change (5% zoom in/out)

	function initializeImageOffsets() {
		const images = document.querySelectorAll('.product-image');
		images.forEach((img) => {
			const htmlImg = img as HTMLElement;
			if (!imageOffsets.has(htmlImg)) {
				imageOffsets.set(htmlImg, Math.random());
			}
		});
	}

	function animate() {
		if (!mounted) {
			animationId = requestAnimationFrame(animate);
			return;
		}

		const baseElapsed = (Date.now() - startTime) * animationSpeed;
		const baseBreathingElapsed = (Date.now() - startTime) * breathingSpeed;
		
		// Apply transform to all product images with their individual offsets
		const images = document.querySelectorAll('.product-image');
		if (images.length > 0) {
			images.forEach((img) => {
				const htmlImg = img as HTMLElement;
				const offset = imageOffsets.get(htmlImg) || 0;
				
				// Apply offset to elapsed time
				const elapsed = baseElapsed + (offset * Math.PI * 2);
				const breathingElapsed = baseBreathingElapsed + (offset * Math.PI * 2);
				
				// Only Y rotation (swivel), no X rotation
				const rotateY = Math.cos(-elapsed) * maxRotation;
				
				// Breathing effect - slow zoom in and out
				const scale = 1 + Math.sin(breathingElapsed) * breathingAmount;
				
				htmlImg.style.transform = 
					`perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`;
				htmlImg.style.transition = 'opacity 0.6s ease';
			});
		}
		
		animationId = requestAnimationFrame(animate);
	}

	async function fetchRepositories() {
		if (!browser) return;
		
		try {
			// Fetch repositories from GitHub API
			const response = await fetch('https://api.github.com/orgs/reagent-systems/repos?per_page=100&sort=updated');
			if (!response.ok) {
				throw new Error(`Failed to fetch repositories: ${response.statusText}`);
			}
			
			const repos = await response.json();
			
			// Fetch README for each repository
			const reposWithReadme = await Promise.all(
				repos.map(async (repo: any) => {
					let readme = '';
					try {
						// Try to fetch README
						const readmeResponse = await fetch(`https://api.github.com/repos/reagent-systems/${repo.name}/readme`);
						if (readmeResponse.ok) {
							const readmeData = await readmeResponse.json();
							// Decode base64 content - remove all whitespace including newlines
							const base64Content = readmeData.content.replace(/\s/g, '');
							readme = atob(base64Content);
							// Extract description from README (first meaningful paragraph)
							const lines = readme.split('\n')
								.map(line => line.trim())
								.filter(line => line && !line.startsWith('#') && !line.startsWith('!') && !line.startsWith('['));
							// Get first few meaningful lines, up to 500 characters
							readme = lines.slice(0, 10).join(' ').substring(0, 500);
							if (readme.length === 500) {
								readme += '...';
							}
						}
					} catch (e) {
						// If README fetch fails, use description from repo
						console.log(`Could not fetch README for ${repo.name}`);
					}
					
					return {
						name: repo.name,
						description: readme || repo.description || 'No description available.',
						html_url: repo.html_url,
						readme: readme
					};
				})
			);
			
			repositories = reposWithReadme;
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load repositories';
			loading = false;
			console.error('Error fetching repositories:', err);
		}
	}

	onMount(() => {
		mounted = true;
		fetchRepositories();
		startTime = Date.now();
		animate();
		
		// Initialize offsets after a short delay to ensure DOM is ready
		setTimeout(() => {
			initializeImageOffsets();
		}, 100);
		
		return () => {
			if (animationId !== null) {
				cancelAnimationFrame(animationId);
			}
		};
	});

	onDestroy(() => {
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
		}
	});
</script>

<svelte:head>
	<title>reagent's products - reagent systems</title>
	<meta name="title" content="reagent's products - reagent systems" />
	<meta name="description" content="explore reagent systems' open source products and projects" />
</svelte:head>

<div class="products-page" class:mounted>
	<div class="products-header">
		<h1 class="products-title">products</h1>
	</div>

	{#if loading}
		<div class="loading">loading products...</div>
	{:else if error}
		<div class="error">{error}</div>
	{:else if repositories.length === 0}
		<div class="no-products">no products found</div>
	{:else}
		<div class="products-grid">
			{#each repositories as repo, index}
				<div class="product-image-container">
					<img 
						src="/product-images/{repo.name}.png" 
						alt="{repo.name}"
						class="product-image"
						onerror={(e) => {
							(e.target as HTMLImageElement).style.display = 'none';
						}}
					/>
				</div>
				<div class="product-content">
					<h2 class="product-name">
						<a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
					</h2>
					<p class="product-description">{repo.description}</p>
				</div>
			{/each}
		</div>
	{/if}

	<nav class="products-nav">
		<a href="/" class="nav-link">home</a>
		<a href="/research" class="nav-link">research</a>
		<a href="/community" class="nav-link">community</a>
	</nav>
</div>

<style>
	.products-page {
		min-height: 100vh;
		padding: 4rem 4rem 4rem 8rem;
		opacity: 0;
		transition: opacity 0.4s ease;
		display: flex;
		flex-direction: column;
	}

	.products-page.mounted {
		opacity: 1;
	}

	.products-header {
		margin-bottom: 6rem;
	}

	.products-title {
		font-size: 6rem;
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: -0.02em;
		margin: 0;
		font-family: var(--main-font);
	}

	.loading, .error, .no-products {
		font-size: 1.5rem;
		color: #6b6b6b;
		margin-bottom: 6rem;
	}

	.products-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem 2rem;
		margin-bottom: 6rem;
		max-width: 1200px;
	}

	.product-image-container {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.product-image {
		width: 100%;
		max-width: 400px;
		height: auto;
		border-radius: 20px;
		object-fit: contain;
		transform-style: preserve-3d;
		will-change: transform;
		opacity: 0;
		transition: opacity 0.6s ease;
	}

	.products-page.mounted .product-image {
		opacity: 1;
	}

	.product-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 2rem;
	}

	.product-name {
		font-size: 2rem;
		font-weight: 300;
		color: #1a1a1a;
		margin: 0 0 1rem 0;
		font-family: var(--main-font);
		text-transform: lowercase;
	}

	.product-name a {
		color: #1a1a1a;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.product-name a:hover {
		color: #6b6b6b;
	}

	.product-description {
		font-size: 1.5rem;
		font-weight: 300;
		color: #6b6b6b;
		line-height: 1.6;
		margin: 0;
		font-family: var(--main-font);
		text-align: justify;
	}

	.products-nav {
		display: flex;
		gap: 3rem;
		margin-top: auto;
	}

	.products-nav .nav-link {
		font-size: 1.5rem;
		font-weight: 300;
		color: #6b6b6b;
		background: none;
		text-decoration: none;
		text-transform: lowercase;
		letter-spacing: 0.05em;
		transition: color 0.3s ease;
		font-family: 'Raleway Variable', var(--main-font);
		position: relative;
	}

	.products-nav .nav-link::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 0;
		height: 1px;
		background-color: #6b6b6b;
		transform: translateX(-50%);
		transition: width 0.3s ease;
	}

	.products-nav .nav-link:hover {
		color: #000000;
	}

	.products-nav .nav-link:hover::after {
		width: 100%;
	}

	@media (max-width: 768px) {
		.products-page {
			padding: 2rem;
		}

		.products-title {
			font-size: 4rem;
		}

		.products-grid {
			grid-template-columns: 1fr;
			gap: 3rem;
		}

		.product-image-container {
			grid-column: 1;
		}

		.product-content {
			grid-column: 1;
		}

		.product-name {
			font-size: 1.75rem;
		}

		.product-description {
			font-size: 1.25rem;
		}
	}
</style>
