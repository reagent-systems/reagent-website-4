<script lang="ts">
	// Keep multi-word names on one line; break only between places.
	const list = (items: string[]) => items.map((n) => n.replace(/ /g, '\u00a0')).join('  ·  ');

	import { COMPANIES } from '$lib/home/companies';

	const currentYear = new Date().getFullYear();

	const linkGroups = [
		{
			title: 'resources',
			links: [
				{ href: '/research', label: 'research' },
				{ href: '/blog', label: 'writing' },
				{ href: '/#join', label: 'newsletter' }
			]
		},
		{
			title: 'reagent',
			links: [
				{ href: '/plan', label: 'plan' },
				{ href: '/community', label: 'community' },
				{ href: '/careers', label: 'careers' },
				{ href: '/portal', label: 'portal' },
				{ href: '/#join', label: 'contact' }
			]
		}
	];

	const states = [
		'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut',
		'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa',
		'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan',
		'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire',
		'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio',
		'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
		'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia',
		'wisconsin', 'wyoming'
	];

	// Country lists outside North America are placeholders to confirm.
	const regions = [
		{
			name: 'europe',
			places: [
				'united kingdom', 'ireland', 'france', 'germany', 'netherlands', 'belgium',
				'switzerland', 'austria', 'spain', 'portugal', 'italy', 'sweden', 'norway',
				'denmark', 'finland', 'poland'
			]
		},
		{
			name: 'asia',
			places: [
				'japan', 'south korea', 'taiwan', 'singapore', 'india', 'indonesia', 'malaysia',
				'thailand', 'vietnam', 'philippines'
			]
		},
		{
			name: 'middle east',
			places: [
				'united arab emirates', 'saudi arabia', 'qatar', 'bahrain', 'kuwait', 'oman',
				'jordan', 'israel'
			]
		}
	];
</script>

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
				<a class="mail" href="https://x.com/Reagent_Systems" target="_blank" rel="noopener noreferrer"
					>x</a
				>
			</div>

			<nav class="link-col" aria-label="companies">
				<span class="col-title">companies</span>
				{#each COMPANIES as company}
					<a href="/{company.slug}">{company.name}</a>
				{/each}
			</nav>

			{#each linkGroups as group}
				<nav class="link-col" aria-label={group.title}>
					<span class="col-title">{group.title}</span>
					{#each group.links as link}
						<a href={link.href}>{link.label}</a>
					{/each}
				</nav>
			{/each}
		</div>

		<div class="served">
			<span class="served-title">where we serve</span>

			<div class="region">
				<span class="region-name">north america</span>
				<p class="places strong">canada · united states · mexico</p>
				<p class="places">
					{list(states)}
				</p>
			</div>

			<div class="region-row">
				{#each regions as region}
					<div class="region">
						<span class="region-name">{region.name}</span>
						<p class="places">
							{list(region.places)}
						</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="bottom">
			<span>© {currentYear} reagent systems</span>
			<a href="/privacy">privacy</a>
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
		grid-template-columns: 1.6fr repeat(3, 1fr);
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
		white-space: pre-wrap;
		line-height: 1.9;
		font-size: 0.98rem;
		max-width: 70rem;
	}

	.places.strong {
		color: #1a1a1a;
		font-size: 1.1rem;
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		font-size: 0.95rem;
	}

	@media (max-width: 1024px) {
		.footer-top {
			grid-template-columns: 1fr 1fr;
		}
		.brand {
			grid-column: 1 / -1;
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
	}
</style>
