<script lang="ts">
	// `dark` deepens pale logos so they match the rest of the strip; `round` seals get more height.
	const partners: { name: string; logo?: string; dark?: boolean; round?: boolean }[] = [
		{ name: 'Linux Foundation', logo: '/partner-logos/linux-foundation.svg' },
		{ name: 'NSF', logo: '/partner-logos/nsf.png', round: true },
		{ name: 'NVIDIA', logo: '/partner-logos/nvidia.svg' },
		{ name: 'City of Tampa', logo: '/partner-logos/city-of-tampa.png', dark: true },
		{ name: 'Open Secure AI Alliance', logo: '/partner-logos/open-secure-ai-alliance.svg' },
		{ name: 'SAM.gov', logo: '/partner-logos/sam-gov.svg' },
		{ name: 'Florida Polytechnic University', logo: '/partner-logos/florida-poly.png' },
		{ name: 'First Coast Alarm', logo: '/partner-logos/first-coast-alarm.webp', round: true }
	];
	// Repeated so the strip is always wider than the screen, then doubled for a seamless loop.
	const set = [...partners, ...partners];
	const loop = [...set, ...set];
</script>

<section class="marquee" aria-label="partners">
	<div class="marquee-track">
		{#each loop as partner, i}
			<div class="marquee-item" aria-hidden={i >= partners.length}>
				{#if partner.logo}
					<img src={partner.logo} alt={partner.name} class:dark={partner.dark} class:round={partner.round} />
				{:else}
					<span class="wordmark">{partner.name}</span>
				{/if}
			</div>
		{/each}
	</div>
</section>

<style>
	.marquee {
		position: relative;
		overflow: hidden;
		padding: 7rem 0;
		background: var(--page-background);
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
		mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
	}

	.marquee-track {
		display: flex;
		width: max-content;
		animation: drift 70s linear infinite;
	}

	.marquee-item {
		flex: none;
		width: 16rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}


	.wordmark {
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 500;
		font-size: 1.05rem;
		line-height: 1.2;
		letter-spacing: 0.02em;
		text-align: center;
		color: #1a1a1a;
		opacity: 0.5;
		max-width: 11rem;
	}

	.marquee-item img.round {
		height: 3.6rem;
	}

	.marquee-item img.dark {
		filter: grayscale(1) brightness(0.2) contrast(1.4);
		opacity: 0.75;
	}

	.marquee-item img {
		height: 2.6rem;
		width: auto;
		max-width: 10rem;
		object-fit: contain;
		filter: grayscale(1) contrast(1.1);
		opacity: 0.5;
	}

	@keyframes drift {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation-duration: 240s;
		}
	}

	@media (max-width: 768px) {
		.marquee {
			padding: 4.5rem 0;
		}
		.marquee-item {
			width: 11rem;
		}
	}
</style>
