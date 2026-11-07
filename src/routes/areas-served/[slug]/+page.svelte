<script lang="ts">
	import { COMPANIES } from '$lib/home/companies';
	import {
		REGIONS,
		FETCHED,
		stateSources,
		countrySources,
		money,
		count,
		change,
		monthText,
		displayName,
		copyFor,
		type Area
	} from '$lib/areas';

	let { data }: { data: { area: Area } } = $props();
	const area = $derived(data.area);
	const name = $derived(displayName(area.name));
	const copy = $derived(copyFor(area.slug));
	// Companies that fit this place come first.
	const companies = $derived(
		copy
			? [...COMPANIES].sort((a, b) => rank(a.slug) - rank(b.slug))
			: COMPANIES
	);
	function rank(slug: string) {
		const i = copy?.focus.indexOf(slug) ?? -1;
		return i < 0 ? 99 : i;
	}

	// Other places in the same region, starting after this one.
	const nearby = $derived.by(() => {
		const region = REGIONS.find((r) => r.areas.some((a) => a.slug === area.slug));
		if (!region) return [];
		const i = region.areas.findIndex((a) => a.slug === area.slug);
		const rest = [...region.areas.slice(i + 1), ...region.areas.slice(0, i)];
		return rest.slice(0, 6);
	});

	type Fact = { label: string; value: string; note: string };

	const facts = $derived.by((): Fact[] => {
		const out: Fact[] = [];
		if (area.kind === 'state') {
			const b = area.business;
			if (b) {
				out.push({
					label: 'new business applications',
					value: count(b.last12),
					note: `filed in the twelve months to ${monthText(b.latest.date)}${b.prev12 ? `, ${change(b.last12, b.prev12)} on the twelve months before` : ''}.`
				});
				if (b.highPropensity12)
					out.push({
						label: 'likely employers',
						value: count(b.highPropensity12),
						note: 'applications the Census Bureau flags as likely to hire, over the same twelve months.'
					});
			}
			if (area.gdp)
				out.push({
					label: 'economy',
					value: money(area.gdp.value),
					note: `gross domestic product in ${area.gdp.year}${area.gdp.prior ? `, ${change(area.gdp.value, area.gdp.prior)} on the year before in current dollars` : ''}.`
				});
			if (area.population)
				out.push({
					label: 'population',
					value: count(area.population.value),
					note: `residents in ${area.population.year}${area.gdp ? `, about ${money(area.gdp.value / area.population.value)} of output per person` : ''}.`
				});
			if (area.manufacturing)
				out.push({
					label: 'manufacturing jobs',
					value: count(area.manufacturing.value),
					note: `people employed in manufacturing, ${monthText(area.manufacturing.date)}.`
				});
		} else {
			if (area.gdp)
				out.push({
					label: 'economy',
					value: money(area.gdp.value),
					note: `gross domestic product in ${area.gdp.year}, in current U.S. dollars${area.growth ? `; real growth of ${area.growth.value.toFixed(1)}% in ${area.growth.year}` : ''}.`
				});
			if (area.population)
				out.push({
					label: 'population',
					value: count(area.population.value),
					note: `residents in ${area.population.year}${area.gdp ? `, about ${money(area.gdp.value / area.population.value)} of output per person` : ''}.`
				});
			if (area.newBusinesses)
				out.push({
					label: 'new businesses',
					value: count(area.newBusinesses.value),
					note: `limited liability companies registered in ${area.newBusinesses.year}.`
				});
			if (area.patents)
				out.push({
					label: 'patent applications',
					value: count(area.patents.value),
					note: `filed by residents in ${area.patents.year}.`
				});
			if (area.research)
				out.push({
					label: 'research and development',
					value: `${area.research.value.toFixed(2)}%`,
					note: `of gross domestic product spent on research and development in ${area.research.year}.`
				});
		}
		return out;
	});

	// Twelve months of business applications, as bars.
	const months = $derived(area.kind === 'state' && area.business ? area.business.monthly.slice(-24) : []);
	const peak = $derived(Math.max(1, ...months.map((m) => m.value)));

	const sources = $derived(area.kind === 'state' ? stateSources(area.code) : countrySources(area));
	const title = $derived(`founders in ${name} - reagent systems`);
	const description = $derived(
		copy
			? `${copy.intro}`
			: `reagent systems works with founders in ${name}: readiness assessment, partnership, and preparation for a capital raise, with no equity taken.`
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="https://reagent-systems.com/areas-served/{area.slug}" />
</svelte:head>

<article class="area">
	<nav class="crumbs" aria-label="breadcrumb">
		<a href="/">home</a>
		<span aria-hidden="true">/</span>
		<a href="/areas-served">areas served</a>
		<span aria-hidden="true">/</span>
		<span>{name}</span>
	</nav>

	<header>
		<h1 class="title">founders in {name}</h1>
		<p class="lede">
			{#if copy}
				{copy.intro}
			{:else}
				we estimate the true technology or manufacturing readiness of the company, identify its constraints,
				and build it up to a stage ready to reach a capital raise. we take no equity and no percentage of any
				introduction.
			{/if}
		</p>
		<a class="quiet-link" href="/#join">talk to reagent</a>
	</header>

	{#if facts.length}
		<section>
			<h2 class="sub">{name} at a glance</h2>
			<dl class="facts">
				{#each facts as fact}
					<div class="fact">
						<dt>{fact.label}</dt>
						<dd class="value">{fact.value}</dd>
						<dd class="note">{fact.note}</dd>
					</div>
				{/each}
			</dl>

			{#if months.length}
				<figure class="months">
					<div class="bars" role="img" aria-label="monthly business applications in {name}, last {months.length} months">
						{#each months as m}
							<span style="height: {(m.value / peak) * 100}%" title="{monthText(m.date)}: {count(m.value)}"></span>
						{/each}
					</div>
					<figcaption>
						monthly business applications, {monthText(months[0].date)} to {monthText(months[months.length - 1].date)}, seasonally adjusted.
					</figcaption>
				</figure>
			{/if}
		</section>
	{/if}

	<section>
		<h2 class="sub">our companies</h2>
		<ul class="companies">
			{#each companies as company}
				<li>
					<a href="/{company.slug}">{company.fullName}</a>
					<span>{company.line}</span>
				</li>
			{/each}
		</ul>
	</section>

	{#if nearby.length}
		<section>
			<h2 class="sub">also serving</h2>
			<ul class="nearby">
				{#each nearby as place}
					<li><a href="/areas-served/{place.slug}">{displayName(place.name)}</a></li>
				{/each}
			</ul>
			<a class="quiet-link" href="/areas-served">all areas served</a>
		</section>
	{/if}

	{#if facts.length}
		<section class="sources">
			<h2 class="sub">sources</h2>
			<ul>
				{#each sources as s}
					<li><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
				{/each}
			</ul>
			{#if FETCHED}<p>figures retrieved {FETCHED}.</p>{/if}
		</section>
	{/if}
</article>

<style>
	.area {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		padding: var(--space-section) max(var(--gutter), calc((100% - 56rem) / 2));
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

	.crumbs a {
		color: #6b6b6b;
		text-decoration: none;
	}

	.crumbs a:hover {
		color: #1a1a1a;
	}

	header {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-m);
	}

	.title {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: var(--text-title);
		line-height: 1.05;
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

	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: var(--space-l) var(--space-m);
		margin: 0;
	}

	.fact {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	dt {
		font-size: var(--text-small);
		letter-spacing: 0.04em;
		color: #9a9a9a;
	}

	dd {
		margin: 0;
	}

	.value {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: var(--text-sub);
	}

	.note {
		font-size: var(--text-small);
		line-height: 1.6;
		color: #6b6b6b;
	}

	.months {
		margin: var(--space-l) 0 0;
	}

	.bars {
		display: flex;
		align-items: flex-end;
		gap: 3px;
		height: 6rem;
	}

	.bars span {
		flex: 1;
		min-width: 0;
		border-radius: 1px;
		background: #cfcfcf;
	}

	figcaption {
		margin-top: var(--space-s);
		font-size: var(--text-small);
		color: #9a9a9a;
	}

	.companies,
	.nearby,
	.sources ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.companies {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: var(--space-m);
	}

	.companies li {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.companies a {
		font-size: var(--text-body);
		color: #1a1a1a;
		text-decoration: none;
	}

	.companies span {
		font-size: var(--text-small);
		color: #6b6b6b;
	}

	.nearby {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-s) var(--space-l);
		margin-bottom: var(--space-m);
	}

	.nearby a,
	.companies a:hover {
		color: #6b6b6b;
	}

	.nearby a {
		text-decoration: none;
		font-size: var(--text-body);
	}

	.nearby a:hover {
		color: #1a1a1a;
	}

	.sources {
		font-size: var(--text-small);
		color: #9a9a9a;
	}

	.sources .sub {
		font-size: var(--text-body);
	}

	.sources li {
		margin-bottom: 0.35rem;
	}

	.sources a {
		color: #6b6b6b;
	}

	.sources a:hover {
		color: #1a1a1a;
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
