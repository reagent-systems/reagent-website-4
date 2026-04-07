<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { asciiArt } from '$lib/ascii-art-2';

	const models = [
		{
			name: 'Bently Coder 7B',
			id: 'Bentlybro/bently-coder-7b',
			url: 'https://huggingface.co/Bentlybro/bently-coder-7b',
			description:
				'Apache-2.0 coding model fine-tuned from Qwen2.5-Coder-7B-Instruct with QLoRA on personal GitHub repositories—strong gains on BigCodeBench Hard and HumanEval compared to the base model.'
		}
	] as const;

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
	<title>models - reagent systems</title>
	<meta name="title" content="models - reagent systems" />
	<meta name="description" content="open language models released by the reagent systems community on Hugging Face." />
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="models-page" class:mounted>
	<div class="models-ascii-bg" aria-hidden="true">
		<pre
			class="models-ascii-art"
			style="transform: perspective(1000px) rotateX({asciiRotateX}deg) rotateY({asciiRotateY}deg) scale({asciiScale});"
		>{asciiArt}</pre>
	</div>
	<div class="models-content">
		<div class="models-header">
			<h1 class="models-title">models</h1>
		</div>

		<div class="models-list">
			{#each models as m}
				<article class="model-card">
					<h2 class="model-name">
						<a href={m.url} target="_blank" rel="noopener noreferrer">{m.name}</a>
					</h2>
					<p class="model-id">{m.id}</p>
					<p class="model-description">{m.description}</p>
				</article>
			{/each}
		</div>

		<nav class="models-nav">
			<a href="/" class="nav-link">home</a>
			<a href="/plan" class="nav-link">plan</a>
			<a href="/research" class="nav-link">research</a>
			<a href="/projects" class="nav-link">projects</a>
			<a href="/community" class="nav-link">community</a>
		</nav>
	</div>
</div>

<style>
	.models-page {
		min-height: 100vh;
		padding: 4rem 4rem 4rem 8rem;
		opacity: 0;
		transition: opacity 0.4s ease;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.models-page.mounted {
		opacity: 1;
	}

	.models-ascii-bg {
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

	.models-ascii-art {
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
		animation: models-gradient-shift 8s linear infinite;
	}

	@keyframes models-gradient-shift {
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

	.models-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.models-header {
		margin-bottom: 4rem;
	}

	.models-title {
		font-size: 6rem;
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: -0.02em;
		margin: 0;
		font-family: var(--main-font);
	}

	.models-list {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		max-width: 800px;
		margin-bottom: 6rem;
	}

	.model-name {
		font-size: 1.75rem;
		font-weight: 300;
		color: #1a1a1a;
		margin: 0 0 0.35rem 0;
		font-family: var(--main-font);
		text-transform: lowercase;
	}

	.model-name a {
		color: #1a1a1a;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.model-name a:hover {
		color: #6b6b6b;
	}

	.model-id {
		font-size: 1rem;
		font-weight: 300;
		color: #888;
		margin: 0 0 1rem 0;
		font-family: var(--main-font);
	}

	.model-description {
		font-size: 1.35rem;
		font-weight: 300;
		color: #6b6b6b;
		line-height: 1.65;
		margin: 0;
		font-family: var(--main-font);
		text-align: justify;
	}

	.models-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem 3rem;
		margin-top: auto;
	}

	.models-nav .nav-link {
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

	.models-nav .nav-link::after {
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

	.models-nav .nav-link:hover {
		color: #000000;
	}

	.models-nav .nav-link:hover::after {
		width: 100%;
	}

	@media (max-width: 768px) {
		.models-page {
			padding: 2rem;
		}

		.models-ascii-bg {
			display: none;
		}

		.models-title {
			font-size: 4rem;
		}

		.model-description {
			font-size: 1.2rem;
		}

		.models-nav {
			flex-direction: column;
			gap: 1.5rem;
			align-items: flex-start;
		}
	}
</style>
