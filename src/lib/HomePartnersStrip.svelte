<script lang="ts">
	import { homePartners, type HomePartner } from '$lib/home-partners';

	interface Props {
		partners?: HomePartner[];
	}

	let { partners = homePartners }: Props = $props();

	const trackPartners = $derived([...partners, ...partners]);
</script>

<section class="partners-strip" aria-labelledby="home-partners-heading">
	<h2 id="home-partners-heading" class="partners-heading">partners</h2>

	<div class="partners-scroll">
		<div class="partners-track" aria-hidden="true">
			<ul class="partners-row">
				{#each trackPartners as partner, index (partner.name + index)}
					<li class="partners-item">
						{#if partner.href}
							<a class="partner-link" href={partner.href} rel="noopener noreferrer" target="_blank">
								{#if partner.logoSrc}
									<img
										class="partner-logo"
										src={partner.logoSrc}
										alt={partner.logoAlt ?? partner.name}
										width="120"
										height="40"
										loading="lazy"
										decoding="async"
									/>
								{:else}
									<span class="partner-name">{partner.name}</span>
								{/if}
							</a>
						{:else if partner.logoSrc}
							<img
								class="partner-logo"
								src={partner.logoSrc}
								alt={partner.logoAlt ?? partner.name}
								width="120"
								height="40"
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<span class="partner-name">{partner.name}</span>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<ul class="partners-sr-list">
		{#each partners as partner (partner.name)}
			<li>
				{#if partner.href}
					<a href={partner.href}>{partner.name}</a>
				{:else}
					{partner.name}
				{/if}
			</li>
		{/each}
	</ul>
</section>

<style>
	.partners-strip {
		position: relative;
		z-index: 2;
		width: 100%;
		padding: 2.75rem 0 3.25rem;
		background-color: var(--page-background);
		border-top: 1px solid #e8e8e8;
	}

	.partners-heading {
		margin: 0 0 1.5rem;
		padding: 0 4rem;
		font-size: 0.95rem;
		font-weight: 300;
		color: #6b6b6b;
		text-transform: lowercase;
		letter-spacing: 0.12em;
		font-family: var(--main-font);
	}

	.partners-scroll {
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		mask-image: linear-gradient(
			to right,
			transparent,
			#000 8%,
			#000 92%,
			transparent
		);
	}

	.partners-scroll::-webkit-scrollbar {
		display: none;
	}

	.partners-track {
		display: flex;
		width: max-content;
		animation: partners-marquee 48s linear infinite;
	}

	.partners-scroll:hover .partners-track {
		animation-play-state: paused;
	}

	@media (prefers-reduced-motion: reduce) {
		.partners-track {
			animation: none;
		}
	}

	.partners-row {
		display: flex;
		align-items: center;
		gap: 3.5rem;
		margin: 0;
		padding: 0 4rem;
		list-style: none;
	}

	.partners-item {
		flex: 0 0 auto;
	}

	.partner-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.75rem;
		color: inherit;
		text-decoration: none;
		transition: color 0.25s ease, opacity 0.25s ease;
	}

	.partner-link:hover {
		color: #1a1a1a;
		opacity: 1;
	}

	.partner-name {
		font-family: 'Raleway Variable', var(--main-font);
		font-size: clamp(1.35rem, 2.2vw, 1.85rem);
		font-weight: 200;
		color: #8a8a8a;
		text-transform: lowercase;
		letter-spacing: 0.06em;
		white-space: nowrap;
		transition: color 0.25s ease;
	}

	.partner-link:hover .partner-name,
	.partner-link:focus-visible .partner-name {
		color: #1a1a1a;
	}

	.partner-logo {
		display: block;
		max-height: 2rem;
		width: auto;
		max-width: 8rem;
		object-fit: contain;
		opacity: 0.72;
		filter: grayscale(1);
		transition: opacity 0.25s ease, filter 0.25s ease;
	}

	.partner-link:hover .partner-logo,
	.partner-link:focus-visible .partner-logo {
		opacity: 1;
		filter: grayscale(0);
	}

	.partners-sr-list {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@keyframes partners-marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@media (max-width: 768px) {
		.partners-strip {
			padding: 2rem 0 2.5rem;
		}

		.partners-heading {
			padding: 0 2rem;
		}

		.partners-row {
			gap: 2.5rem;
			padding: 0 2rem;
		}
	}
</style>
