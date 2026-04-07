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
	<title>careers - reagent systems</title>
	<meta name="title" content="careers - reagent systems" />
	<meta
		name="description"
		content="Careers at reagent systems—a small team building in the open in Tampa and remotely."
	/>
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="careers-page" class:mounted>
	<div class="careers-ascii-bg" aria-hidden="true">
		<pre
			class="careers-ascii-art"
			style="transform: perspective(1000px) rotateX({asciiRotateX}deg) rotateY({asciiRotateY}deg) scale({asciiScale});"
		>{asciiArt}</pre>
	</div>
	<div class="careers-content">
		<div class="careers-header">
			<h1 class="careers-title">careers</h1>
		</div>

		<section class="careers-section">
			<p class="careers-text">
				We’re a bootstrapped lab and foundry—few roles, high ownership, lots of surface area. If you care about
				open software, agents, and shipping real tools, we’d like to hear from you even when we’re not listing a
				perfect fit.
			</p>
			<p class="careers-text">
				Send a short note and anything that shows how you work (links, repos, writing) to
				<a href="mailto:support@reagent-systems.com" class="careers-inline-link">support@reagent-systems.com</a>
				with “careers” in the subject line.
			</p>
		</section>

		<PageSubnav />
	</div>
</div>

<style>
	.careers-page {
		min-height: 100vh;
		padding: 4rem 4rem 4rem 8rem;
		opacity: 0;
		transition: opacity 0.4s ease;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.careers-page.mounted {
		opacity: 1;
	}

	.careers-ascii-bg {
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

	.careers-ascii-art {
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
		animation: careers-gradient-shift 8s linear infinite;
	}

	@keyframes careers-gradient-shift {
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

	.careers-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.careers-header {
		margin-bottom: 4rem;
	}

	.careers-title {
		font-size: 6rem;
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: -0.02em;
		margin: 0;
		font-family: var(--main-font);
	}

	.careers-section {
		max-width: 800px;
		margin-bottom: 6rem;
	}

	.careers-text {
		font-size: 1.35rem;
		font-weight: 300;
		color: #6b6b6b;
		line-height: 1.65;
		margin: 0 0 1.5rem 0;
		font-family: var(--main-font);
		text-align: justify;
	}

	.careers-inline-link {
		color: #1a1a1a;
		text-decoration: underline;
		text-underline-offset: 0.15em;
		transition: color 0.2s ease;
	}

	.careers-inline-link:hover {
		color: #6b6b6b;
	}

	@media (max-width: 768px) {
		.careers-page {
			padding: 2rem;
		}

		.careers-ascii-bg {
			display: none;
		}

		.careers-title {
			font-size: 4rem;
		}

		.careers-text {
			font-size: 1.2rem;
		}
	}
</style>
