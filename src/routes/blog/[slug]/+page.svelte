<script lang="ts">
	import { ARTICLES, articleBySlug, articleDate } from '$lib/articles';

	let { data }: { data: { slug: string } } = $props();
	const article = $derived(articleBySlug(data.slug)!);
	const others = $derived(ARTICLES.filter((a) => a.slug !== data.slug).slice(0, 3));
</script>

<svelte:head>
	<title>{article.title} - reagent systems</title>
	<meta name="description" content={article.excerpt} />
	<link rel="canonical" href="https://reagent-systems.com/blog/{article.slug}" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={article.title} />
	<meta property="og:description" content={article.excerpt} />
</svelte:head>

<article class="post">
	<nav class="crumbs" aria-label="breadcrumb">
		<a href="/">home</a>
		<span aria-hidden="true">/</span>
		<a href="/blog">news</a>
	</nav>

	<header>
		<time datetime={article.date}>{articleDate(article.date)}</time>
		<h1 class="title">{article.title}</h1>
		<p class="lede">{article.excerpt}</p>
	</header>

	<div class="text">
		{#each article.body as paragraph}
			<p>{paragraph}</p>
		{/each}
	</div>

	<a class="quiet-link" href="/#join">talk to reagent</a>

	{#if others.length}
		<section>
			<h2 class="sub">more news</h2>
			<ul>
				{#each others as other}
					<li><a href="/blog/{other.slug}">{other.title}</a></li>
				{/each}
			</ul>
		</section>
	{/if}
</article>

<style>
	.post {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-l);
		padding: var(--space-section) max(var(--gutter), calc((100% - 44rem) / 2));
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		color: #1a1a1a;
	}

	.crumbs {
		display: flex;
		gap: var(--space-xs);
		font-size: var(--text-small);
		color: #9a9a9a;
	}

	.crumbs a,
	ul a {
		color: #6b6b6b;
		text-decoration: none;
	}

	.crumbs a:hover,
	ul a:hover {
		color: #1a1a1a;
	}

	header {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
	}

	time {
		font-size: var(--text-small);
		letter-spacing: 0.04em;
		color: #9a9a9a;
	}

	.title {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: var(--text-title);
		line-height: 1.05;
		margin: 0;
	}

	.lede {
		font-size: var(--text-sub);
		line-height: 1.4;
		color: #6b6b6b;
		margin: 0;
	}

	.text p {
		font-size: var(--text-body);
		line-height: 1.8;
		color: #3f3f3f;
		margin: 0 0 var(--space-m);
	}

	.sub {
		font-family: var(--main-font);
		font-weight: 300;
		font-size: var(--text-sub);
		margin: 0 0 var(--space-s);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	ul a {
		font-size: var(--text-body);
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
