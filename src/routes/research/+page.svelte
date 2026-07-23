<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { asciiArt } from '$lib/ascii-art-2';
	import PageSubnav from '$lib/PageSubnav.svelte';

	type DiagramKind = 'trilayer' | 'agent-loop' | 'call-stack' | 'train-flow';
	type PerfKind = 'mix-strip' | 'dual-source' | 'runtime-split' | 'bench-delta';

	interface MixSlice {
		label: string;
		value: number;
		tone: number;
	}

	interface ResearchItem {
		id: string;
		name: string;
		description: string;
		link: string;
		linkLabel: string;
		image: string;
		howItWorks: {
			title: string;
			description: string;
			diagram: DiagramKind;
		};
		howItPerforms: {
			title: string;
			description: string;
			perf: PerfKind;
			mix?: MixSlice[];
			localTools?: string[];
			remoteTools?: string[];
			runtime?: { label: string; value: number; note: string }[];
			benchmarks?: {
				label: string;
				base: number;
				tuned: number;
			}[];
			taskMix?: MixSlice[];
		};
	}

	interface ReleaseRow {
		name: string;
		type: string;
		details: string;
		date: string;
		size: string;
		url: string;
	}

	function langMix(bytes: Record<string, number>): MixSlice[] {
		const total = Object.values(bytes).reduce((a, b) => a + b, 0);
		const tones = [0.92, 0.72, 0.55, 0.4, 0.28, 0.18];
		return Object.entries(bytes)
			.map(([label, value], i) => ({
				label: label.toLowerCase(),
				value: Math.round((value / total) * 1000) / 10,
				tone: tones[i] ?? 0.15
			}))
			.sort((a, b) => b.value - a.value);
	}

	type TextPart = { kind: 'text' | 'num'; value: string };

	/** Split prose so numbers and % (and close suffixes) use the mono face. */
	function tokenizeNums(text: string): TextPart[] {
		const parts: TextPart[] = [];
		const re = /(\+?\d+(?:[.,]\d+)?(?:%|pp|[BbKk]|gb|mb)?)/g;
		let last = 0;
		let match: RegExpExecArray | null;
		while ((match = re.exec(text)) !== null) {
			if (match.index > last) {
				parts.push({ kind: 'text', value: text.slice(last, match.index) });
			}
			parts.push({ kind: 'num', value: match[0] });
			last = match.index + match[0].length;
		}
		if (last < text.length) {
			parts.push({ kind: 'text', value: text.slice(last) });
		}
		return parts.length ? parts : [{ kind: 'text', value: text }];
	}

	const architectures: ResearchItem[] = [
		{
			id: 'dandelion',
			name: 'dandelion',
			description:
				'cuda, python, and common lisp research codebase for neuro-symbolic prototypes that need hardware contact.',
			link: 'https://github.com/reagent-systems/dandelion',
			linkLabel: 'github',
			image: '/research-images/dandelion.png',
			howItWorks: {
				title: 'three layers, one workshop',
				description:
					'cuda kernels sit under python host code; common lisp carries symbolic structure. ideas move between hardware, host, and symbol before anything is productized.',
				diagram: 'trilayer'
			},
			howItPerforms: {
				title: 'hybrid weight',
				description:
					'byte-weighted github language mix. shows where the research mass actually lives: cuda-led, with python and lisp as the hybrid surface.',
				perf: 'mix-strip',
				mix: langMix({
					Cuda: 41036,
					Python: 28593,
					'Common Lisp': 8239,
					CMake: 734,
					'C++': 539,
					Shell: 413
				})
			}
		},
		{
			id: 'simple-agent-core',
			name: 'simple-agent-core',
			description:
				'minimalist python agent framework: dynamic tool loading, loop detection, sandboxed file work, multi-provider.',
			link: 'https://github.com/reagent-systems/Simple-Agent-Core',
			linkLabel: 'github',
			image: '/research-images/simple-agent-core.png',
			howItWorks: {
				title: 'loop with brakes',
				description:
					'run manager turns the loop; tools load on demand; metacognition breaks repeats; sandbox keeps files inside the session. providers stay swappable: openai, lm studio, gemini.',
				diagram: 'agent-loop'
			},
			howItPerforms: {
				title: 'dual-source tools',
				description:
					'tools resolve from local commands/ first, then the remote simple-agent-tools catalog. the diagram is the loading model, not invented runtime scores.',
				perf: 'dual-source',
				localTools: ['commands/', 'overrides', 'dev tools'],
				remoteTools: [
					'file_ops',
					'github_ops',
					'web_ops',
					'data_ops',
					'system_ops',
					'api_ops'
				]
			}
		},
		{
			id: 'phone-agent',
			name: 'phone-agent',
			description:
				'typescript agent stack oriented toward phone-centric workflows, with docker-friendly deployment paths.',
			link: 'https://github.com/reagent-systems/phone-agent',
			linkLabel: 'github',
			image: '/research-images/phone-agent.png',
			howItWorks: {
				title: 'call to agent to ship',
				description:
					'inbound phone context hits a typescript agent, session state rides along, and docker packaging keeps the path close to a real phone-facing deploy.',
				diagram: 'call-stack'
			},
			howItPerforms: {
				title: 'runtime footprint',
				description:
					'github byte mix for the shipping shape: nearly all typescript application code, with dockerfile as the container edge.',
				perf: 'runtime-split',
				runtime: [
					{ label: 'typescript', value: 98.4, note: 'agent + services' },
					{ label: 'dockerfile', value: 1.6, note: 'deploy edge' }
				]
			}
		}
	];

	const models: ResearchItem[] = [
		{
			id: 'bently-coder-7b',
			name: 'bently coder 7b',
			description:
				'apache-2.0 coding model: qwen2.5-coder-7b-instruct plus qlora on about 7k personal github instruction pairs.',
			link: 'https://huggingface.co/Bentlybro/bently-coder-7b',
			linkLabel: 'huggingface',
			image: '/research-images/bently-coder-7b.png',
			howItWorks: {
				title: 'personal-repo qlora',
				description:
					'qwen2.5-coder-7b-instruct, then 4-bit qlora, then about 7k personal-repo pairs, then 2 epochs on an rtx 3060 12gb. task mix from the model card: write, complete, explain, refactor, document.',
				diagram: 'train-flow'
			},
			howItPerforms: {
				title: 'vs base checkpoint',
				description:
					'huggingface model card: bigcodebench hard 40% to 92% (+52pp), humaneval 50% to 86% (+36pp). four epochs overfit to 66%; two epochs is the reported release.',
				perf: 'bench-delta',
				benchmarks: [
					{ label: 'bigcodebench hard', base: 40, tuned: 92 },
					{ label: 'humaneval', base: 50, tuned: 86 }
				],
				taskMix: [
					{ label: 'write', value: 51, tone: 0.9 },
					{ label: 'complete', value: 17, tone: 0.7 },
					{ label: 'explain', value: 15, tone: 0.55 },
					{ label: 'refactor', value: 10, tone: 0.4 },
					{ label: 'document', value: 4, tone: 0.25 }
				]
			}
		}
	];

	/** Curated research releases, table shaped like nousresearch.com/releases */
	const releases: ReleaseRow[] = [
		{
			name: 'phone-agent',
			type: 'agent',
			details: 'typescript agent stack for phone-centric workflows with docker-friendly deploy paths.',
			date: '04/03/26',
			size: '',
			url: 'https://github.com/reagent-systems/phone-agent'
		},
		{
			name: 'dandelion',
			type: 'research',
			details: 'cuda / python / common lisp workshop for neuro-symbolic prototypes.',
			date: '04/02/26',
			size: '',
			url: 'https://github.com/reagent-systems/dandelion'
		},
		{
			name: 'bently coder 7b',
			type: 'model',
			details: 'qlora coding model on qwen2.5-coder-7b-instruct; bigcodebench hard 92%, humaneval 86%.',
			date: '03/01/26',
			size: '7B',
			url: 'https://huggingface.co/Bentlybro/bently-coder-7b'
		},
		{
			name: 'simple-agent-protocol',
			type: 'framework',
			details: 'websocket hub coordinating simple-agent-websocket instances and task delegation.',
			date: '05/31/25',
			size: '',
			url: 'https://github.com/reagent-systems/Simple-Agent-Protocol'
		},
		{
			name: 'simple-agent-websocket',
			type: 'framework',
			details: 'thin websocket wrapper around simple-agent-core for real-time web sessions.',
			date: '05/28/25',
			size: '',
			url: 'https://github.com/reagent-systems/Simple-Agent-Websocket'
		},
		{
			name: 'simple-agent-tools',
			type: 'tools',
			details: 'remote command catalog loaded on demand by simple-agent-core.',
			date: '05/23/25',
			size: '',
			url: 'https://github.com/reagent-systems/Simple-Agent-Tools'
		},
		{
			name: 'simple-agent-core',
			type: 'framework',
			details: 'minimalist python agent loop with dynamic tools, loop detection, and sandboxing.',
			date: '04/16/25',
			size: '',
			url: 'https://github.com/reagent-systems/Simple-Agent-Core'
		},
		{
			name: 'dither',
			type: 'tool',
			details: 'desktop dither dock: floyd-steinberg, ordered, atkinson, and shape dithering.',
			date: '07/08/25',
			size: '',
			url: 'https://github.com/reagent-systems/dither'
		},
		{
			name: 'orc',
			type: 'agent',
			details: 'autonomous multi-agent system on google adk with shared-workspace coordination.',
			date: '06/28/25',
			size: '',
			url: 'https://github.com/reagent-systems/orc'
		},
		{
			name: 'tetra',
			type: 'agent',
			details: 'android automation agent using screen analysis and accessibility actions.',
			date: '06/23/25',
			size: '',
			url: 'https://github.com/reagent-systems/tetra'
		},
		{
			name: 'spark',
			type: 'model',
			details: 'on-device android llm chat companion with optional local api server.',
			date: '06/24/25',
			size: '',
			url: 'https://github.com/reagent-systems/Spark'
		}
	].sort((a, b) => {
		const parse = (d: string) => {
			const [mm, dd, yy] = d.split('/').map(Number);
			return new Date(2000 + yy, mm - 1, dd).getTime();
		};
		return parse(b.date) - parse(a.date);
	});

	let mounted = $state(false);
	let selectedId = $state(architectures[0].id);
	let animationId: number | null = null;
	let startTime = Date.now();
	let asciiRotateX = $state(0);
	let asciiRotateY = $state(0);
	let asciiScale = $state(1);
	const asciiMaxRotation = 15;
	const asciiAnimationSpeed = 0.0003;
	const asciiBreathingSpeed = 0.0005;
	const asciiBreathingAmount = 0.05;

	const selected = $derived(
		[...architectures, ...models].find((item) => item.id === selectedId) ?? architectures[0]
	);

	function selectItem(id: string) {
		selectedId = id;
	}

	function mixOffset(mix: MixSlice[], index: number): number {
		return mix.slice(0, index).reduce((sum, s) => sum + s.value, 0);
	}

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

