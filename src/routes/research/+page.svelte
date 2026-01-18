<script lang="ts">
	import { onMount } from 'svelte';
	
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>research - reagent systems</title>
</svelte:head>

<div class="research-page" class:mounted>
	<div class="research-header">
		<h1 class="research-title">research</h1>
	</div>
	
	<div class="research-sections">
		<section class="research-section">
			<h2 class="section-title">long-term exploration</h2>
			<p class="section-text">
				we pursue fundamental questions without the pressure of immediate commercial outcomes. 
				our researchers have the freedom to explore ideas that may take years to bear fruit, 
				understanding that breakthrough innovations often emerge from curiosity-driven inquiry.
			</p>
		</section>

		<section class="research-section">
			<h2 class="section-title">interdisciplinary collaboration</h2>
			<p class="section-text">
				the most profound discoveries happen at the intersection of disciplines. 
				we bring together researchers from diverse fields—computer science, mathematics, 
				cognitive science, and beyond—to tackle problems that no single discipline can solve alone.
			</p>
		</section>

		<section class="research-section">
			<h2 class="section-title">autonomous inquiry</h2>
			<p class="section-text">
				our researchers choose their own directions. we believe that the best work emerges 
				when brilliant minds follow their curiosity, not quarterly targets. 
				autonomy breeds innovation, and innovation requires space to think deeply.
			</p>
		</section>

		<section class="research-section">
			<h2 class="section-title">theoretical and applied</h2>
			<p class="section-text">
				we don't distinguish between "pure" and "applied" research. 
				theoretical insights inform practical applications, and real-world problems 
				drive theoretical breakthroughs. this dual approach accelerates discovery.
			</p>
		</section>

		<section class="research-section">
			<h2 class="section-title">open knowledge</h2>
			<p class="section-text">
				research findings belong to the world. we publish openly, share methodologies, 
				and contribute to the global knowledge commons. progress accelerates when ideas 
				flow freely and build upon each other.
			</p>
		</section>
	</div>

	<nav class="research-nav">
		<a href="/" class="nav-link">home</a>
		<a href="/products" class="nav-link">products</a>
		<a href="/community" class="nav-link">community</a>
	</nav>
</div>

<style>
	.research-page {
		min-height: 100vh;
		padding: 4rem 4rem 4rem 8rem;
		opacity: 0;
		transition: opacity 0.4s ease;
		display: flex;
		flex-direction: column;
	}

	.research-page.mounted {
		opacity: 1;
	}

	.research-header {
		margin-bottom: 6rem;
	}

	.research-title {
		font-size: 6rem;
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: -0.02em;
		margin: 0;
		font-family: var(--main-font);
	}

	.research-sections {
		display: flex;
		flex-direction: column;
		gap: 4rem;
		max-width: 800px;
		margin-bottom: 6rem;
	}

	.research-section {
		opacity: 0;
		transform: translateX(-20px);
		transition: opacity 0.6s ease, transform 0.6s ease;
	}

	.research-page.mounted .research-section:nth-child(1) {
		transition-delay: 0.1s;
		opacity: 1;
		transform: translateX(0);
	}

	.research-page.mounted .research-section:nth-child(2) {
		transition-delay: 0.2s;
		opacity: 1;
		transform: translateX(0);
	}

	.research-page.mounted .research-section:nth-child(3) {
		transition-delay: 0.3s;
		opacity: 1;
		transform: translateX(0);
	}

	.research-page.mounted .research-section:nth-child(4) {
		transition-delay: 0.4s;
		opacity: 1;
		transform: translateX(0);
	}

	.research-page.mounted .research-section:nth-child(5) {
		transition-delay: 0.5s;
		opacity: 1;
		transform: translateX(0);
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 300;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: 0.02em;
		margin: 0 0 1rem 0;
		font-family: var(--main-font);
	}

	.section-text {
		font-size: 1.5rem;
		font-weight: 300;
		color: #4a4a4a;
		line-height: 1.8;
		margin: 0;
		font-family: var(--main-font);
		text-align: justify;
	}

	.research-nav {
		display: flex;
		gap: 3rem;
		margin-top: auto;
	}

	.research-nav .nav-link {
		font-size: 1.5rem;
		font-weight: 300;
		color: #6b6b6b;
		background: none;
		text-decoration: none;
		text-transform: lowercase;
		letter-spacing: 0.05em;
		transition: color 0.3s ease;
		font-family: 'Raleway Variable', var(--main-font);
		-webkit-background-clip: initial;
		background-clip: initial;
		position: relative;
	}

	.research-nav .nav-link::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 0;
		height: 1px;
		background-color: #6b6b6b;
		transform: translateX(-50%);
		transition: width 0.3s ease;
	}

	.research-nav .nav-link:hover {
		color: #000000;
	}

	.research-nav .nav-link:hover::after {
		width: 100%;
	}

	@media (max-width: 768px) {
		.research-page {
			padding: 2rem;
		}

		.research-title {
			font-size: 4rem;
		}

		.section-title {
			font-size: 1.5rem;
		}

		.section-text {
			font-size: 1.5rem;
		}

		.research-nav {
			flex-direction: column;
			gap: 1.5rem;
			align-items: flex-start;
		}
	}
</style>
