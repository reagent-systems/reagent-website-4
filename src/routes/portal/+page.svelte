<script lang="ts">
	import { onMount } from 'svelte';
	import { asciiArt } from '$lib/ascii-art';
	import PageSubnav from '$lib/PageSubnav.svelte';

	const typewriterMessages = [
		'\\\\ What do you want to make?',
		"\\\\ What should exist—but doesn't yet?",
		'\\\\ Name the thing you\x27re about to ship',
		'\\\\ What are we building?',
		"\\\\ One line: what's the idea?",
		'\\\\ Sketch the project in a single sentence',
		'\\\\ What tool do you wish you had today?',
		"\\\\ What's worth a weekend of focus?",
		'\\\\ Type the premise—no pitch deck required',
		'\\\\ What do you want to exist in the world?'
	];

	const TYPE_MS = 42;
	const DELETE_MS = 28;
	const PAUSE_FULL_MS = 2200;
	const PAUSE_EMPTY_MS = 600;

	let rotateX = $state(0);
	let rotateY = $state(0);
	let scale = $state(1);
	let animationId: number | null = null;
	let startTime = Date.now();
	let mounted = $state(false);
	let entryValue = $state('');
	let ghostText = $state('');
	let userHasTyped = $state(false);
	let inputRef: HTMLInputElement | null = $state(null);
	let isInputFocused = $state(false);
	/** Caret index for typed-phase overlay (must match input layout, not canvas measurement) */
	let caretIndex = $state(0);

	/** Read by the typewriter loop (async); not reactive inside the loop */
	let stopTypewriter = false;

	let showGhost = $derived(!userHasTyped && entryValue === '');
	let showTypedBlockCursor = $derived(isInputFocused && !showGhost);

	/** Horizontally scroll text + block overlay together (native scrollLeft). */
	let inputScrollLeft = $state(0);

	let measureCanvas: HTMLCanvasElement | null = null;

	function measureTextWidthInput(el: HTMLInputElement, text: string): number {
		if (typeof document === 'undefined' || text.length === 0) return 0;
		if (!measureCanvas) measureCanvas = document.createElement('canvas');
		const ctx = measureCanvas.getContext('2d');
		if (!ctx) return 0;
		ctx.font = getComputedStyle(el).font;
		return ctx.measureText(text).width;
	}

	/** Keep caret + block inside the visible text area (input horizontal scroll). */
	function scrollCaretIntoView(el: HTMLInputElement) {
		const caret = el.selectionStart ?? 0;
		const before = el.value.slice(0, caret);
		const prefixW = measureTextWidthInput(el, before);
		const cs = getComputedStyle(el);
		const padL = parseFloat(cs.paddingLeft) || 0;
		const padR = parseFloat(cs.paddingRight) || 0;
		const inner = Math.max(0, el.clientWidth - padL - padR);
		const cursorW = Math.max(1, measureTextWidthInput(el, '0'));
		const margin = Math.min(32, Math.max(8, inner * 0.08));
		let sl = el.scrollLeft;

		if (prefixW < sl + margin) {
			sl = Math.max(0, prefixW - margin);
		} else if (prefixW + cursorW > sl + inner - margin) {
			sl = Math.max(0, prefixW + cursorW - inner + margin);
		}

		if (sl !== el.scrollLeft) el.scrollLeft = sl;
	}

	function syncScrollLeftFromInput(el: HTMLInputElement | null) {
		if (!el) return;
		inputScrollLeft = el.scrollLeft;
	}

	function updateTypedCursorPos() {
		const el = inputRef;
		if (!el || showGhost) return;
		caretIndex = el.selectionStart ?? 0;
		scrollCaretIntoView(el);
		syncScrollLeftFromInput(el);
	}

	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		if (e.currentTarget.value.length > 0) {
			stopTypewriter = true;
			userHasTyped = true;
			ghostText = '';
		}
		updateTypedCursorPos();
	}

	$effect(() => {
		if (isInputFocused && !showGhost) {
			entryValue;
			showGhost;
			updateTypedCursorPos();
		}
	});

	$effect(() => {
		if (showGhost) {
			inputScrollLeft = 0;
			const el = inputRef;
			if (el) el.scrollLeft = 0;
		}
	});

	const maxRotation = 15;
	const animationSpeed = 0.0003;
	const breathingSpeed = 0.0005;
	const breathingAmount = 0.05;

	function animate() {
		const now = performance.now();
		const elapsed = (now - startTime) * animationSpeed;
		const breathingElapsed = (now - startTime) * breathingSpeed;

		const newRotateX = Math.sin(-elapsed) * maxRotation;
		const newRotateY = Math.cos(-elapsed) * maxRotation;
		const newScale = 1 + Math.sin(breathingElapsed) * breathingAmount;

		if (
			Math.abs(newRotateX - rotateX) > 0.01 ||
			Math.abs(newRotateY - rotateY) > 0.01 ||
			Math.abs(newScale - scale) > 0.001
		) {
			rotateX = newRotateX;
			rotateY = newRotateY;
			scale = newScale;
		}

		animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
		mounted = true;
		animate();

		function onDocSelectionChange() {
			const el = inputRef;
			if (el && document.activeElement === el) {
				updateTypedCursorPos();
			}
		}
		document.addEventListener('selectionchange', onDocSelectionChange);

		let cancelled = false;
		let delayId: ReturnType<typeof setTimeout> | null = null;

		function delay(ms: number) {
			return new Promise<void>((resolve) => {
				delayId = setTimeout(() => {
					delayId = null;
					resolve();
				}, ms);
			});
		}

		async function typewriterLoop() {
			let mi = 0;
			while (!cancelled && !stopTypewriter) {
				const full = typewriterMessages[mi % typewriterMessages.length];
				for (let c = 0; c <= full.length; c++) {
					if (cancelled || stopTypewriter) return;
					ghostText = full.slice(0, c);
					await delay(TYPE_MS);
				}
				await delay(PAUSE_FULL_MS);
				for (let c = full.length; c >= 0; c--) {
					if (cancelled || stopTypewriter) return;
					ghostText = full.slice(0, c);
					await delay(DELETE_MS);
				}
				await delay(PAUSE_EMPTY_MS);
				mi++;
			}
		}

		typewriterLoop();

		return () => {
			document.removeEventListener('selectionchange', onDocSelectionChange);
			cancelled = true;
			if (delayId !== null) clearTimeout(delayId);
			if (animationId !== null) {
				cancelAnimationFrame(animationId);
			}
		};
	});
