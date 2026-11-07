<script lang="ts">
	import { REGIONS, displayName } from '$lib/areas';
</script>

<svelte:head>
	<title>areas served - reagent systems</title>
	<meta
		name="description"
		content="reagent systems works with founders across north america, europe, asia and the middle east. a page for every state and country we serve, with the public figures behind it."
	/>
	<link rel="canonical" href="https://reagent-systems.com/areas-served" />
</svelte:head>

<article class="areas">
	<header>
		<h1 class="title">areas served</h1>
		<p class="lede">
			founders reach us from across north america, europe, asia and the middle east. each place has its own page,
			with the public figures on new businesses and the economy there.
		</p>
	</header>

	{#each REGIONS as region}
		{#if region.areas.length}
			<section id={region.name.replace(/ /g, '-')}>
				<h2 class="sub">{region.name}</h2>
				<ul>
					{#each region.areas as place}
						<li><a href="/areas-served/{place.slug}">{displayName(place.name)}</a></li>
					{/each}
				</ul>
			</section>
		{/if}
	{/each}
</article>

<style>
	.areas {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		padding: var(--space-section) max(var(--gutter), calc((100% - 56rem) / 2));
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		color: #1a1a1a;
	}

	header {
		display: flex;
		flex-direction: column;
		gap: var(--space-m);
	}

	.title {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: var(--text-title);
		margin: 0;
	}

	.lede {
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
