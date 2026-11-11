<script lang="ts">
	import { onMount, untrack } from 'svelte';

	/** Text that dusts away into dither marks and re-forms as the new text. */
	let { text, duration = 900 }: { text: string; duration?: number } = $props();

	const DUST = ['.', ':', '-', '=', '+', ' '];

	let shown = $state(untrack(() => text));
	let last = untrack(() => text);
	let frame = 0;

	function run(from: string, to: string) {
		cancelAnimationFrame(frame);
		const len = Math.max(from.length, to.length);
		// Padded at the start because the text sits right-aligned.
		const a = from.padStart(len, ' ');
		const b = to.padStart(len, ' ');
		// Each letter dusts out, then settles into the new letter, at its own moment.
		const outAt = Array.from({ length: len }, () => Math.random() * duration * 0.45);
		const inAt = outAt.map((t) => t + duration * 0.2 + Math.random() * duration * 0.35);
		const start = performance.now();

		function step(now: number) {
			const e = now - start;
			let out = '';
			let done = true;
			for (let i = 0; i < len; i++) {
				if (e >= inAt[i]) out += b[i];
				else if (e >= outAt[i]) {
					out += DUST[Math.floor(Math.random() * DUST.length)];
					done = false;
				} else {
					out += a[i];
					done = false;
				}
			}
			shown = out;
			if (!done) frame = requestAnimationFrame(step);
			else shown = to;
		}
		frame = requestAnimationFrame(step);
	}

	$effect(() => {
		const next = text;
		if (next === last) return;
		const from = last;
		last = next;
		run(from, next);
	});

	onMount(() => () => cancelAnimationFrame(frame));
</script>

<span class="dither-text" aria-label={text}><span aria-hidden="true">{shown}</span></span>

<style>
	.dither-text {
		white-space: pre;
	}
</style>
