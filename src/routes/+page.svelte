<script lang="ts">
	import { onMount } from 'svelte';
	import { asciiArt } from '$lib/ascii-art';

	let rotateX = $state(0);
	let rotateY = $state(0);
	let scale = $state(1);
	let animationId: number | null = null;
	let startTime = Date.now();
	let mounted = $state(false);

	// Animation parameters
	const maxRotation = 15; // Maximum rotation in degrees
	const animationSpeed = 0.0003; // Speed of rotation (adjust for faster/slower)
	const breathingSpeed = 0.0005; // Speed of breathing effect (slower than rotation)
	const breathingAmount = 0.05; // Amount of scale change (5% zoom in/out)

	function animate() {
		const elapsed = (Date.now() - startTime) * animationSpeed;
		const breathingElapsed = (Date.now() - startTime) * breathingSpeed;
		
		// Use sine and cosine for smooth circular motion (clockwise)
		rotateX = Math.sin(-elapsed) * maxRotation;
		rotateY = Math.cos(-elapsed) * maxRotation;
		
		// Breathing effect - slow zoom in and out
		scale = 1 + Math.sin(breathingElapsed) * breathingAmount;
		
		animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
		mounted = true;
		animate();
		return () => {
			if (animationId !== null) {
				cancelAnimationFrame(animationId);
			}
		};
	});
</script>

<div class="container" class:mounted>
	<div class="graphic-container">
		<pre 
			class="ascii-art" 
			style="transform: perspective(1000px) rotateX({rotateX}deg) rotateY({rotateY}deg) scale({scale});"
		>{asciiArt}</pre>
	</div>
	<div class="content-container">
		<div class="title-container">
			<h1 class="main-title">the</h1>
			<h1 class="main-title">idea</h1>
			<h1 class="main-title">factory</h1>
		</div>
		<nav class="nav-links">
			<a href="/research" class="nav-link">research</a>
			<a href="/products" class="nav-link">products</a>
			<a href="/community" class="nav-link">community</a>
		</nav>
	</div>
</div>
