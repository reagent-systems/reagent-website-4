<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { asciiArt } from '$lib/ascii-art-2';
	import PageSubnav from '$lib/PageSubnav.svelte';

	let mounted = $state(false);
	let animationId: number | null = null;
	let startTime = Date.now();
	let asciiRotateX = $state(0);
	let asciiRotateY = $state(0);
	let asciiScale = $state(1);
	const asciiMaxRotation = 15;
	const asciiAnimationSpeed = 0.0003;
	const asciiBreathingSpeed = 0.0005;
	const asciiBreathingAmount = 0.05;

	function animate() {
		const now = performance.now();
		const asciiElapsed = (now - startTime) * asciiAnimationSpeed;
		const asciiBreathingElapsed = (now - startTime) * asciiBreathingSpeed;
		asciiRotateX = Math.sin(-asciiElapsed) * asciiMaxRotation;
		asciiRotateY = Math.cos(-asciiElapsed) * asciiMaxRotation;
		asciiScale = 1 + Math.sin(asciiBreathingElapsed) * asciiBreathingAmount;
		animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
		mounted = true;
		startTime = Date.now();
		animate();
		return () => {
			if (animationId !== null) cancelAnimationFrame(animationId);
		};
	});

	onDestroy(() => {
		if (animationId !== null) cancelAnimationFrame(animationId);
	});
</script>

<svelte:head>
	<title>portal - reagent systems</title>
	<meta name="title" content="portal - reagent systems" />
	<meta
		name="description"
		content="Internal and partner gateway for reagent systems—tools, docs, and resources for people who work with us."
	/>
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="portal-page" class:mounted>
	<div class="portal-ascii-bg" aria-hidden="true">
		<pre
			class="portal-ascii-art"
			style="transform: perspective(1000px) rotateX({asciiRotateX}deg) rotateY({asciiRotateY}deg) scale({asciiScale});"
		>{asciiArt}</pre>
	</div>
	<div class="portal-content">
		<div class="portal-header">
			<h1 class="portal-title">portal</h1>
		</div>

		<section class="portal-section">
			<p class="portal-text">
				This space is for teammates, collaborators, and partners—shared pointers to builds, dashboards, and
				documentation we use day to day. If you need access, reach out through the contact on the main site or
				your reagent point of contact.
			</p>
			<p class="portal-text">
				Looking to join the team? See <a href="/careers" class="portal-inline-link">careers</a>.
			</p>
		</section>

		<PageSubnav />
	</div>
</div>

<style>
	.portal-page {
		min-height: 100vh;
		padding: 4rem 4rem 4rem 8rem;
		opacity: 0;
		transition: opacity 0.4s ease;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.portal-page.mounted {
		opacity: 1;
	}

	.portal-ascii-bg {
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

	.portal-ascii-art {
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
		animation: portal-gradient-shift 8s linear infinite;
	}

	@keyframes portal-gradient-shift {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.portal-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.portal-header {
		margin-bottom: 4rem;
	}

	.portal-title {
		font-size: 6rem;
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: -0.02em;
		margin: 0;
		font-family: var(--main-font);
	}

	.portal-section {
		max-width: 800px;
		margin-bottom: 6rem;
	}

	.portal-text {
		font-size: 1.35rem;
		font-weight: 300;
		color: #6b6b6b;
		line-height: 1.65;
		margin: 0 0 1.5rem 0;
		font-family: var(--main-font);
		text-align: justify;
	}

	.portal-inline-link {
		color: #1a1a1a;
		text-decoration: underline;
		text-underline-offset: 0.15em;
		transition: color 0.2s ease;
	}

	.portal-inline-link:hover {
		color: #6b6b6b;
	}

	@media (max-width: 768px) {
		.portal-page {
			padding: 2rem;
		}

		.portal-ascii-bg {
			display: none;
		}

		.portal-title {
			font-size: 4rem;
		}

		.portal-text {
			font-size: 1.2rem;
		}
	}
</style>
