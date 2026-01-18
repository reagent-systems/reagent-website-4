<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { onNavigate } from '$app/navigation';

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
	<link rel="icon" href={favicon} />
	
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
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://reagent.systems/" />
	<meta property="twitter:title" content="reagent systems - the idea factory" />
	<meta property="twitter:description" content="we make cool stuff in the open / a bootstrapped research lab & startup foundry. promoting a free and open internet, decentralization, and open distribution of AI." />
	<meta property="twitter:creator" content="@Reagent_Systems" />
	
	<!-- Additional Meta Tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="theme-color" content="#ffffff" />
</svelte:head>

<div class="page-wrapper" class:transitioning>
	{@render children()}
</div>

<style>
	.page-wrapper {
		opacity: 1;
		transition: opacity 0.4s ease;
	}

	.page-wrapper.transitioning {
		opacity: 0;
	}
</style>
