<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { asciiArt } from '$lib/ascii-art-2';
	import PageSubnav from '$lib/PageSubnav.svelte';

	interface ResearchRepo {
		name: string;
		description: string;
		html_url: string;
	}

	const models = [
		{
			name: 'Bently Coder 7B',
			id: 'Bentlybro/bently-coder-7b',
			url: 'https://huggingface.co/Bentlybro/bently-coder-7b',
			description:
				'Apache-2.0 coding model fine-tuned from Qwen2.5-Coder-7B-Instruct with QLoRA on personal GitHub repositories—strong gains on BigCodeBench Hard and HumanEval compared to the base model.'
		}
	] as const;

	const repositories: ResearchRepo[] = [
		{
			name: 'mcp-dock',
			description:
				'Desktop application for running and organizing Model Context Protocol servers—Electron, Vite, and React. Ships as an installable MCP Dock with a modern UI for local tool orchestration.',
			html_url: 'https://github.com/reagent-systems/mcp-dock'
		},
		{
			name: 'dandelion',
			description:
				'Research codebase mixing CUDA, Python, and neuro-symbolic prototypes—exploratory infrastructure for algorithms and systems we want to understand deeply before productizing.',
			html_url: 'https://github.com/reagent-systems/dandelion'
		},
		{
			name: 'Simple-Agent-Core',
			description:
				'Minimalist Python agent framework: dynamic tool loading, loop detection, sandboxed file work, and providers including OpenAI, LM Studio, and Google Gemini.',
			html_url: 'https://github.com/reagent-systems/Simple-Agent-Core'
		},
		{
			name: 'phone-agent',
			description:
				'TypeScript agent stack and examples oriented toward phone-centric workflows, with Docker-friendly deployment for experimentation and services.',
			html_url: 'https://github.com/reagent-systems/phone-agent'
		}
	];

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
	<title>research - reagent systems</title>
	<meta name="title" content="research - reagent systems" />
	<meta
		name="description"
		content="open research repositories and Hugging Face models from reagent systems—systems research, agents, and code LLMs."
	/>
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="research-page" class:mounted>
	<div class="research-ascii-bg" aria-hidden="true">
		<pre
			class="research-ascii-art"
			style="transform: perspective(1000px) rotateX({asciiRotateX}deg) rotateY({asciiRotateY}deg) scale({asciiScale});"
		>{asciiArt}</pre>
	</div>
	<div class="research-content">
		<div class="research-header">
			<h1 class="research-title">research</h1>
		</div>

		<div class="research-list">
			{#each repositories as repo}
				<article class="research-repo">
					<h2 class="research-repo-name">
						<a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
					</h2>
					<p class="research-repo-description">{repo.description}</p>
				</article>
			{/each}
		</div>

		<h2 class="research-section-heading">models</h2>
		<div class="research-models">
			{#each models as m}
				<article class="research-model-card">
					<h3 class="research-model-name">
						<a href={m.url} target="_blank" rel="noopener noreferrer">{m.name}</a>
					</h3>
					<p class="research-model-id">{m.id}</p>
					<p class="research-model-description">{m.description}</p>
				</article>
			{/each}
		</div>

		<PageSubnav />
	</div>
</div>

<style>
	.research-page {
		min-height: 100vh;
		padding: 4rem 4rem 4rem 8rem;
		opacity: 0;
		transition: opacity 0.4s ease;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.research-page.mounted {
		opacity: 1;
	}

	.research-ascii-bg {
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

	.research-ascii-art {
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
		animation: research-gradient-shift 8s linear infinite;
	}

	@keyframes research-gradient-shift {
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

	.research-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.research-header {
		margin-bottom: 4rem;
	}

	.research-title {
		font-size: 6rem;
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: -0.02em;
		margin: 0;
		font-family: var(--main-font);
	}

	.research-list {
		display: flex;
		flex-direction: column;
		gap: 3.5rem;
		max-width: 800px;
		margin-bottom: 6rem;
	}

	.research-repo-name {
		font-size: 1.75rem;
		font-weight: 300;
		color: #1a1a1a;
		margin: 0 0 0.75rem 0;
		font-family: var(--main-font);
		text-transform: lowercase;
	}

	.research-repo-name a {
		color: #1a1a1a;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.research-repo-name a:hover {
		color: #6b6b6b;
	}

	.research-repo-description {
		font-size: 1.35rem;
		font-weight: 300;
		color: #6b6b6b;
		line-height: 1.65;
		margin: 0;
		font-family: var(--main-font);
		text-align: justify;
	}

	.research-section-heading {
		font-size: 2.25rem;
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		margin: 2rem 0 1.5rem 0;
		font-family: var(--main-font);
	}

	.research-models {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		max-width: 800px;
		margin-bottom: 6rem;
	}

	.research-model-name {
		font-size: 1.5rem;
		font-weight: 300;
		color: #1a1a1a;
		margin: 0 0 0.35rem 0;
		font-family: var(--main-font);
		text-transform: lowercase;
	}

	.research-model-name a {
		color: #1a1a1a;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.research-model-name a:hover {
		color: #6b6b6b;
	}

	.research-model-id {
		font-size: 1rem;
		font-weight: 300;
		color: #888;
		margin: 0 0 0.75rem 0;
		font-family: var(--main-font);
	}

	.research-model-description {
		font-size: 1.35rem;
		font-weight: 300;
		color: #6b6b6b;
		line-height: 1.65;
		margin: 0;
		font-family: var(--main-font);
		text-align: justify;
	}

	@media (max-width: 768px) {
		.research-page {
			padding: 2rem;
		}

		.research-ascii-bg {
			display: none;
		}

		.research-title {
			font-size: 4rem;
		}

		.research-repo-description {
			font-size: 1.2rem;
		}

		.research-model-description {
			font-size: 1.2rem;
		}
	}
</style>
