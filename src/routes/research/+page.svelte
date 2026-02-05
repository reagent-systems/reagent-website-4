<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
	
	let mounted = $state(false);
	let container: HTMLDivElement | null = null;
	let scene: THREE.Scene | null = null;
	let camera: THREE.PerspectiveCamera | null = null;
	let renderer: THREE.WebGLRenderer | null = null;
	let controls: OrbitControls | null = null;
	let moon: THREE.Mesh | null = null;
	let animationId: number | null = null;
	let resizeHandler: (() => void) | null = null;
	let effect: AsciiEffect | null = null;
	let containerAnimationId: number | null = null;
	let rotateX = $state(0);
	let rotateY = $state(0);
	let scale = $state(1);
	let startTime = Date.now();
	let isMobile = $state(false);

	const textureURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg";
	const displacementURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg";

	// Animation parameters for container 3D tilt
	const maxRotation = 15; // Maximum rotation in degrees
	const animationSpeed = 0.0003; // Speed of rotation (adjust for faster/slower)
	const breathingSpeed = 0.0005; // Speed of breathing effect (slower than rotation)
	const breathingAmount = 0.05; // Amount of scale change (5% zoom in/out)

	function animateContainer() {
		if (isMobile) return;
		
		const elapsed = (Date.now() - startTime) * animationSpeed;
		const breathingElapsed = (Date.now() - startTime) * breathingSpeed;
		
		// Use sine and cosine for smooth circular motion (clockwise)
		rotateX = Math.sin(-elapsed) * maxRotation;
		rotateY = Math.cos(-elapsed) * maxRotation;
		
		// Breathing effect - slow zoom in and out
		scale = 1 + Math.sin(breathingElapsed) * breathingAmount;
		
		containerAnimationId = requestAnimationFrame(animateContainer);
	}
	
	function checkMobile() {
		if (browser && typeof window !== 'undefined') {
			isMobile = window.innerWidth <= 768;
		}
	}

	function init() {
		if (!container || !browser || typeof window === 'undefined' || isMobile) return;

		scene = new THREE.Scene();

		const width = container.clientWidth;
		const height = container.clientHeight;
		camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor(0xffffff);
		renderer.setSize(width, height);
		// Don't append renderer.domElement directly - AsciiEffect will handle it

		// Create ASCII effect
		effect = new AsciiEffect(renderer, ' .:-=+*#%@', {
			resolution: 0.15,
			color: false
		});
		effect.setSize(width, height);
		effect.domElement.style.fontSize = '8px';
		effect.domElement.style.fontFamily = 'monospace';
		effect.domElement.style.lineHeight = '1';
		effect.domElement.style.backgroundColor = '#ffffff';
		effect.domElement.className = 'ascii-effect';
		container.appendChild(effect.domElement);

		controls = new OrbitControls(camera, effect.domElement);
		controls.enablePan = false;
		controls.enableZoom = false;

		const geometry = new THREE.SphereGeometry(2, 60, 60);

		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load(textureURL);
		const displacementMap = textureLoader.load(displacementURL);

		const material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			map: texture,
			displacementMap: displacementMap,
			displacementScale: 0.06,
			bumpMap: displacementMap,
			bumpScale: 0.04,
			reflectivity: 0,
			shininess: 0
		});

		moon = new THREE.Mesh(geometry, material);

		const light = new THREE.DirectionalLight(0xFFFFFF, 1);
		// Rotate light position by 210 degrees around Y axis
		const angle = 210 * Math.PI / 180;
		const x = -100;
		const z = 50;
		const newX = x * Math.cos(angle) - z * Math.sin(angle);
		const newZ = x * Math.sin(angle) + z * Math.cos(angle);
		light.position.set(newX, 10, newZ);
		scene.add(light);

		const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
		hemiLight.color.setHSL(0.6, 1, 0.6);
		hemiLight.groundColor.setHSL(0.095, 1, 0.75);
		hemiLight.position.set(0, 0, 0);
		scene.add(hemiLight);

		scene.add(moon);
		camera.position.z = 3;
		camera.position.x = 1.5;

		moon.rotation.x = 3.1415 * 0.02;
		moon.rotation.y = 3.1415 * 1.54;

		function animate() {
			if (!scene || !camera || !renderer || !moon || !effect) return;

			animationId = requestAnimationFrame(animate);
			moon.rotation.y += 0.002;
			moon.rotation.x += 0.0001;

			controls?.update();
			effect.render(scene, camera);
		}

		animate();

		function onResize() {
			if (!camera || !renderer || !container || !effect || typeof window === 'undefined') return;
			const width = container.clientWidth;
			const height = container.clientHeight;
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
			effect.setSize(width, height);
		}

		resizeHandler = onResize;
		window.addEventListener('resize', resizeHandler);
	}

	onMount(() => {
		mounted = true;
		checkMobile();
		
		// Only initialize Three.js if not on mobile
		if (!isMobile) {
			init();
			animateContainer();
		}
		
		// Listen for resize to handle orientation changes
		if (browser && typeof window !== 'undefined') {
			const mobileResizeHandler = () => {
				const wasMobile = isMobile;
				checkMobile();
				// If switching from desktop to mobile, clean up
				if (wasMobile !== isMobile && isMobile) {
					if (animationId !== null) {
						cancelAnimationFrame(animationId);
						animationId = null;
					}
					if (containerAnimationId !== null) {
						cancelAnimationFrame(containerAnimationId);
						containerAnimationId = null;
					}
				}
				// If switching from mobile to desktop, initialize
				if (wasMobile !== isMobile && !isMobile) {
					init();
					animateContainer();
				}
			};
			window.addEventListener('resize', mobileResizeHandler);
			
			return () => {
				if (containerAnimationId !== null) {
					cancelAnimationFrame(containerAnimationId);
				}
				window.removeEventListener('resize', mobileResizeHandler);
			};
		}
		
		return () => {
			if (containerAnimationId !== null) {
				cancelAnimationFrame(containerAnimationId);
			}
		};
	});

	onDestroy(() => {
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
		}
		if (containerAnimationId !== null) {
			cancelAnimationFrame(containerAnimationId);
		}
		if (effect && container) {
			try {
				container.removeChild(effect.domElement);
			} catch (e) {
				// Element may already be removed
			}
		}
		if (renderer) {
			renderer.dispose();
		}
		if (browser && typeof window !== 'undefined' && resizeHandler) {
			window.removeEventListener('resize', resizeHandler);
		}
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

<div 
	bind:this={container} 
	class="test-container"
	style="transform: perspective(1000px) rotateX({rotateX}deg) rotateY({rotateY}deg) scale({scale});"
></div>

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

	.test-container {
		width: 50%;
		height: 100vh;
		position: fixed;
		right: -20%;
		top: 0;
		transform-style: preserve-3d;
		will-change: transform;
		transition: transform 0.1s ease-out;
	}

	@media (max-width: 768px) {
		.test-container {
			display: none;
		}
	}

	:global(.test-container canvas) {
		width: 100%;
		height: 100%;
		display: block;
	}

	:global(.ascii-effect) {
		background: linear-gradient(90deg, #2d4a8a, #800020, #2d4a8a);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		/* Removed gradient-shift animation to avoid non-composited animations */
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
