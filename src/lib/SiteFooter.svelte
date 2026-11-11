<script lang="ts">
	import { LINK_GROUPS, LEGAL_LINKS } from '$lib/site-links';
	import { REGIONS, displayName } from '$lib/areas';

	const currentYear = new Date().getFullYear();

	// North America lists its countries, then the states on their own line.
	const northAmerica = REGIONS.find((r) => r.name === 'north america')!;
	const states = REGIONS.find((r) => r.name === 'united states')!;
	const abroad = REGIONS.filter((r) => !['north america', 'united states'].includes(r.name));
</script>

{#snippet places(list: { slug: string; name: string }[])}
	{#each list as place, i}
		<a href="/areas-served/{place.slug}">{displayName(place.name).replace(/ /g, ' ')}</a>{#if i < list.length - 1}<span
				class="dot"
				aria-hidden="true">&nbsp;·</span
			>{' '}{/if}
	{/each}
{/snippet}

<footer class="footer">
	<div class="footer-inner">
		<div class="footer-top">
			<div class="brand">
				<span class="brand-name">reagent systems</span>
				<address>
					10523 bermuda isle dr<br />
					tampa, florida 33647
				</address>
				<a class="mail" href="mailto:help@reagent-systems.com">help@reagent-systems.com</a>
				<a class="mail" href="https://x.com/Reagent_Systems" target="_blank" rel="noopener noreferrer">x</a>
				<a class="work" href="/#join">talk to reagent</a>
			</div>

			{#each LINK_GROUPS as group}
				<nav class="link-col" aria-label={group.title}>
					<span class="col-title">{group.title}</span>
					{#each group.links as link}
						<a
							href={link.href}
							target={link.external ? '_blank' : undefined}
							rel={link.external ? 'noopener noreferrer' : undefined}>{link.label}</a
						>
					{/each}
				</nav>
			{/each}
		</div>

		<div class="served">
			<a class="served-title" href="/areas-served">areas served</a>

			<div class="region">
				<span class="region-name">north america</span>
				<p class="places strong">
					{#each northAmerica.areas as place, i}
						<a href="/areas-served/{place.slug}">{place.name}</a><span class="dot" aria-hidden="true"
							>&nbsp;·</span
						>{' '}{#if i === 0}<a href="/areas-served#united-states">united&nbsp;states</a><span
								class="dot"
								aria-hidden="true">&nbsp;·</span
							>{' '}{/if}
					{/each}
				</p>
				<p class="places">{@render places(states.areas)}</p>
			</div>

			<div class="region-row">
				{#each abroad as region}
					<div class="region">
						<span class="region-name">{region.name}</span>
						<p class="places">{@render places(region.areas)}</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="bottom">
			<span>© {currentYear} reagent systems. all rights reserved.</span>
			<nav class="legal" aria-label="legal">
				{#each LEGAL_LINKS as link}
					<a href={link.href}>{link.label}</a>
				{/each}
			</nav>
		</div>
	</div>
</footer>

<style>
	.footer {
		position: relative;
		z-index: 2;
		background: #f1f1f1;
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		color: #6b6b6b;
	}

	.footer-inner {
		max-width: 1400px;
		margin: 0 auto;
		padding: 9rem 8vw 3rem;
	}

	.footer-top {
		display: grid;
		grid-template-columns: 1.4fr repeat(4, 1fr);
		gap: 3rem;
		margin-bottom: 8rem;
	}

	.brand {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.brand-name {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: 2.6rem;
		color: #1a1a1a;
		margin-bottom: 1.25rem;
	}

	address {
		font-style: normal;
		line-height: 1.7;
		margin-bottom: 0.75rem;
	}

	.work {
		margin-top: 1.5rem;
		color: #1a1a1a;
		letter-spacing: 0.04em;
	}

	.link-col {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.col-title,
	.served-title,
	.region-name {
		color: #1a1a1a;
		font-size: 1.05rem;
		letter-spacing: 0.04em;
	}

	.col-title {
		margin-bottom: 0.6rem;
	}

	a {
		color: #6b6b6b;
		text-decoration: none;
		transition: color 0.25s ease;
		width: fit-content;
	}

	a:hover {
		color: #1a1a1a;
	}

	.served {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		margin-bottom: 7rem;
	}

	.served-title {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: 2.6rem;
		letter-spacing: -0.01em;
		color: #1a1a1a;
	}

	.region {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	.region-row {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 3rem;
	}

	.places {
		line-height: 1.9;
		font-size: 0.98rem;
		max-width: 70rem;
		margin: 0;
	}

	.places a {
		display: inline;
	}

	.places.strong a {
		color: #1a1a1a;
		font-size: 1.1rem;
	}

	.places.strong a:hover {
		color: #6b6b6b;
	}

	.dot {
		color: #b0b0b0;
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 1.5rem;
		font-size: 0.95rem;
	}

	.legal {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
	}

	@media (max-width: 1200px) {
		.footer-top {
			grid-template-columns: repeat(4, 1fr);
		}
		.brand {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 1024px) {
		.footer-top {
			grid-template-columns: 1fr 1fr;
		}
		.region-row {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.footer-inner {
			padding: 6rem 1.5rem 2.5rem;
		}
		.footer-top {
			margin-bottom: 5rem;
		}
		.brand-name,
		.served-title {
			font-size: 2.1rem;
		}
		.bottom {
			flex-direction: column;
			gap: 0.75rem;
		}
		.legal {
			gap: 1.5rem;
		}
	}
</style>
