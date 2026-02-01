<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();
	let transitioning = $state(false);
	let audioElement: HTMLAudioElement | null = null;

	onNavigate(() => {
		transitioning = true;
		return new Promise((resolve) => {
			setTimeout(() => {
				transitioning = false;
				resolve();
			}, 400);
		});
	});

	onMount(() => {
		if (browser && audioElement) {
			// Set volume to a reasonable level
			audioElement.volume = 0.5;
			
			// Try to play immediately on page load
			const playAudio = () => {
				if (audioElement) {
					audioElement.play().catch(() => {
						// Autoplay blocked, will try again on user interaction
					});
				}
			};
			
			// Try to play immediately
			playAudio();
			
			// Also try to play on any user interaction as fallback
			const events = ['click', 'touchstart', 'keydown', 'scroll'];
			const playOnInteraction = () => {
				if (audioElement && audioElement.paused) {
					playAudio();
				}
			};
			
			events.forEach(event => {
				document.addEventListener(event, playOnInteraction, { once: true });
			});
		}
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" type="image/png" />
	
	<!-- Primary Meta Tags -->
	<title>reagent systems - the idea factory</title>
	<meta name="title" content="reagent systems - the idea factory" />
	<meta name="description" content="we make cool stuff in the open / a bootstrapped research lab & startup foundry. promoting a free and open internet, decentralization, and open distribution of AI." />
	<meta name="keywords" content="reagent systems, open source, AI research, startup foundry, decentralized AI, free software, research lab, Tampa Florida" />
	<meta name="author" content="reagent systems" />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://reagent.systems/" />
	<meta property="og:title" content="reagent" />
	<meta property="og:description" content="we make cool stuff in the open / a bootstrapped research lab & startup foundry. promoting a free and open internet, decentralization, and open distribution of AI." />
	<meta property="og:site_name" content="reagent systems" />
	<meta property="og:image" content="https://reagent.systems/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://reagent.systems/" />
	<meta property="twitter:title" content="reagent systems - the idea factory" />
	<meta property="twitter:description" content="we make cool stuff in the open / a bootstrapped research lab & startup foundry. promoting a free and open internet, decentralization, and open distribution of AI." />
	<meta property="twitter:creator" content="@Reagent_Systems" />
	<meta property="twitter:image" content="https://reagent.systems/og-image.png" />
	
	<!-- Additional Meta Tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="theme-color" content="#ffffff" />
</svelte:head>

<div class="page-wrapper" class:transitioning>
	{@render children()}
</div>

<audio
	bind:this={audioElement}
	src="/audio/ambience.mp3"
	loop
	autoplay
	preload="auto"
	style="display: none;"
></audio>

<style>
	.page-wrapper {
		opacity: 1;
		transition: opacity 0.4s ease;
	}

	.page-wrapper.transitioning {
		opacity: 0;
	}
</style>
