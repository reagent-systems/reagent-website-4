<script lang="ts">
	const partners: { name: string; logo: string }[] = [
		{ name: 'Linux Foundation', logo: '/partner-logos/linux-foundation.svg' },
		{ name: 'NVIDIA', logo: '/partner-logos/nvidia.svg' },
		{ name: 'Open Secure AI Alliance', logo: '/partner-logos/open-secure-ai-alliance.svg' }
	];
	// Repeated so the strip is always wider than the screen, then doubled for a seamless loop.
	const set = [...partners, ...partners, ...partners];
	const loop = [...set, ...set];
</script>

<section class="marquee" aria-label="partners">
	<div class="marquee-track">
		{#each loop as partner, i}
			<div class="marquee-item" aria-hidden={i >= partners.length}>
				<img src={partner.logo} alt={partner.name} />
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


	.marquee-item img {
		height: 2.4rem;
		width: auto;
		max-width: 11rem;
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
