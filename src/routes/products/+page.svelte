<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

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

	// Custom descriptions for products
	const customDescriptions: Record<string, string> = {
		'openlawn': 'The ultimate AI-powered CRM platform for modern lawn care businesses. Features multi-crew management, smart route optimization with Google Maps integration, real-time GPS tracking, complete customer relationship management, and AI-powered customer summaries with automated insights and service recommendations.',
		'tetra': 'An AI-powered Android automation agent that can understand screen content and perform actions autonomously using OpenAI\'s GPT models and Android\'s Accessibility Services. Features AI-powered screen analysis, autonomous actions, voice input support, and real-time screen parsing.',
		'Simple-Agent-Core': 'A sophisticated yet minimalist AI agent framework focused on simplicity, modularity, and intelligent execution. Designed with the belief that AI agents don\'t need to be complex to be useful. Features minimalist design, dynamic tool loading, loop detection, and intelligent execution management.',
		'website': 'Temporary repository for the reagent website.',
		'mcp-x-posting': 'A standalone Python-based Model Context Protocol (MCP) server that integrates with Cursor to automatically generate draft X (Twitter) posts based on your coding progress. Captures screenshots of browser preview, analyzes recent git changes, and uses a local AI model in LM Studio to craft engaging posts. Keeps your workflow private and local—no cloud services or extensions required.',
		'summariser-bot': 'A Discord bot that summarises chat conversations using Google\'s Gemini AI. Features a /summarise slash command to summarise recent messages with an optional parameter to specify number of messages (1-100, default: 10). Uses Google Gemini for intelligent summarisation and ignores bot messages for cleaner summaries.',
		'dither': 'A Python GUI application for creating artistic dithering effects on images. Dither Dock allows you to apply various dithering algorithms and shape-based patterns to transform your images into stylized, pixelated artwork. Features multiple dithering algorithms (Floyd-Steinberg, Ordered, and Atkinson), shape-based dithering with circles, squares, or triangles, real-time preview, and image adjustments for brightness, contrast, and saturation.',
		'Spark': 'Spark turns your Android phone into a powerful AI chat companion by running Large Language Models directly on your device. Chat privately with no cloud dependencies, and even use it as a local API server for your applications. Currently in early development with active community support.',
		'desktop-tetra': 'A minimal functional macOS desktop automation agent that uses the Accessibility API to find UI elements by semantic attributes (title, role, app), click, type, focus/open apps, record human actions (basic) and play them back, and provide a CLI for simple high-level tasks. Targets macOS and requires Accessibility permissions. No GUI; CLI only.',
		'discord-summary-bot': 'A powerful Discord bot that summarizes messages using Google\'s Gemini API. Features include message summarization, user settings, and multiple summary modes. Commands include /summary, /unreadsummary, /fromtosummary, /listmodes, /addmode, and /removemode for comprehensive message management.',
		'reagent-website-minimalist': 'A cutting-edge AI company focused on decentralized federated learning networks and intelligent agent systems. Develops quantized language models, autonomous agents, and privacy-preserving AI applications. Pioneering the future of AI with innovative approaches to decentralized federated learning, combining FP4 quantized models, forward-forward algorithms, and privacy-preserving agents.',
		'orc': 'A sophisticated autonomous multi-agent system built with Google\'s Agent Development Kit (ADK). Enables multiple AI agents to work together autonomously to accomplish complex tasks through intelligent task decomposition and coordination. Features a peer-to-peer multi-agent architecture where agents autonomously monitor a shared workspace, claim tasks they\'re equipped to handle, and coordinate through file-based communication.',
		'RigIDE': 'A high-performance mobile IDE for iOS and Android, inspired by VSCode and Cursor. Built with Flutter 3.19+ for cross-platform UI, Dart for performance, native modules for iOS (Swift) and Android (Kotlin), Language Server Protocol (LSP) for code intelligence, Tree-sitter for fast incremental parsing, and libgit2 for native Git operations.',
		'Simple-Agent-Tools': 'This repository contains all the commands and tools that Simple Agent Core uses to perform various operations. These modular commands enable the AI agent to interact with files, web resources, GitHub repositories, and system operations in a structured and extensible way. Serves as the command library for Simple Agent Core, providing a comprehensive set of tools organized into logical categories.',
		'Simple-Agent-Websocket': 'A lightweight WebSocket wrapper around SimpleAgent Core that provides real-time web interface capabilities without duplicating the core codebase. Follows the "Don\'t Repeat Yourself" (DRY) principle by not duplicating the SimpleAgent core code, using git submodules to reference the official SimpleAgent Core repository, and acting as a thin wrapper that adds WebSocket functionality.',
		'Simple-Agent-Protocol': 'A WebSocket-based server that coordinates multiple Simple-Agent-Websocket (SAW) instances, managing task delegation and capability registration in real-time. Serves as the central coordination hub for a network of SAW instances, providing intelligent task delegation, capability management, and real-time monitoring of distributed AI agents.',
		'Simple-Agent-Discord-Bot': 'A Discord bot that integrates with the Simple Agent WebSocket system to provide AI assistance through Discord slash commands with real-time updates in threads. Features slash commands, thread creation for each task, real-time updates, and interactive sessions where you can respond to agent questions directly in threads.',
		'KIT_Caller': 'A Unity Android application that provides a voice-interactive AI assistant named "Kit" with full-screen reminder call functionality. The app creates realistic incoming call UIs for reminders and features conversational AI capabilities.'
	};

	// Animation parameters - only Y rotation (swivel), no X rotation
	const maxRotation = 15; // Maximum rotation in degrees
	const animationSpeed = 0.0003; // Speed of rotation
	const breathingSpeed = 0.0005; // Speed of breathing effect
	const breathingAmount = 0.05; // Amount of scale change (5% zoom in/out)

	function initializeImageOffsets() {
		const wrappers = document.querySelectorAll('.product-image-wrapper');
		wrappers.forEach((wrapper) => {
			const htmlWrapper = wrapper as HTMLElement;
			if (!imageOffsets.has(htmlWrapper)) {
				imageOffsets.set(htmlWrapper, Math.random());
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
		
		// Apply transform to all product image wrappers with their individual offsets
		const wrappers = document.querySelectorAll('.product-image-wrapper');
		if (wrappers.length > 0) {
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
		
		animationId = requestAnimationFrame(animate);
	}

	// Static list of products (excluding .github and website repos)
	const staticProducts: Omit<Repository, 'readme'>[] = [
		{
			name: 'openlawn',
			description: customDescriptions['openlawn'],
			html_url: 'https://github.com/reagent-systems/openlawn',
			image_url: undefined
		},
		{
			name: 'tetra',
			description: customDescriptions['tetra'],
			html_url: 'https://github.com/reagent-systems/tetra',
			image_url: undefined
		},
		{
			name: 'Simple-Agent-Core',
			description: customDescriptions['Simple-Agent-Core'],
			html_url: 'https://github.com/reagent-systems/Simple-Agent-Core',
			image_url: undefined
		},
		{
			name: 'mcp-x-posting',
			description: customDescriptions['mcp-x-posting'],
			html_url: 'https://github.com/reagent-systems/mcp-x-posting',
			image_url: undefined
		},
		{
			name: 'summariser-bot',
			description: customDescriptions['summariser-bot'],
			html_url: 'https://github.com/reagent-systems/summariser-bot',
			image_url: undefined
		},
		{
			name: 'dither',
			description: customDescriptions['dither'],
			html_url: 'https://github.com/reagent-systems/dither',
			image_url: undefined
		},
		{
			name: 'Spark',
			description: customDescriptions['Spark'],
			html_url: 'https://github.com/reagent-systems/Spark',
			image_url: undefined
		},
		{
			name: 'desktop-tetra',
			description: customDescriptions['desktop-tetra'],
			html_url: 'https://github.com/reagent-systems/desktop-tetra',
			image_url: undefined
		},
		{
			name: 'discord-summary-bot',
			description: customDescriptions['discord-summary-bot'],
			html_url: 'https://github.com/reagent-systems/discord-summary-bot',
			image_url: undefined
		},
		{
			name: 'orc',
			description: customDescriptions['orc'],
			html_url: 'https://github.com/reagent-systems/orc',
			image_url: undefined
		},
		{
			name: 'RigIDE',
			description: customDescriptions['RigIDE'],
			html_url: 'https://github.com/reagent-systems/RigIDE',
			image_url: undefined
		},
		{
			name: 'Simple-Agent-Tools',
			description: customDescriptions['Simple-Agent-Tools'],
			html_url: 'https://github.com/reagent-systems/Simple-Agent-Tools',
			image_url: undefined
		},
		{
			name: 'Simple-Agent-Websocket',
			description: customDescriptions['Simple-Agent-Websocket'],
			html_url: 'https://github.com/reagent-systems/Simple-Agent-Websocket',
			image_url: undefined
		},
		{
			name: 'Simple-Agent-Protocol',
			description: customDescriptions['Simple-Agent-Protocol'],
			html_url: 'https://github.com/reagent-systems/Simple-Agent-Protocol',
			image_url: undefined
		},
		{
			name: 'Simple-Agent-Discord-Bot',
			description: customDescriptions['Simple-Agent-Discord-Bot'],
			html_url: 'https://github.com/reagent-systems/Simple-Agent-Discord-Bot',
			image_url: undefined
		},
		{
			name: 'KIT_Caller',
			description: customDescriptions['KIT_Caller'],
			html_url: 'https://github.com/reagent-systems/KIT_Caller',
			image_url: undefined
		}
	];

	async function loadProducts() {
		if (!browser) return;
		
		try {
			// Check for static images in product-images folder (both .png and .jpg)
			const productsWithImages = await Promise.all(
				staticProducts.map(async (product) => {
					let imageUrl = product.image_url;
					
					// Check for .png first, then .jpg
					const extensions = ['.png', '.jpg'];
					for (const ext of extensions) {
						const staticImageUrl = `/product-images/${product.name}${ext}`;
						try {
							const imageCheck = await fetch(staticImageUrl, { method: 'HEAD' });
							if (imageCheck.ok) {
								imageUrl = staticImageUrl;
								break; // Found an image, stop checking
							}
						} catch (e) {
							// Continue to next extension
						}
					}
					
					return {
						...product,
						image_url: imageUrl,
						readme: ''
					};
				})
			);
			
			repositories = productsWithImages;
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load products';
			loading = false;
			console.error('Error loading products:', err);
		}
	}

	onMount(() => {
		mounted = true;
		loadProducts();
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
	<meta name="robots" content="noindex, nofollow" />
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
					{#if repo.image_url}
						<div class="product-image-wrapper">
							<img 
								src={repo.image_url} 
								alt="{repo.name}"
								class="product-image"
								onerror={(e) => {
									(e.target as HTMLImageElement).style.display = 'none';
									const container = (e.target as HTMLImageElement).closest('.product-image-container');
									if (container) {
										const placeholder = container.querySelector('.product-image-placeholder');
										if (placeholder) {
											(placeholder as HTMLElement).style.display = 'flex';
										}
									}
								}}
							/>
						</div>
						<div class="product-image-placeholder" style="display: none;">
							<span>{repo.name.charAt(0).toUpperCase()}</span>
						</div>
					{:else}
						<div class="product-image-placeholder">
							<span>{repo.name.charAt(0).toUpperCase()}</span>
						</div>
					{/if}
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
		width: 100%;
		min-height: 600px;
		position: relative;
		overflow: visible;
	}

	.product-image-wrapper {
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

	.product-image {
		width: 100%;
		height: auto;
		max-width: 500px;
		max-height: 600px;
		object-fit: contain;
		opacity: 0;
		transition: opacity 0.6s ease;
		display: block;
	}

	.products-page.mounted .product-image {
		opacity: 1;
	}

	.product-image-placeholder {
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

	.products-page.mounted .product-image-placeholder {
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
