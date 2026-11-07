<script lang="ts">
	import { onMount } from 'svelte';
	import { asciiArt } from '$lib/ascii-art';
	import AsciiField from '$lib/home/AsciiField.svelte';
	import PartnerMarquee from '$lib/home/PartnerMarquee.svelte';
	import Story from '$lib/home/Story.svelte';
	import { COMPANIES } from '$lib/home/companies';

	let mounted = $state(false);
	let activeSlug = $state<string | null>(null);
	let touchArmed = $state<string | null>(null);

	const activeLogo = $derived(COMPANIES.find((c) => c.slug === activeSlug)?.logo ?? null);

	function show(slug: string) {
		activeSlug = slug;
	}

	function clear() {
		activeSlug = null;
		touchArmed = null;
	}

	// On touch screens the first tap shows the company's mark, the second opens it.
	let lastPointer = 'mouse';

	function onClick(e: MouseEvent, slug: string) {
		if (lastPointer !== 'mouse' && touchArmed !== slug) {
			e.preventDefault();
			touchArmed = slug;
			activeSlug = slug;
		}
	}

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>reagent systems - the idea factory</title>
</svelte:head>

<div class="container hero" class:mounted>
	<AsciiField art={asciiArt} target={activeLogo} />
	<div class="content-container">
		<div class="title-container">
			<h1 class="main-title">the</h1>
			<h1 class="main-title">idea</h1>
			<h1 class="main-title">factory</h1>
		</div>
		<nav class="company-nav" aria-label="companies" onpointerleave={(e) => e.pointerType === 'mouse' && clear()}>
			{#each COMPANIES as company}
				<a
					href="/{company.slug}"
					class:active={activeSlug === company.slug}
					onmouseenter={() => show(company.slug)}
					onfocus={() => show(company.slug)}
					onblur={clear}
					onpointerdown={(e) => (lastPointer = e.pointerType)}
					onclick={(e) => onClick(e, company.slug)}>{company.name}</a
				>
			{/each}
		</nav>
	</div>
</div>

<PartnerMarquee />
<Story />

<style>
	.hero {
		overflow: hidden;
	}

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

	@media (max-width: 768px) {
		/* Same placement as the original home nav on phones. */
		.company-nav {
			grid-template-columns: 1fr;
			gap: 1.25rem;
			max-width: none;
			align-self: flex-start;
			margin-left: -12rem;
		}
	}
</style>
