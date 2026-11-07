<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import SiteFooter from '$lib/SiteFooter.svelte';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children } = $props();
	let transitioning = $state(false);

	onNavigate(() => {
		transitioning = true;
		return new Promise((resolve) => {
			setTimeout(() => {
				transitioning = false;
				resolve();
			}, 400);
		});
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" type="image/png" />
	
	<!-- Primary Meta Tags -->
	<title>reagent systems - the idea factory</title>
	<meta name="title" content="reagent systems - the idea factory" />
	<meta name="description" content="reagent systems is six companies working as one: research, matter, logistics, defense, capital, and creative. we turn ideas into companies." />
	<meta name="keywords" content="reagent systems, open source, AI research, startup foundry, decentralized AI, free software, research lab, Tampa Florida" />
	<meta name="author" content="reagent systems" />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://reagent-systems.com/" />
	<meta property="og:title" content="reagent" />
	<meta property="og:description" content="reagent systems is six companies working as one: research, matter, logistics, defense, capital, and creative. we turn ideas into companies." />
	<meta property="og:site_name" content="reagent systems" />
	<meta property="og:image" content="https://reagent-systems.com/og-image.png" />
	<meta property="og:image:secure_url" content="https://reagent-systems.com/og-image.png" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="reagent systems - the idea factory" />
	
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://reagent-systems.com/" />
	<meta name="twitter:title" content="reagent systems - the idea factory" />
	<meta name="twitter:description" content="reagent systems is six companies working as one: research, matter, logistics, defense, capital, and creative. we turn ideas into companies." />
	<meta name="twitter:creator" content="@Reagent_Systems" />
	<meta name="twitter:image" content="https://reagent-systems.com/og-image.png" />
	<meta name="twitter:image:alt" content="reagent systems - the idea factory" />
	
	<!-- Additional Meta Tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="theme-color" content="#ffffff" />
</svelte:head>

<div class="page-wrapper" class:transitioning>
	{@render children()}
</div>

<SiteFooter />

<style>
	.page-wrapper {
		opacity: 1;
		transition: opacity 0.4s ease;
	}

	.page-wrapper.transitioning {
		opacity: 0;
	}
</style>
