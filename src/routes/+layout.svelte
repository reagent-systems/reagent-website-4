<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children } = $props();
	const currentYear = new Date().getFullYear();
	const showFooter = $derived($page.url.pathname !== '/');
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
	<meta name="description" content="we make cool stuff in the open / a bootstrapped research lab & startup foundry. promoting a free and open internet, decentralization, and open distribution of AI." />
	<meta name="keywords" content="reagent systems, open source, AI research, startup foundry, decentralized AI, free software, research lab, Tampa Florida" />
	<meta name="author" content="reagent systems" />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://reagent-systems.com/" />
	<meta property="og:title" content="reagent" />
	<meta property="og:description" content="we make cool stuff in the open / a bootstrapped research lab & startup foundry. promoting a free and open internet, decentralization, and open distribution of AI." />
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
	<meta name="twitter:description" content="we make cool stuff in the open / a bootstrapped research lab & startup foundry. promoting a free and open internet, decentralization, and open distribution of AI." />
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

{#if showFooter}
	<footer class="site-footer">
		<div class="footer-grid">
			<div class="footer-col">
				<div class="footer-brand">reagent systems</div>
				<div class="footer-muted">Tampa, Florida</div>
				<address class="footer-muted">
					10523 Bermuda Isle Dr<br />
					Tampa, FL 33647
				</address>
			</div>
			<div class="footer-col">
				<div class="footer-heading">links</div>
				<a href="/research" class="footer-link">research</a>
				<a href="/products" class="footer-link">products</a>
				<a href="/community" class="footer-link">community</a>
				<a href="/privacy" class="footer-link">privacy</a>
			</div>
			<div class="footer-col">
				<div class="footer-heading">contact</div>
				<a href="mailto:support@reagent-systems.com" class="footer-link">support@reagent-systems.com</a>
			</div>
		</div>
		<div class="footer-copy">© {currentYear} reagent systems. All rights reserved.</div>
	</footer>
{/if}

<style>
	.page-wrapper {
		opacity: 1;
		transition: opacity 0.4s ease;
	}

	.page-wrapper.transitioning {
		opacity: 0;
	}

	.site-footer {
		position: relative;
		z-index: 10;
		background-color: #fafafa;
		border-top: 1px solid #e8e8e8;
		margin-top: auto;
		padding: 3rem 4rem 0;
		font-family: var(--main-font);
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1.2fr 1fr 1fr;
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.footer-brand {
		font-size: 1.25rem;
		font-weight: 300;
		color: #1a1a1a;
		text-transform: lowercase;
		margin-bottom: 0.5rem;
	}

	.footer-heading {
		font-size: 0.95rem;
		font-weight: 300;
		color: #1a1a1a;
		text-transform: lowercase;
		margin-bottom: 0.75rem;
	}

	.footer-muted {
		font-size: 1rem;
		font-weight: 300;
		color: #6b6b6b;
		line-height: 1.6;
		font-style: normal;
	}

	.footer-link {
		display: block;
		font-size: 1rem;
		font-weight: 300;
		color: #6b6b6b;
		text-decoration: none;
		text-transform: lowercase;
		margin-bottom: 0.35rem;
		transition: color 0.2s ease;
	}

	.footer-link:hover {
		color: #1a1a1a;
	}

	.footer-copy {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.25rem 4rem 3rem;
		font-size: 0.9rem;
		font-weight: 300;
		color: #6b6b6b;
		border-top: 1px solid #e8e8e8;
		margin-top: 2rem;
	}

	@media (max-width: 768px) {
		.site-footer {
			padding: 2rem 2rem 0;
		}

		.footer-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.footer-copy {
			padding: 1rem 2rem 2rem;
			margin-top: 1.5rem;
		}
	}
</style>
