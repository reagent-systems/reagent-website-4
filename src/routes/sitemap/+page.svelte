<script lang="ts">
	import { SITEMAP } from '$lib/sitemap';
</script>

<svelte:head>
	<title>sitemap - reagent systems</title>
	<meta name="description" content="every page on reagent-systems.com, from services and research to each area we serve." />
	<link rel="canonical" href="https://reagent-systems.com/sitemap" />
</svelte:head>

<article class="sitemap">
	<h1 class="title">sitemap</h1>

	{#each SITEMAP as group}
		{#if group.links.length}
			<section>
				<h2 class="sub">{group.title}</h2>
				<ul>
					{#each group.links as link}
						<li><a href={link.href}>{link.label}</a></li>
					{/each}
				</ul>
			</section>
		{/if}
	{/each}
</article>

<style>
	.sitemap {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		padding: var(--space-section) max(var(--gutter), calc((100% - 56rem) / 2));
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		color: #1a1a1a;
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
		margin: 0 0 var(--space-m);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
		gap: var(--space-s) var(--space-m);
	}

	a {
		font-size: var(--text-body);
		color: #6b6b6b;
		text-decoration: none;
		white-space: nowrap;
	}

	a:hover {
		color: #1a1a1a;
	}
</style>
