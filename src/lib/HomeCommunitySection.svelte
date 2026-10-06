<section class="home-community" aria-labelledby="home-community-title">
	<div class="home-community-inner">
		<h2 id="home-community-title" class="home-community-title">
			<a class="home-community-title-link" href="/community">community</a>
		</h2>

		<div class="home-community-links">
		<a
			href="https://x.com/Reagent_Systems"
			target="_blank"
			rel="noopener noreferrer"
			class="home-community-social"
			aria-label="x"
		>
			<img src="/social-icons/x_logo.svg" alt="" width="96" height="96" />
		</a>
		<a
			href="https://discord.reagent-systems.com/"
			target="_blank"
			rel="noopener noreferrer"
			class="home-community-social"
			aria-label="discord"
		>
			<img src="/social-icons/Discord-Symbol-White.svg" alt="" width="96" height="96" />
		</a>
	</div>
</section>

<style>
	.home-community {
		--community-veil: var(--page-background);

		position: relative;
		z-index: 1;
		width: 100%;
		padding: clamp(2.25rem, 5vw, 3.5rem) clamp(2rem, 4vw, 4rem) clamp(4rem, 9vw, 6rem);
		border: none;
		background: color-mix(in srgb, var(--community-veil) 58%, transparent);
		backdrop-filter: blur(18px) saturate(1.08);
		-webkit-backdrop-filter: blur(18px) saturate(1.08);
		box-shadow:
			0 0 64px 32px var(--community-veil),
			0 28px 56px 28px var(--community-veil),
			0 -28px 56px 28px var(--community-veil);
		isolation: isolate;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(1.5rem, 3vw, 2.25rem);
		text-align: center;
	}

	.home-community-title {
		margin: 0;
		font-size: clamp(1.5rem, 3vw, 2.1rem);
		font-weight: 100;
		font-family: var(--main-font);
		text-transform: lowercase;
		letter-spacing: -0.01em;
	}

	.home-community-title-link {
		color: #1a1a1a;
		text-decoration: none;
		transition: color 0.25s ease;
	}

	.home-community-title-link:hover,
	.home-community-title-link:focus-visible {
		color: #6b6b6b;
	}

	.home-community-links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: clamp(2rem, 5vw, 3.5rem);
	}

	.home-community-social {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
	}

	.home-community-social img {
		width: clamp(4.25rem, 14vw, 6.75rem);
		height: clamp(4.25rem, 14vw, 6.75rem);
		object-fit: contain;
		filter: brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(187deg)
			brightness(95%) contrast(89%);
		transition:
			filter 0.25s ease,
			transform 0.25s ease;
	}

	.home-community-social:hover img,
	.home-community-social:focus-visible img {
		filter: brightness(0) saturate(100%) invert(9%) sepia(0%) saturate(0%) hue-rotate(187deg)
			brightness(95%) contrast(89%);
		transform: scale(1.04);
	}
</style>
