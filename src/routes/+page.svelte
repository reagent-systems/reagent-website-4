<script lang="ts">
	import { onMount } from 'svelte';
	import { asciiArt } from '$lib/ascii-art';
	import AsciiField from '$lib/home/AsciiField.svelte';
	import DitherText from '$lib/home/DitherText.svelte';
	import PartnerMarquee from '$lib/home/PartnerMarquee.svelte';
	import Story from '$lib/home/Story.svelte';
	import { COMPANIES, HERO_ORDER, type Company } from '$lib/home/companies';
	import { systemsArt } from '$lib/home/systems-art';

	// Seconds each company holds the hero before the next one takes over.
	const HOLD_MS = 5000;

	// The parent company closes the cycle with its own mark.
	const systems: Company = {
		slug: 'systems',
		name: 'systems',
		fullName: 'reagent systems',
		line: '',
		email: 'help@reagent-systems.com',
		logo: '',
		art: systemsArt,
		slogan: ['reagent', 'systems', 'corporation']
	};
	const order: Company[] = [
		...HERO_ORDER.map((slug) => COMPANIES.find((c) => c.slug === slug)!),
		systems
	];

	let mounted = $state(false);
	let cycleIndex = $state(0);
	let hoverSlug = $state<string | null>(null);
	let touchArmed = $state<string | null>(null);
	let reduceMotion = $state(false);
	let heroEl: HTMLDivElement | undefined = $state();

	const current = $derived(
		(hoverSlug && COMPANIES.find((c) => c.slug === hoverSlug)) || order[cycleIndex]
	);
	// Creative's mark is the original dithered art.
	const activeLogo = $derived(
		current.slug === 'creative' ? null : current.art ? { art: current.art } : current.logo
	);

	function show(slug: string) {
		hoverSlug = slug;
	}

	function clear() {
		hoverSlug = null;
		touchArmed = null;
	}

	// On touch screens the first tap shows the company, the second opens it.
	let lastPointer = 'mouse';

	function onClick(e: MouseEvent, slug: string) {
		if (lastPointer !== 'mouse' && touchArmed !== slug) {
			e.preventDefault();
			touchArmed = slug;
			hoverSlug = slug;
		}
	}

	// Lines drift in from a soft blur, one after another.
	function mist(node: Element, { delay = 0, duration = 650 }: { delay?: number; duration?: number }) {
		return {
			delay,
			duration: reduceMotion ? 0 : duration,
			css: (t: number) =>
				`opacity: ${t}; filter: blur(${((1 - t) * 10).toFixed(2)}px); transform: translateY(${((1 - t) * 0.08).toFixed(3)}em);`
		};
	}

	onMount(() => {
		mounted = true;
		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		let visible = true;
		const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
			threshold: 0.3
		});
		if (heroEl) io.observe(heroEl);

		const timer = setInterval(() => {
			if (!visible || hoverSlug || document.hidden) return;
			cycleIndex = (cycleIndex + 1) % order.length;
		}, HOLD_MS);

		return () => {
			clearInterval(timer);
			io.disconnect();
		};
	});
</script>

<svelte:head>
	<title>reagent systems - the idea factory</title>
</svelte:head>

<div class="container hero" class:mounted bind:this={heroEl}>
	<AsciiField art={asciiArt} target={activeLogo} />
	<div class="content-container">
		<div class="title-container">
			<h1 class="visually-hidden">reagent systems, the idea factory</h1>
			{#each [0, 1, 2] as line}
				<div class="title-line" aria-hidden="true">
					{#key current.slug}
						<span
							class="main-title"
							style="--chars: {Math.max(...current.slogan.map((w) => w.length))}"
							in:mist={{ delay: 380 + line * 140 }}
							out:mist={{ delay: line * 90, duration: 450 }}>{current.slogan[line]}</span
						>
					{/key}
				</div>
			{/each}
			<a class="hero-link" href={current.slug === 'systems' ? '/' : `/${current.slug}`}>
				<DitherText text={current.fullName} />
			</a>
		</div>
		<!-- Company nav, hidden for now. Uncomment to bring it back.
		<nav class="company-nav" aria-label="companies" onpointerleave={(e) => e.pointerType === 'mouse' && clear()}>
			{#each order as company}
				<a
					href="/{company.slug}"
					class:active={current.slug === company.slug}
					onmouseenter={() => show(company.slug)}
					onfocus={() => show(company.slug)}
					onblur={clear}
					onpointerdown={(e) => (lastPointer = e.pointerType)}
					onclick={(e) => onClick(e, company.slug)}>{company.name}</a
				>
			{/each}
		</nav>
		-->
	</div>
</div>

<PartnerMarquee />
<Story />

<style>
	.hero {
		overflow: hidden;
	}

	/* Each slogan line stacks the outgoing and incoming word in one cell. */
	.title-line {
		display: grid;
		justify-items: end;
	}

	.title-line > :global(*) {
		grid-area: 1 / 1;
		display: block;
		white-space: nowrap;
	}

	/* On narrow screens a slide with a long word gets smaller words, so nothing
	   runs off the edge. Slides with short words keep the normal size. */
	@media (max-width: 768px) {
		.title-line > :global(.main-title) {
			font-size: min(6.5rem, calc((100vw - 3rem) / (var(--chars) * 0.49)));
		}
	}

	@media (max-width: 480px) {
		.title-line > :global(.main-title) {
			font-size: min(5rem, calc((100vw - 3rem) / (var(--chars) * 0.49)));
		}
	}

	.hero-link {
		margin-top: 1.75rem;
		align-self: flex-end;
		font-family: var(--ascii-font);
		font-weight: 400;
		font-size: 0.8rem;
		letter-spacing: 0.28em;
		text-transform: lowercase;
		text-decoration: none;
		background: linear-gradient(90deg, #2d4a8a, #800020);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		transition: opacity 0.3s ease;
	}

	.hero-link:hover {
		opacity: 0.7;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	/* Company nav styles, kept for when the nav comes back.
	.company-nav {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.25rem 2.5rem;
		margin-top: auto;
		max-width: 32rem;
		align-self: flex-end;
	}

	.company-nav a {
		font-size: 1.5rem;
		font-weight: 300;
		color: #6b6b6b;
		text-decoration: none;
		text-transform: lowercase;
		letter-spacing: 0.05em;
		transition: color 0.3s ease;
		font-family: 'Raleway Variable', var(--main-font);
		position: relative;
		justify-self: start;
	}

	.company-nav a::after {
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

	.company-nav a:hover,
	.company-nav a.active {
		color: #000;
	}

	.company-nav a:hover::after,
	.company-nav a.active::after {
		width: 100%;
	}
	*/

	/* Phones hid the nav even when it was shown on desktop.
	@media (max-width: 768px) {
		.company-nav {
			display: none;
		}
	}
	*/
</style>
