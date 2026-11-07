<script lang="ts">
	// Placeholder entries until partner logos arrive. Swap `logo` in for each.
	const partners: { name: string; logo?: string }[] = Array.from({ length: 8 }, () => ({
		name: 'partner'
	}));
	const loop = [...partners, ...partners];
</script>

<section class="marquee" aria-label="partners">
	<div class="marquee-track">
		{#each loop as partner, i}
			<div class="marquee-item" aria-hidden={i >= partners.length}>
				{#if partner.logo}
					<img src={partner.logo} alt={partner.name} />
				{:else}
					<span>{partner.name}</span>
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

	.marquee-item span {
		font-family: var(--main-font);
		font-weight: 300;
		font-size: 1.6rem;
		letter-spacing: 0.04em;
		color: #b5b5b5;
		text-transform: lowercase;
	}

	.marquee-item img {
		max-height: 2.5rem;
		max-width: 10rem;
		filter: grayscale(1);
		opacity: 0.55;
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
		.marquee-item span {
			font-size: 1.25rem;
		}
	}
</style>
