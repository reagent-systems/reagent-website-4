<script lang="ts">
	import { onMount } from 'svelte';
	import { asciiArt } from '$lib/ascii-art';
	import AsciiField from '$lib/home/AsciiField.svelte';
	import { COMPANIES } from '$lib/home/companies';
	import { SERVICES } from '$lib/site-links';

	let { data }: { data: { slug: string } } = $props();
	const company = $derived(COMPANIES.find((c) => c.slug === data.slug)!);
	const others = $derived(COMPANIES.filter((c) => c.slug !== data.slug));

	let mounted = $state(false);
	onMount(() => (mounted = true));

	// The founder-facing services, in the homepage's words.
	const how = SERVICES.filter((s) => s.id !== 'spark-inference');

	const description = $derived(
		`${company.fullName}: ${company.line} part of reagent systems. we work with founders on readiness, partnership and preparation for a capital raise, with no equity taken.`
	);
</script>

<svelte:head>
	<title>{company.fullName} - {company.slogan.join(' ')}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="https://reagent-systems.com/{company.slug}" />
</svelte:head>

<!-- The hero matches the homepage: the company's mark on the left, its three words on the right. -->
{#key company.slug}
	<div class="container hero" class:mounted>
		<AsciiField art={company.art ?? asciiArt} />
		<div class="content-container">
			<div class="title-container">
				<h1 class="visually-hidden">{company.fullName}, {company.slogan.join(' ')}</h1>
				{#each company.slogan as word}
					<span
						class="main-title"
						aria-hidden="true"
						style="--chars: {Math.max(...company.slogan.map((w) => w.length))}">{word}</span
					>
				{/each}
				<span class="hero-name">{company.fullName}</span>
			</div>
		</div>
	</div>
{/key}

<article class="company">
	<section class="intro">
		<h2 class="title">{company.fullName}</h2>
		<p class="body">{company.line}</p>
		<div class="links">
			<a class="quiet-link" href="mailto:{company.email}">{company.email}</a>
			<a class="quiet-link" href="/#join">talk to reagent</a>
		</div>
	</section>


	{#if company.slug === 'creative'}
		<section>
			<h2 class="sub">the community</h2>
			<div class="links">
				<a class="quiet-link" href="/community">meet the community</a>
				<a class="quiet-link" href="https://discord.reagent-systems.com/" target="_blank" rel="noopener noreferrer"
					>join the discord</a
				>
			</div>
		</section>
	{/if}

	<section>
		<h2 class="sub">how we work</h2>
		<dl class="how">
			{#each how as s}
				<div>
					<dt><a href="/services#{s.id}">{s.name}</a></dt>
					<dd>{s.text}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<section>
		<h2 class="sub">the other companies</h2>
		<ul class="others">
			{#each others as c}
				<li>
					<a href="/{c.slug}">{c.fullName}</a>
					<span>{c.line}</span>
				</li>
			{/each}
		</ul>
		<a class="quiet-link" href="/areas-served">areas served</a>
	</section>
</article>

<style>
	.hero {
		overflow: hidden;
	}

	.title-container {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.title-container .main-title {
		display: block;
		white-space: nowrap;
	}

	.hero-name {
		margin-top: 1.75rem;
		font-family: var(--ascii-font);
		font-size: 0.8rem;
		letter-spacing: 0.28em;
		background: linear-gradient(90deg, #2d4a8a, #800020);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	/* Long words shrink on narrow screens rather than run off the edge. */
	@media (max-width: 768px) {
		.title-container .main-title {
			font-size: min(6.5rem, calc((100vw - 3rem) / (var(--chars) * 0.49)));
		}
	}

	@media (max-width: 480px) {
		.title-container .main-title {
			font-size: min(5rem, calc((100vw - 3rem) / (var(--chars) * 0.49)));
		}
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.company {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		padding: var(--space-section) max(var(--gutter), calc((100% - 56rem) / 2));
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		color: #1a1a1a;
	}

	section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-m);
	}

	.title {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: var(--text-title);
		margin: 0;
	}

	.sub {
		font-family: var(--main-font);
		font-weight: 300;
		font-size: var(--text-sub);
		margin: 0;
	}

	.body {
		font-size: var(--text-body);
		line-height: 1.7;
		color: #5f5f5f;
		max-width: 40rem;
		margin: 0;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-s) var(--space-l);
	}

	.quiet-link {
		font-size: var(--text-small);
		letter-spacing: 0.04em;
		color: #6b6b6b;
		text-decoration: none;
	}

	.quiet-link:hover {
		color: #1a1a1a;
	}

	.how {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: var(--space-l) var(--space-m);
		margin: 0;
	}

	.how dt a {
		font-size: var(--text-body);
		color: #1a1a1a;
		text-decoration: none;
	}

	.how dt a:hover {
		color: #6b6b6b;
	}

	.how dd {
		margin: var(--space-xs) 0 0;
		font-size: var(--text-small);
		line-height: 1.6;
		color: #6b6b6b;
	}

	.others {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: var(--space-m);
		width: 100%;
	}

	.others li {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.others a {
		font-size: var(--text-body);
		color: #1a1a1a;
		text-decoration: none;
	}

	.others a:hover {
		color: #6b6b6b;
	}

	.others span {
		font-size: var(--text-small);
		color: #6b6b6b;
	}
</style>
