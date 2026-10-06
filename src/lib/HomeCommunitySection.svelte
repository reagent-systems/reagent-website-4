<section class="home-community" aria-labelledby="home-community-title">
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
			<img src="/social-icons/x_logo.svg" alt="" width="48" height="48" />
		</a>
		<a
			href="https://discord.reagent-systems.com/"
			target="_blank"
			rel="noopener noreferrer"
			class="home-community-social"
			aria-label="discord"
		>
			<img src="/social-icons/Discord-Symbol-White.svg" alt="" width="48" height="48" />
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
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 100;
		line-height: 1.05;
		font-family: var(--main-font);
		text-transform: lowercase;
		letter-spacing: -0.02em;
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
		gap: clamp(1.25rem, 3vw, 2rem);
	}

	.home-community-social {
		display: flex;
		align-items: center;
		justify-content: center;
		width: clamp(5.5rem, 14vw, 7.5rem);
		height: clamp(5.5rem, 14vw, 7.5rem);
		border-radius: 50%;
		background-color: #6b6b6b;
		text-decoration: none;
		transition:
			background-color 0.25s ease,
			transform 0.25s ease;
	}

	.home-community-social img {
		width: clamp(2.25rem, 6vw, 3rem);
		height: clamp(2.25rem, 6vw, 3rem);
		object-fit: contain;
		filter: brightness(0) invert(1);
	}

	.home-community-social:hover,
	.home-community-social:focus-visible {
		background-color: #1a1a1a;
		transform: scale(1.06);
	}
</style>
