<script lang="ts">
	import { ARTICLES } from '$lib/home/content';
</script>

<svelte:head>
	<title>news - reagent systems</title>
	<meta name="description" content="news from reagent systems and its companies." />
	<link rel="canonical" href="https://reagent-systems.com/blog" />
</svelte:head>

<article class="news">
	<h1 class="title">news</h1>

	<ul class="articles">
		{#each ARTICLES as article}
			<li>
				<h2 class="sub">{article.title}</h2>
				<p class="body">{article.excerpt}</p>
			</li>
		{/each}
	</ul>

	<a class="quiet-link" href="/#join">get the newsletter</a>
</article>

<style>
	.news {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-xl);
		padding: var(--space-section) max(var(--gutter), calc((100% - 56rem) / 2));
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		color: #1a1a1a;
		min-height: 70vh;
	}

	.title {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: var(--text-title);
		margin: 0;
	}

	.articles {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-l);
	}

	.sub {
		font-family: var(--main-font);
		font-weight: 300;
		font-size: var(--text-sub);
		margin: 0 0 var(--space-xs);
	}

	.body {
		font-size: var(--text-body);
		line-height: 1.7;
		color: #5f5f5f;
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
