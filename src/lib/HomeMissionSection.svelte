<section class="home-mission" aria-labelledby="home-mission-title">
	<div class="home-mission-inner">
		<h2 id="home-mission-title" class="home-mission-title">mission</h2>
		<p class="home-mission-text">
			we are an open research lab and idea factory—exploring AI, systems, and software in
			public, sharing what we learn, and building tools that outlive any single project.
		</p>
	</div>
</section>

<style>
	.home-mission {
		--mission-veil: var(--page-background);

		position: relative;
		z-index: 1;
		width: 100%;
		padding: clamp(2.25rem, 5vw, 3.5rem) clamp(2rem, 4vw, 4rem) clamp(4rem, 9vw, 6rem);
		box-sizing: border-box;
		border: none;
		background: color-mix(in srgb, var(--mission-veil) 58%, transparent);
		backdrop-filter: blur(18px) saturate(1.08);
		-webkit-backdrop-filter: blur(18px) saturate(1.08);
		box-shadow:
			0 0 64px 32px var(--mission-veil),
			0 28px 56px 28px var(--mission-veil),
			0 -28px 56px 28px var(--mission-veil);
		isolation: isolate;
	}

	.home-mission-inner {
		width: 100%;
		max-width: 72rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: clamp(1.25rem, 2.5vw, 1.75rem);
	}

	.home-mission-title {
		margin: 0;
		font-size: clamp(1.5rem, 3vw, 2.1rem);
		font-weight: 100;
		font-family: var(--main-font);
		text-transform: lowercase;
		letter-spacing: -0.01em;
		color: #1a1a1a;
	}

	.home-mission-text {
		margin: 0;
		max-width: 42rem;
		font-size: clamp(1rem, 1.8vw, 1.15rem);
		font-weight: 300;
		line-height: 1.65;
		color: #6b6b6b;
		font-family: var(--main-font);
	}
</style>