</script>

<svelte:head>
	<title>portal - reagent systems</title>
	<meta name="title" content="portal - reagent systems" />
	<meta
		name="description"
		content="Internal and partner gateway for reagent systems—tools, docs, and resources for people who work with us."
	/>
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="container" class:mounted>
	<div class="graphic-container">
		<pre
			class="ascii-art"
			style="transform: perspective(1000px) rotateX({rotateX}deg) rotateY({rotateY}deg) scale({scale});"
		>{asciiArt}</pre>
	</div>
	<div class="portal-entry-layer">
		<label class="portal-entry-label" for="portal-entry">Portal prompt</label>
		<div class="portal-entry-wrap">
			<input
				bind:this={inputRef}
				id="portal-entry"
				class="portal-entry"
				class:portal-entry--ghosting={showGhost}
				type="text"
				name="portal-entry"
				autocomplete="off"
				spellcheck={false}
				bind:value={entryValue}
				oninput={handleInput}
				onfocus={() => {
					isInputFocused = true;
					updateTypedCursorPos();
				}}
				onblur={() => {
					isInputFocused = false;
				}}
				onscroll={(e) => syncScrollLeftFromInput(e.currentTarget)}
				onselect={() => updateTypedCursorPos()}
				onclick={() => updateTypedCursorPos()}
				onkeyup={() => updateTypedCursorPos()}
			/>
			{#if showGhost}
				<div class="portal-entry-ghost" aria-hidden="true">
					<div
						class="portal-entry-overlay-track"
						style="transform: translateX(-{inputScrollLeft}px)"
					>
						<span class="portal-entry-ghost-text">{ghostText}</span><span class="portal-entry-cursor"></span>
					</div>
				</div>
			{/if}
			{#if showTypedBlockCursor}
				<div class="portal-entry-typed-cursor-layer" aria-hidden="true">
					<div
						class="portal-entry-overlay-track"
						style="transform: translateX(-{inputScrollLeft}px)"
					>
						<span class="portal-entry-typed-prefix">{entryValue.slice(0, caretIndex)}</span><span class="portal-entry-cursor"></span>
					</div>
				</div>
			{/if}
		</div>
	</div>
	<div class="content-container">
		<div class="home-subnav-wrapper">
			<PageSubnav />
		</div>
	</div>
</div>

<style>
	.portal-entry-layer {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		z-index: 2;
		padding: 1rem;
		box-sizing: border-box;
	}

	.portal-entry-label {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.portal-entry-wrap {
		position: relative;
		pointer-events: auto;
		width: min(56rem, calc(100vw - 2rem));
	}

	.portal-entry {
		display: block;
		width: 100%;
		min-width: 0;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: none;
		-webkit-appearance: none;
		appearance: none;
		box-sizing: border-box;
		background: #000000;
		color: var(--page-background);
		border: 8pt solid var(--page-background);
		border-radius: 9999px;
		padding: 0.5rem 1.5rem;
		font-family: var(--ascii-font);
		font-size: 1rem;
		font-weight: 300;
		line-height: 1.35;
		letter-spacing: 0;
		outline: none;
		box-shadow: none;
		transition: border-color 0.15s ease;
		caret-color: transparent;
		/* Match native input: preserve spaces; parent overlay used nowrap which collapses without this */
		white-space: pre;
	}

	.portal-entry::-webkit-scrollbar {
		display: none;
	}

	.portal-entry--ghosting {
		color: transparent;
	}

	.portal-entry:focus {
		border: 8pt solid var(--page-background);
		box-shadow: none;
	}

	/* Same border + radius as .portal-entry so text inset matches native <input> */
	.portal-entry-ghost,
	.portal-entry-typed-cursor-layer {
		border: 8pt solid transparent;
		border-radius: 9999px;
	}

	.portal-entry-overlay-track {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		min-width: min-content;
		flex-shrink: 0;
	}

	.portal-entry-ghost {
		position: absolute;
		inset: 0;
		box-sizing: border-box;
		padding: 0.5rem 1.5rem;
		display: flex;
		align-items: center;
		pointer-events: none;
		z-index: 1;
		font-family: var(--ascii-font);
		font-size: 1rem;
		font-weight: 300;
		line-height: 1.35;
		letter-spacing: 0;
		white-space: nowrap;
		overflow: hidden;
	}

	.portal-entry-ghost-text {
		color: color-mix(in srgb, var(--page-background) 55%, transparent);
		white-space: pre;
	}

	.portal-entry-typed-cursor-layer {
		position: absolute;
		inset: 0;
		box-sizing: border-box;
		padding: 0.5rem 1.5rem;
		display: flex;
		align-items: center;
		pointer-events: none;
		z-index: 1;
		font-family: var(--ascii-font);
		font-size: 1rem;
		font-weight: 300;
		line-height: 1.35;
		letter-spacing: 0;
		white-space: nowrap;
		overflow: hidden;
	}

	/* Invisible copy of text before caret — same glyph widths as input */
	.portal-entry-typed-prefix {
		flex-shrink: 0;
		color: transparent;
		user-select: none;
		pointer-events: none;
		/* Override inherited nowrap from layer: must preserve every space char */
		white-space: pre;
	}

	.portal-entry-cursor {
		display: inline-block;
		flex-shrink: 0;
		width: 1ch;
		height: 1.2em;
		margin-left: 0;
		background: var(--page-background);
		vertical-align: text-bottom;
		animation: portal-cursor-blink 0.85s steps(1, end) infinite;
	}

	@keyframes portal-cursor-blink {
		0%,
		45% {
			opacity: 1;
		}
		50%,
		100% {
			opacity: 0;
		}
	}

	@media (max-width: 768px) {
		.portal-entry {
			font-size: 0.9rem;
			padding: 0.45rem 1.25rem;
		}

		.portal-entry-ghost {
			font-size: 0.9rem;
			padding: 0.45rem 1.25rem;
		}

		.portal-entry-typed-cursor-layer {
			font-size: 0.9rem;
			padding: 0.45rem 1.25rem;
		}
	}
</style>
