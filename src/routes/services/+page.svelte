<script lang="ts">
	import { SERVICES } from '$lib/site-links';
</script>

<svelte:head>
	<title>services - reagent systems</title>
	<meta
		name="description"
		content="readiness assessment, founder partnership, raise preparation, a founder network, and community inference on spark. reagent systems takes no equity and no percentage of any introduction."
	/>
	<link rel="canonical" href="https://reagent-systems.com/services" />
</svelte:head>

<article class="services">
	<header>
		<h1 class="title">services</h1>
		<p class="lede">
			if the only thing stopping anybody from the next breakthrough is a lack of our assistance, then by all
			means, we are going to assist.
		</p>
	</header>

	{#each SERVICES as service}
		<section id={service.id}>
			<h2 class="sub">{service.name}</h2>
			<p class="body">{service.text}</p>
			{#if service.link}
				<a class="quiet-link" href={service.link.href}>{service.link.label}</a>
			{/if}
		</section>
	{/each}

	<a class="quiet-link" href="/#join">talk to reagent</a>
</article>

<style>
	.services {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		padding: var(--space-section) max(var(--gutter), calc((100% - 56rem) / 2));
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		color: #1a1a1a;
	}

	header,
	section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-s);
		scroll-margin-top: var(--space-l);
	}

	.title {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: var(--text-title);
		margin: 0;
	}

	.lede,
	.body {
		font-size: var(--text-body);
		line-height: 1.7;
		color: #4a4a4a;
		max-width: 40rem;
		margin: 0;
	}

	.sub {
		font-family: var(--main-font);
		font-weight: 300;
		font-size: var(--text-sub);
		margin: 0;
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
</style>