{#snippet numText(text: string)}
	{#each tokenizeNums(text) as part}
		{#if part.kind === 'num'}
			<span class="research-num">{part.value}</span>
		{:else}
			{part.value}
		{/if}
	{/each}
{/snippet}

{#snippet researchCard(item: ResearchItem)}
	<div
		class="research-item"
		class:selected={selectedId === item.id}
		role="button"
		tabindex="0"
		aria-pressed={selectedId === item.id}
		onclick={() => selectItem(item.id)}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				selectItem(item.id);
			}
		}}
	>
		<div class="research-item-picture">
			<img src={item.image} alt="" width="640" height="640" loading="lazy" />
		</div>
		<div class="research-item-body">
			<span class="research-item-name">{@render numText(item.name)}</span>
			<span class="research-item-description">{@render numText(item.description)}</span>
			<a class="research-item-link" href={item.link} target="_blank" rel="noopener noreferrer">
				{item.linkLabel}
			</a>
		</div>
	</div>
{/snippet}

<svelte:head>
	<title>research - reagent systems</title>
	<meta name="title" content="research - reagent systems" />
	<meta
		name="description"
		content="open research repositories and Hugging Face models from reagent systems: systems research, agents, and code LLMs."
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
		<header class="research-header">
			<h1 class="research-title">research</h1>
		</header>

		<section class="research-browse" aria-label="architectures and models">
			<div class="research-column">
				<h2 class="research-column-title">architectures</h2>
				<ul class="research-items">
					{#each architectures as item}
						<li>{@render researchCard(item)}</li>
					{/each}
				</ul>
			</div>

			<div class="research-column">
				<h2 class="research-column-title">models</h2>
				<ul class="research-items">
					{#each models as item}
						<li>{@render researchCard(item)}</li>
					{/each}
				</ul>
			</div>
		</section>

		<section class="research-detail research-how" aria-labelledby="how-it-works-title">
			{#key selected.id}
				<div class="research-detail-copy">
					<p class="research-detail-eyebrow">how it works</p>
					<h2 id="how-it-works-title" class="research-detail-title">
						{@render numText(selected.howItWorks.title)}
					</h2>
					<p class="research-detail-description">
						{@render numText(selected.howItWorks.description)}
					</p>
				</div>

				<div class="research-visual" data-kind={selected.howItWorks.diagram}>
					{#if selected.howItWorks.diagram === 'trilayer'}
						<svg class="viz" viewBox="0 0 560 280" role="img" aria-label="dandelion layers">
							{#each [
								['cuda kernels', 40, 0.88],
								['python host', 112, 0.58],
								['common lisp', 184, 0.36]
							] as [label, y, op]}
								<rect
									class="viz-band"
									x="48"
									y={y}
									width="464"
									height="56"
									rx="12"
									style="opacity: {op}"
								/>
								<text class="viz-label viz-label-light" x="280" y={Number(y) + 34}>{label}</text>
							{/each}
						</svg>
					{:else if selected.howItWorks.diagram === 'agent-loop'}
						<svg class="viz" viewBox="0 0 560 300" role="img" aria-label="agent loop">
							<circle class="viz-ring" cx="280" cy="150" r="70" />
							<circle class="viz-core" cx="280" cy="150" r="26" />
							<text class="viz-label" x="280" y="155">loop</text>
							{#each [
								['prompt', 280, 36],
								['tools', 470, 100],
								['provider', 450, 230],
								['sandbox', 110, 230],
								['meta', 90, 100]
							] as [label, x, y]}
								<line class="viz-line" x1="280" y1="150" x2={x} y2={y} />
								<rect
									class="viz-box"
									x={Number(x) - 48}
									y={Number(y) - 16}
									width="96"
									height="32"
									rx="6"
								/>
								<text class="viz-label" x={x} y={Number(y) + 5}>{label}</text>
							{/each}
						</svg>
					{:else if selected.howItWorks.diagram === 'call-stack'}
						<svg class="viz" viewBox="0 0 560 300" role="img" aria-label="phone agent stack">
							<rect class="viz-phone" x="210" y="20" width="140" height="260" rx="28" />
							{#each [
								['call', 52],
								['agent', 112],
								['context', 172],
								['docker', 232]
							] as [label, y], i}
								<rect class="viz-box viz-box-inset" x="232" y={y} width="96" height="40" rx="8" />
								<text class="viz-label" x="280" y={Number(y) + 20}>{label}</text>
								{#if i < 3}
									<line
										class="viz-line"
										x1="280"
										y1={Number(y) + 40}
										x2="280"
										y2={Number(y) + 60}
									/>
								{/if}
							{/each}
						</svg>
					{:else}
						<!-- train-flow -->
						<svg class="viz" viewBox="0 0 560 300" role="img" aria-label="qlora training flow">
							{#each [
								['qwen 7b', 20],
								['qlora', 128],
								['7k pairs', 236],
								['2 epochs', 344],
								['coder 7b', 452]
							] as [label, x], i}
								<rect
									class="viz-box"
									class:viz-box-strong={i === 4}
									x={x}
									y="56"
									width="96"
									height="56"
									rx="8"
								/>
								<text
									class="viz-label"
									class:viz-label-light={i === 4}
									x={Number(x) + 48}
									y="84">{label}</text
								>
								{#if i < 4}
									<line
										class="viz-line"
										x1={Number(x) + 96}
										y1="84"
										x2={Number(x) + 108}
										y2="84"
									/>
								{/if}
							{/each}
							{#if selected.howItPerforms.taskMix}
								{@const mix = selected.howItPerforms.taskMix}
								<text class="viz-caption" x="20" y="160">task mix</text>
								{#each mix as slice, i}
									{@const start = mixOffset(mix, i)}
									<rect
										class="viz-task"
										x={20 + start * 5.2}
										y="172"
										width={Math.max(slice.value * 5.2 - 2, 2)}
										height="24"
										style="opacity: {slice.tone}"
									/>
								{/each}
								{#each mix as slice, i}
									<text class="viz-caption" x={20 + i * 108} y="220"
										>{slice.label} {slice.value}%</text
									>
								{/each}
							{/if}
						</svg>
					{/if}
				</div>
			{/key}
		</section>

		<section class="research-detail research-perf" aria-labelledby="how-it-performs-title">
			{#key selected.id}
				{@const perf = selected.howItPerforms}
				<div class="research-detail-copy">
					<p class="research-detail-eyebrow">how it performs</p>
					<h2 id="how-it-performs-title" class="research-detail-title">
						{@render numText(perf.title)}
					</h2>
					<p class="research-detail-description">{@render numText(perf.description)}</p>
				</div>

				<div class="research-visual" data-kind={perf.perf}>
					{#if perf.perf === 'mix-strip' && perf.mix}
						<svg class="viz" viewBox="0 0 560 260" role="img" aria-label="language mix">
							{#each perf.mix as slice, i}
								{@const start = mixOffset(perf.mix, i)}
								<rect
									class="viz-strip"
									x={24 + start * 5.12}
									y="48"
									width={Math.max(slice.value * 5.12 - 1.5, 2)}
									height="40"
									style="opacity: {slice.tone}"
								/>
							{/each}
							{#each perf.mix as slice, i}
								<rect
									class="viz-swatch"
									x="24"
									y={110 + i * 22}
									width="12"
									height="12"
									style="opacity: {slice.tone}"
								/>
								<text class="viz-caption viz-caption-start" x="44" y={120 + i * 22}
									>{slice.label}  {slice.value}%</text
								>
							{/each}
						</svg>
					{:else if perf.perf === 'dual-source'}
						<div class="dual-source">
							<div class="dual-col">
								<p class="dual-heading">local</p>
								<ul>
									{#each perf.localTools ?? [] as t}
										<li>{t}</li>
									{/each}
								</ul>
							</div>
							<div class="dual-arrow" aria-hidden="true">overrides</div>
							<div class="dual-col dual-col-remote">
								<p class="dual-heading">remote catalog</p>
								<ul class="dual-chips">
									{#each perf.remoteTools ?? [] as t}
										<li>{t}</li>
									{/each}
								</ul>
							</div>
						</div>
					{:else if perf.perf === 'runtime-split' && perf.runtime}
						<div class="runtime-split">
							{#each perf.runtime as part}
								<div class="runtime-block">
									<span class="runtime-value">{part.value}%</span>
									<span class="runtime-label">{part.label}</span>
									<span class="runtime-note">{part.note}</span>
								</div>
							{/each}
						</div>
					{:else if perf.perf === 'bench-delta' && perf.benchmarks}
						{@const barMax = 260}
						{@const scale = barMax / 100}
						{@const barX = 120}
						{@const valueX = barX + barMax + 12}
						{@const deltaX = valueX + 56}
						<svg class="viz" viewBox="0 0 560 280" role="img" aria-label="benchmark deltas">
							{#each perf.benchmarks as bench, i}
								{@const y = 28 + i * 118}
								<text class="viz-caption viz-caption-start" x="16" y={y}>{bench.label}</text>

								<text class="viz-series" x="16" y={y + 36}>base</text>
								<rect
									class="viz-bar-base"
									x={barX}
									y={y + 20}
									width={bench.base * scale}
									height="20"
									rx="2"
								/>
								<text class="viz-value" x={valueX} y={y + 35}>{bench.base}%</text>

								<text class="viz-series" x="16" y={y + 68}>bently</text>
								<rect
									class="viz-bar-tuned"
									x={barX}
									y={y + 52}
									width={bench.tuned * scale}
									height="20"
									rx="2"
								/>
								<text class="viz-value" x={valueX} y={y + 67}>{bench.tuned}%</text>
								<text class="viz-delta" x={deltaX} y={y + 67}
									>+{bench.tuned - bench.base}pp</text
								>
							{/each}
							<text class="viz-caption viz-caption-start" x="16" y="268"
								>gray = base qwen · black = bently coder v1</text
							>
						</svg>
					{/if}
				</div>
			{/key}
		</section>

		<section class="research-releases" aria-labelledby="releases-title">
			<h2 id="releases-title" class="research-releases-title">releases</h2>
			<div class="releases-scroll">
				<table class="releases-table">
					<thead>
						<tr>
							<th scope="col" class="col-idx"></th>
							<th scope="col">project name</th>
							<th scope="col">type</th>
							<th scope="col">details</th>
							<th scope="col">release date</th>
							<th scope="col">size</th>
						</tr>
					</thead>
					<tbody>
						{#each releases as row, i}
							<tr>
								<td class="col-idx"><span class="research-num">{i}</span></td>
								<td class="col-name">
									<a href={row.url} target="_blank" rel="noopener noreferrer"
										>{@render numText(row.name)}</a
									>
								</td>
								<td class="col-type">{row.type}</td>
								<td class="col-details">{@render numText(row.details)}</td>
								<td class="col-date"><span class="research-num">{row.date}</span></td>
								<td class="col-size"
									>{#if row.size}<span class="research-num">{row.size}</span>{/if}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<PageSubnav />
	</div>
</div>

<style>
	.research-page {
		min-height: 100vh;
		min-height: 100dvh;
		width: 100%;
		max-width: 100%;
		padding: clamp(1.5rem, 3.5vw, 3.5rem) clamp(1.25rem, 3.5vw, 3.5rem);
		opacity: 0;
		transition: opacity 0.4s ease;
		display: flex;
		flex-direction: column;
		position: relative;
		overflow-x: clip;
		box-sizing: border-box;
	}

	.research-page.mounted {
		opacity: 1;
	}

	.research-ascii-bg {
		position: fixed;
		right: -20%;
		top: 8%;
		width: min(42vw, 720px);
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 2rem;
		pointer-events: none;
		z-index: 0;
		opacity: 0.55;
	}

	.research-ascii-art {
		font-family: var(--ascii-font);
		font-size: clamp(0.85rem, 1.4vw, 1.5rem);
		line-height: 1.2;
		background: linear-gradient(90deg, #fafafa, #f0f0f0, #fafafa);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		white-space: pre;
		margin: 0;
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
		width: 100%;
		min-width: 0;
	}

	.research-header {
		margin-bottom: clamp(2rem, 4vw, 3rem);
	}

	.research-title {
		font-size: clamp(3.25rem, 11vw, 7rem);
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: -0.02em;
		margin: 0;
		font-family: var(--main-font);
		line-height: 1.05;
	}

	.research-browse {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(2rem, 4vw, 4rem);
		margin-bottom: clamp(2.5rem, 5vw, 4.5rem);
		width: 100%;
	}

	.research-column-title {
		font-size: clamp(1.5rem, 3vw, 2.1rem);
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		margin: 0 0 1.75rem 0;
		font-family: var(--main-font);
	}

	.research-items {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: clamp(1.25rem, 2.5vw, 2rem);
	}

	.research-item {
		display: grid;
		grid-template-columns: minmax(10rem, 42%) minmax(0, 1fr);
		gap: clamp(1.1rem, 2.5vw, 1.75rem);
		width: 100%;
		padding: clamp(0.75rem, 1.5vw, 1.1rem);
		border: 1px solid transparent;
		border-left: 2px solid transparent;
		cursor: pointer;
		transition:
			border-color 0.3s ease,
			background-color 0.3s ease;
		box-sizing: border-box;
	}

	.research-item:hover {
		border-color: #ececec;
		border-left-color: #c8c8c8;
	}

	.research-item.selected {
		border-color: #e0e0e0;
		border-left-color: #1a1a1a;
		background: rgba(255, 255, 255, 0.55);
	}

	.research-item:focus-visible {
		outline: 1px solid #1a1a1a;
		outline-offset: 2px;
	}

	.research-item-picture {
		aspect-ratio: 1;
		width: 100%;
		border: none;
		background: transparent;
		overflow: hidden;
	}

	.research-item-picture img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		image-rendering: pixelated;
	}

	.research-item-body {
		display: flex;
		flex-direction: column;
		min-width: 0;
		gap: 0.55rem;
		justify-content: center;
	}

	.research-item-name {
		font-size: clamp(1.35rem, 2.6vw, 1.85rem);
		font-weight: 300;
		color: #1a1a1a;
		font-family: var(--main-font);
		text-transform: lowercase;
		line-height: 1.25;
	}

	.research-item-description {
		font-size: clamp(1.05rem, 1.9vw, 1.3rem);
		font-weight: 300;
		color: #6b6b6b;
		line-height: 1.55;
		font-family: var(--main-font);
	}

	.research-num {
		font-family: var(--ascii-font);
		font-weight: 100;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.01em;
	}

	.research-item-link {
		align-self: flex-start;
		font-size: clamp(0.95rem, 1.5vw, 1.1rem);
		font-weight: 300;
		color: #888;
		text-decoration: none;
		font-family: var(--main-font);
		text-transform: lowercase;
		transition: color 0.3s ease;
	}

	.research-item-link:hover {
		color: #1a1a1a;
	}

	.research-detail {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
		gap: clamp(1.75rem, 4vw, 3.5rem);
		align-items: center;
		padding: clamp(2rem, 4vw, 3rem) 0;
		border-top: 1px solid #e8e8e8;
		width: 100%;
		min-width: 0;
	}

	.research-perf {
		margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
	}

	.research-detail-copy {
		min-width: 0;
		animation: research-detail-in 0.45s ease;
	}

	.research-detail-eyebrow {
		font-size: clamp(0.9rem, 1.4vw, 1.05rem);
		font-weight: 300;
		color: #888;
		text-transform: lowercase;
		margin: 0 0 0.55rem 0;
		font-family: var(--main-font);
		letter-spacing: 0.04em;
	}

	.research-detail-title {
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		margin: 0 0 1rem 0;
		font-family: var(--main-font);
		letter-spacing: -0.02em;
		line-height: 1.15;
	}

	.research-detail-description {
		font-size: clamp(1.1rem, 2vw, 1.35rem);
		font-weight: 300;
		color: #6b6b6b;
		line-height: 1.65;
		margin: 0;
		font-family: var(--main-font);
		max-width: 42rem;
	}

	.research-visual {
		width: 100%;
		min-width: 0;
		animation: research-detail-in 0.5s ease;
	}

	.viz {
		display: block;
		width: 100%;
		height: auto;
		max-height: min(340px, 42vw);
	}

	.viz-box {
		fill: #f4f4f4;
		stroke: #cfcfcf;
		stroke-width: 1.25;
	}

	.viz-box-strong {
		fill: #1a1a1a;
		stroke: #1a1a1a;
	}

	.viz-box-inset {
		fill: #fafafa;
		stroke: #1a1a1a;
	}

	.viz-phone {
		fill: #f0f0f0;
		stroke: #1a1a1a;
		stroke-width: 2.5;
	}

	.viz-band {
		fill: #1a1a1a;
	}

	.viz-ring {
		fill: none;
		stroke: #1a1a1a;
		stroke-width: 3;
	}

	.viz-core {
		fill: #fafafa;
		stroke: #1a1a1a;
		stroke-width: 2;
	}

	.viz-line {
		stroke: #b0b0b0;
		stroke-width: 1.5;
	}

	.viz-label {
		fill: #1a1a1a;
		font-family: var(--ascii-font);
		font-size: 12px;
		font-weight: 100;
		text-anchor: middle;
		dominant-baseline: middle;
		text-transform: lowercase;
		pointer-events: none;
	}

	.viz-label-light {
		fill: #fafafa;
	}

	.viz-caption {
		fill: #888;
		font-family: var(--ascii-font);
		font-size: 11px;
		font-weight: 100;
		text-anchor: middle;
		text-transform: lowercase;
		pointer-events: none;
	}

	.viz-caption-start {
		text-anchor: start;
	}

	.viz-series {
		fill: #888;
		font-family: var(--ascii-font);
		font-size: 11px;
		font-weight: 100;
		text-anchor: start;
		dominant-baseline: middle;
		text-transform: lowercase;
		pointer-events: none;
	}

	.viz-value {
		fill: #1a1a1a;
		font-family: var(--ascii-font);
		font-size: 13px;
		font-weight: 100;
		text-anchor: start;
		dominant-baseline: middle;
		pointer-events: none;
	}

	.viz-strip,
	.viz-task,
	.viz-swatch {
		fill: #1a1a1a;
	}

	.viz-bar-base {
		fill: #c8c8c8;
	}

	.viz-bar-tuned {
		fill: #1a1a1a;
	}

	.viz-delta {
		fill: #1a1a1a;
		font-family: var(--ascii-font);
		font-size: 15px;
		font-weight: 100;
		text-anchor: start;
		dominant-baseline: middle;
		pointer-events: none;
	}

	.dual-source {
		display: grid;
		grid-template-columns: 1fr auto 1.4fr;
		gap: 1rem;
		align-items: start;
		border: 1px solid #e8e8e8;
		padding: 1.25rem;
	}

	.dual-heading {
		font-family: var(--main-font);
		font-size: 1.1rem;
		font-weight: 300;
		margin: 0 0 0.75rem;
		text-transform: lowercase;
		color: #1a1a1a;
	}

	.dual-col ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.dual-col li {
		font-family: var(--ascii-font);
		font-weight: 100;
		font-size: 0.85rem;
		color: #6b6b6b;
		text-transform: lowercase;
	}

	.dual-chips {
		display: flex !important;
		flex-wrap: wrap !important;
		flex-direction: row !important;
		gap: 0.4rem !important;
	}

	.dual-chips li {
		border: 1px solid #e0e0e0;
		padding: 0.35rem 0.55rem;
		color: #1a1a1a;
	}

	.dual-arrow {
		font-family: var(--ascii-font);
		font-weight: 100;
		font-size: 0.75rem;
		color: #888;
		align-self: center;
		text-transform: lowercase;
		writing-mode: vertical-rl;
		transform: rotate(180deg);
	}

	.runtime-split {
		display: grid;
		grid-template-columns: 1.6fr 1fr;
		gap: 1rem;
	}

	.runtime-block {
		border: 1px solid #e8e8e8;
		padding: 1.5rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		min-height: 9rem;
		justify-content: flex-end;
	}

	.runtime-block:first-child {
		background: #1a1a1a;
		border-color: #1a1a1a;
	}

	.runtime-block:first-child .runtime-value,
	.runtime-block:first-child .runtime-label,
	.runtime-block:first-child .runtime-note {
		color: #fafafa;
	}

	.runtime-value {
		font-family: var(--ascii-font);
		font-size: clamp(2.5rem, 5vw, 3.5rem);
		font-weight: 100;
		color: #1a1a1a;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.runtime-label {
		font-family: var(--main-font);
		font-size: 1.25rem;
		font-weight: 300;
		text-transform: lowercase;
		color: #1a1a1a;
	}

	.runtime-note {
		font-family: var(--ascii-font);
		font-weight: 100;
		font-size: 0.8rem;
		color: #888;
		text-transform: lowercase;
	}

	/* Releases table */
	.research-releases {
		border-top: 1px solid #e8e8e8;
		padding-top: clamp(2rem, 4vw, 3rem);
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
		width: 100%;
	}

	.research-releases-title {
		font-size: clamp(1.5rem, 3vw, 2.1rem);
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		margin: 0 0 1.5rem 0;
		font-family: var(--main-font);
		letter-spacing: -0.01em;
	}

	.releases-scroll {
		width: 100%;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.releases-table {
		width: 100%;
		border-collapse: collapse;
		min-width: 720px;
		font-family: var(--main-font);
	}

	.releases-table th {
		text-align: left;
		font-weight: 300;
		font-size: 0.8rem;
		color: #888;
		text-transform: lowercase;
		letter-spacing: 0.04em;
		padding: 0.65rem 0.75rem 0.85rem 0;
		border-bottom: 1px solid #e8e8e8;
		white-space: nowrap;
	}

	.releases-table td {
		padding: 1rem 0.75rem 1rem 0;
		border-bottom: 1px solid #f0f0f0;
		vertical-align: top;
		font-weight: 300;
		font-size: clamp(0.95rem, 1.4vw, 1.05rem);
		color: #6b6b6b;
	}

	.releases-table tr:hover td {
		background: rgba(255, 255, 255, 0.55);
	}

	.col-idx {
		width: 2.5rem;
		color: #b0b0b0 !important;
		font-family: var(--ascii-font);
		font-size: 0.85rem !important;
	}

	.col-name {
		min-width: 10rem;
	}

	.col-name a {
		color: #1a1a1a;
		text-decoration: none;
		text-transform: lowercase;
		transition: color 0.3s ease;
	}

	.col-name a:hover {
		color: #6b6b6b;
	}

	.col-type {
		text-transform: uppercase;
		font-family: var(--ascii-font);
		font-weight: 100;
		font-size: 0.75rem !important;
		letter-spacing: 0.06em;
		color: #888 !important;
		white-space: nowrap;
		width: 6.5rem;
	}

	.col-details {
		max-width: 28rem;
		line-height: 1.45;
	}

	.col-date {
		font-family: var(--ascii-font);
		font-size: 0.85rem !important;
		white-space: nowrap;
		width: 5.5rem;
		color: #888 !important;
	}

	.col-size {
		font-family: var(--ascii-font);
		font-size: 0.85rem !important;
		white-space: nowrap;
		width: 3.5rem;
		color: #888 !important;
	}

	@keyframes research-detail-in {
		from {
			opacity: 0;
			transform: translateY(0.4rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 1100px) {
		.research-browse {
			grid-template-columns: 1fr;
		}

		.research-item {
			grid-template-columns: minmax(11rem, 36%) minmax(0, 1fr);
		}
	}

	@media (max-width: 960px) {
		.research-detail {
			grid-template-columns: 1fr;
			align-items: start;
		}

		.dual-source {
			grid-template-columns: 1fr;
		}

		.dual-arrow {
			writing-mode: horizontal-tb;
			transform: none;
			text-align: center;
		}

		.runtime-split {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.research-page {
			padding: 1.5rem 1.25rem 2.5rem;
		}

		.research-ascii-bg {
			display: none;
		}

		.research-item {
			grid-template-columns: minmax(8.5rem, 40%) minmax(0, 1fr);
		}

		.research-detail-description {
			max-width: none;
		}
	}

	@media (max-width: 520px) {
		.research-item {
			grid-template-columns: 1fr;
		}

		.research-item-picture {
			width: min(100%, 18rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.research-page,
		.research-detail-copy,
		.research-visual,
		.research-ascii-art {
			animation: none !important;
			transition: none !important;
		}

		.research-page {
			opacity: 1;
		}
	}
</style>
