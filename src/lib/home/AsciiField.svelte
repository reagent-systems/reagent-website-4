<script lang="ts">
	import { onMount } from 'svelte';

	// `target` is a logo image to dither, or `{ art }`: text art shown as-is, full size.
	let { art, target = null }: { art: string; target?: string | { art: string } | null } = $props();

	const RAMP = [' ', '.', ':', '-', '=', '+'];
	const DISSOLVE_MS = 700;

	const baseLines = art.split('\n');
	const cols = Math.max(...baseLines.map((l) => l.length));
	const rows = baseLines.length;
	const base = baseLines.map((l) => l.padEnd(cols, ' ')).join('').split('');

	let preEl: HTMLPreElement | undefined = $state();
	let rotateX = $state(0);
	let rotateY = $state(0);
	let scale = $state(1);

	let current = base.slice();
	let from = base.slice();
	let goal = base.slice();
	let delays = new Float32Array(rows * cols);
	let dissolveStart = 0;
	let dissolving = false;
	let requestId = 0;

	const logoCache = new Map<string, string[]>();

	function render(chars: string[]) {
		if (!preEl) return;
		let out = '';
		for (let r = 0; r < rows; r++) {
			out += chars.slice(r * cols, (r + 1) * cols).join('');
			if (r < rows - 1) out += '\n';
		}
		preEl.textContent = out;
	}

	function visibleBox() {
		if (!preEl) return { c0: 0, c1: cols, r0: 0, r1: rows };
		// Use the untransformed size; the 3D tilt inflates the bounding box.
		const parent = (preEl.offsetParent as HTMLElement | null) ?? preEl.parentElement!;
		const pBox = parent.getBoundingClientRect();
		const w = preEl.offsetWidth;
		const h = preEl.offsetHeight;
		const rect = { left: pBox.left + preEl.offsetLeft, top: pBox.top + preEl.offsetTop };
		const cw = w / cols;
		const ch = h / rows;
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const mobile = vw <= 768;
		const x0 = mobile ? vw * 0.08 : vw * 0.06;
		const x1 = mobile ? vw * 0.92 : vw * 0.48;
		const y0 = mobile ? vh * 0.04 : vh * 0.1;
		const y1 = mobile ? vh * 0.36 : vh * 0.9;
		const clampC = (v: number) => Math.max(0, Math.min(cols, Math.round(v)));
		const clampR = (v: number) => Math.max(0, Math.min(rows, Math.round(v)));
		return {
			c0: clampC((x0 - rect.left) / cw),
			c1: clampC((x1 - rect.left) / cw),
			r0: clampR((y0 - rect.top) / ch),
			r1: clampR((y1 - rect.top) / ch)
		};
	}

	function loadImage(src: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = src;
		});
	}

	async function logoGrid(src: string): Promise<string[]> {
		const box = visibleBox();
		const key = `${src}|${box.c0},${box.c1},${box.r0},${box.r1}`;
		const cached = logoCache.get(key);
		if (cached) return cached;

		const img = await loadImage(src);
		const availC = box.c1 - box.c0;
		const availR = box.r1 - box.r0;
		// Cells are about twice as tall as they are wide.
		const aspect = (img.naturalWidth || 1) / (img.naturalHeight || 1);
		let lc = Math.min(availC, availR * 2 * aspect) * 0.9;
		let lr = lc / (2 * aspect);
		lc = Math.max(4, Math.round(lc));
		lr = Math.max(2, Math.round(lr));

		const scaleUp = 4;
		const canvas = document.createElement('canvas');
		canvas.width = lc * scaleUp;
		canvas.height = lr * scaleUp;
		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		const grid = new Array(rows * cols).fill(' ');
		if (!ctx) return grid;
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

		const offC = box.c0 + Math.floor((availC - lc) / 2);
		const offR = box.r0 + Math.floor((availR - lr) / 2);

		for (let r = 0; r < lr; r++) {
			for (let c = 0; c < lc; c++) {
				let sum = 0;
				for (let y = 0; y < scaleUp; y++) {
					for (let x = 0; x < scaleUp; x++) {
						const i = ((r * scaleUp + y) * canvas.width + (c * scaleUp + x)) * 4;
						const a = data[i + 3] / 255;
						const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
						sum += a * (1 - lum);
					}
				}
				const v = sum / (scaleUp * scaleUp);
				const ch = RAMP[Math.min(RAMP.length - 1, Math.round(v * (RAMP.length - 1)))];
				const gr = offR + r;
				const gc = offC + c;
				if (gr >= 0 && gr < rows && gc >= 0 && gc < cols) grid[gr * cols + gc] = ch;
			}
		}
		logoCache.set(key, grid);
		return grid;
	}

	function startDissolve(next: string[]) {
		from = current.slice();
		goal = next;
		for (let i = 0; i < delays.length; i++) delays[i] = Math.random() * (DISSOLVE_MS - 160);
		dissolveStart = performance.now();
		dissolving = true;
	}

	// Text art at its own size, centred in the grid.
	function artGrid(text: string): string[] {
		const lines = text.split('\n').map((l) => Array.from(l));
		const w = Math.max(...lines.map((l) => l.length));
		const grid = new Array(rows * cols).fill(' ');
		const offR = Math.floor((rows - lines.length) / 2);
		const offC = Math.floor((cols - w) / 2);
		lines.forEach((line, r) =>
			line.forEach((ch, c) => {
				const gr = offR + r;
				const gc = offC + c;
				if (gr >= 0 && gr < rows && gc >= 0 && gc < cols) grid[gr * cols + gc] = ch;
			})
		);
		return grid;
	}

	$effect(() => {
		const src = target;
		const id = ++requestId;
		if (!src) {
			startDissolve(base);
			return;
		}
		if (typeof src === 'object') {
			startDissolve(artGrid(src.art));
			return;
		}
		logoGrid(src)
			.then((grid) => {
				if (id === requestId) startDissolve(grid);
			})
			.catch(() => {});
	});

	onMount(() => {
		const startTime = performance.now();
		let frame = 0;
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		render(current);

		// The hero only animates while it is on screen.
		let onScreen = true;
		const io = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
		if (preEl) io.observe(preEl.parentElement ?? preEl);

		function tick(now: number) {
			if (!onScreen) {
				frame = requestAnimationFrame(tick);
				return;
			}
			const t = now - startTime;
			if (!reduceMotion) {
				rotateX = Math.sin(-t * 0.0003) * 15;
				rotateY = Math.cos(-t * 0.0003) * 15;
				scale = 1 + Math.sin(t * 0.0005) * 0.05;
			}

			if (dissolving) {
				const e = now - dissolveStart;
				let done = true;
				for (let i = 0; i < current.length; i++) {
					if (from[i] === goal[i]) {
						current[i] = goal[i];
						continue;
					}
					const d = delays[i];
					if (e >= d + 120) current[i] = goal[i];
					else if (e >= d) {
						current[i] = RAMP[1 + Math.floor(Math.random() * (RAMP.length - 1))];
						done = false;
					} else {
						current[i] = from[i];
						done = false;
					}
				}
				render(current);
				if (done) dissolving = false;
			}
			frame = requestAnimationFrame(tick);
		}
		frame = requestAnimationFrame(tick);
		return () => {
			cancelAnimationFrame(frame);
			io.disconnect();
		};
	});
</script>

<div class="graphic-container" aria-hidden="true">
	<pre
		bind:this={preEl}
		class="ascii-art"
		style="transform: perspective(1000px) rotateX({rotateX}deg) rotateY({rotateY}deg) scale({scale});"
	></pre>
</div>
