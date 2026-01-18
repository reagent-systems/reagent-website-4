<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';

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

	const textureURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg";
	const displacementURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg";

	// Animation parameters for container 3D tilt
	const maxRotation = 15; // Maximum rotation in degrees
	const animationSpeed = 0.0003; // Speed of rotation (adjust for faster/slower)
	const breathingSpeed = 0.0005; // Speed of breathing effect (slower than rotation)
	const breathingAmount = 0.05; // Amount of scale change (5% zoom in/out)

	function animateContainer() {
		const elapsed = (Date.now() - startTime) * animationSpeed;
		const breathingElapsed = (Date.now() - startTime) * breathingSpeed;
		
		// Use sine and cosine for smooth circular motion (clockwise)
		rotateX = Math.sin(-elapsed) * maxRotation;
		rotateY = Math.cos(-elapsed) * maxRotation;
		
		// Breathing effect - slow zoom in and out
		scale = 1 + Math.sin(breathingElapsed) * breathingAmount;
		
		containerAnimationId = requestAnimationFrame(animateContainer);
	}

	function init() {
		if (!container || !browser || typeof window === 'undefined') return;

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
		init();
		animateContainer();
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

<div 
	bind:this={container} 
	class="test-container"
	style="transform: perspective(1000px) rotateX({rotateX}deg) rotateY({rotateY}deg) scale({scale});"
></div>

<style>
	:global(body) {
		margin: 0;
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
		animation: gradient-shift 8s linear infinite;
	}

	@keyframes gradient-shift {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
