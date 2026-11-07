<script lang="ts">
	import { onMount } from 'svelte';

	// `target` is a logo image to dither, or `{ art }`: text art shown as-is, full size.
	let { art, target = null }: { art: string; target?: string | { art: string } | null } = $props();

	const RAMP = [' ', '.', ':', '-', '=', '+'];
	const DISSOLVE_MS = 700;
	// Each cell scrambles for this long: the first half on the old art, the second on the new.
	const SCRAMBLE_MS = 120;

	const baseLines = art.split('\n');
	const cols = Math.max(...baseLines.map((l) => l.length));
	const rows = baseLines.length;
	const base = baseLines.map((l) => l.padEnd(cols, ' ')).join('').split('');

	let preEl: HTMLPreElement | undefined = $state();
	let stageEl: HTMLDivElement | undefined = $state();
	let canvasEls: HTMLCanvasElement[] = $state([]);
	let rotateX = $state(0);
	let rotateY = $state(0);
	let scale = $state(1);

	let requestId = 0;
	const logoCache = new Map<string, string[]>();

	/*
	 * The art is painted on canvases. Every character is drawn once into a glyph
	 * sheet, then copied into place, and a frame only touches the cells that
	 * change. Rewriting 24k characters of gradient text each frame was what made
	 * the dissolve stutter. The hidden <pre> keeps the layout and font sizing.
	 *
	 * Characters sit where the browser would put them in a line of text, so the
	 * wider Braille marks keep the size they had before.
	 *
	 * The outgoing and incoming art get their own canvas, so two layouts with
	 * different character widths never erase each other.
	 */
	type Layer = {
		el: HTMLCanvasElement;
		ctx: CanvasRenderingContext2D;
		layout: string[]; // the characters that set each cell's position
		xs: Float32Array; // left edge of each cell, css px
		ws: Float32Array; // width of each cell, css px
		drawn: string[]; // what is painted in each cell now
		left: number; // where this art's text block starts and how wide it is, device px
		width: number;
	};

	// Canvases reach past the <pre> on both sides: wide Braille rows grow the
	// block outward from its centre, as the text did when it lived in the <pre>.
	let pad = 0;
	let baseW = 0;

	let layers: Layer[] = [];
	let front = 0; // the layer holding the art at rest
	let back = 1; // the layer the next art arrives on
	let fading = -1;
	let fadeTimer = 0;

	let dpr = 1;
	let lineH = 0;
	let font = '';
	let gradStops: [string, string] = ['#2d4a8a', '#800020'];
	let sheet: HTMLCanvasElement | null = null;
	const advance = new Map<string, number>();
	let slotW = 0;
	let slotH = 0;
	const SHEET_COLS = 32;
	// The gradient runs left to right; each glyph takes the colour of its column band.
	// One glyph sheet is drawn in black, then copied once per band in that band's colour.
	const BANDS = 24;
	let bandSheets: HTMLCanvasElement[] = [];
	const slots = new Map<string, number>();
	let bandColors: string[] = [];

	let from: string[] = base.slice();
	let goal: string[] = base.slice();
	const delays = new Float32Array(rows * cols);
	let dissolveStart = 0;
	let dissolving = false;
	let ready = false;

	const blank = (ch: string) => ch === ' ' || ch === '⠀';

	function measure(ch: string) {
		let w = advance.get(ch);
		if (w === undefined) {
			w = measureCtx!.measureText(ch).width;
			advance.set(ch, w);
		}
		return w;
	}

	// Every printable ASCII character and every Braille pattern.
	const CHARSET = [
		...Array.from({ length: 95 }, (_, k) => String.fromCharCode(32 + k)),
		...Array.from({ length: 256 }, (_, k) => String.fromCharCode(0x2800 + k))
	];

	function buildSheets(extra: string[]) {
		const chars = [...new Set([...CHARSET, ...extra])];
		slots.clear();
		chars.forEach((ch, k) => slots.set(ch, k));
		const sheetRows = Math.ceil(chars.length / SHEET_COLS);
		sheet = sheet ?? document.createElement('canvas');
		sheet.width = slotW * SHEET_COLS;
		sheet.height = slotH * sheetRows;
		const ctx = sheet.getContext('2d')!;
		ctx.font = sheetFont;
		ctx.textBaseline = 'middle';
		ctx.fillStyle = '#000';
		chars.forEach((ch, k) => {
			const x = (k % SHEET_COLS) * slotW;
			const y = Math.floor(k / SHEET_COLS) * slotH;
			ctx.save();
			ctx.beginPath();
			ctx.rect(x, y, slotW, slotH);
			ctx.clip();
			ctx.fillText(ch, x, y + slotH / 2);
			ctx.restore();
		});
		bandSheets = bandColors.map((color, k) => {
			const c = bandSheets[k] ?? document.createElement('canvas');
			c.width = sheet!.width;
			c.height = sheet!.height;
			const bctx = c.getContext('2d')!;
			bctx.drawImage(sheet!, 0, 0);
			bctx.globalCompositeOperation = 'source-in';
			bctx.fillStyle = color;
			bctx.fillRect(0, 0, c.width, c.height);
			return c;
		});
	}

	function glyph(ch: string) {
		let k = slots.get(ch);
		if (k === undefined) {
			// A character outside the prepared set: rebuild with it included.
			buildSheets([...slots.keys(), ch]);
			k = slots.get(ch)!;
		}
		return { x: (k % SHEET_COLS) * slotW, y: Math.floor(k / SHEET_COLS) * slotH };
	}

	function layoutLayer(layer: Layer, chars: string[]) {
		layer.layout = chars;
		let widest = 0;
		for (let r = 0; r < rows; r++) {
			let x = 0;
			for (let c = 0; c < cols; c++) {
				const i = r * cols + c;
				const w = measure(chars[i]);
				layer.xs[i] = x;
				layer.ws[i] = w;
				x += w;
			}
			widest = Math.max(widest, x);
		}
		// Centre the block where the <pre> would have put it.
		const off = pad + (baseW - widest) / 2;
		for (let i = 0; i < layer.xs.length; i++) layer.xs[i] += off;
		layer.left = off * dpr;
		layer.width = Math.max(1, widest * dpr);
	}

	function paint(layer: Layer, i: number, ch: string) {
		if (layer.drawn[i] === ch) return;
		const r = (i / cols) | 0;
		const x0 = Math.round(layer.xs[i] * dpr);
		const x1 = Math.round((layer.xs[i] + layer.ws[i]) * dpr);
		const y0 = Math.round(r * lineH * dpr);
		const y1 = Math.round((r + 1) * lineH * dpr);
		const ctx = layer.ctx;
		if (!blank(layer.drawn[i])) ctx.clearRect(x0, y0, x1 - x0, y1 - y0);
		layer.drawn[i] = ch;
		if (!blank(ch)) {
			// The CSS gradient spanned the text block, so the colour follows the block.
			const band = Math.max(0, Math.min(BANDS - 1, (((x0 - layer.left) / layer.width) * BANDS) | 0));
			const g = glyph(ch);
			const w = Math.min(slotW, x1 - x0 + 1);
			ctx.drawImage(bandSheets[band], g.x, g.y, w, slotH, x0, y0 + ((y1 - y0 - slotH) >> 1), w, slotH);
		}
	}

	function gradientBands(a: string, b: string) {
		const probe = document.createElement('canvas').getContext('2d')!;
		const rgb = (c: string) => {
			probe.fillStyle = '#000';
			probe.fillStyle = c;
			const v = String(probe.fillStyle);
			const hex = v.match(/^#([0-9a-f]{6})$/i);
			if (hex) return [0, 2, 4].map((k) => parseInt(hex[1].slice(k, k + 2), 16));
			return (v.match(/[\d.]+/g) ?? ['0', '0', '0']).slice(0, 3).map(Number);
		};
		const [ca, cb] = [rgb(a), rgb(b)];
		return Array.from({ length: BANDS }, (_, k) => {
			const t = (k + 0.5) / BANDS;
			const m = ca.map((v, j) => Math.round(v + (cb[j] - v) * t));
			return `rgb(${m[0]}, ${m[1]}, ${m[2]})`;
		});
	}

	function clearLayer(layer: Layer) {
		layer.ctx.clearRect(0, 0, layer.el.width, layer.el.height);
		layer.drawn.fill(' ');
		// Empty canvases are hidden so the browser only composites the ones in use.
		layer.el.style.visibility = 'hidden';
	}

	function setup() {
		if (!preEl || canvasEls.length < 3) return;
		const w = preEl.offsetWidth;
		const h = preEl.offsetHeight;
		if (!w || !h) return;
		// Keep each bitmap under ~8M pixels so phones don't run out of canvas memory.
		dpr = Math.min(window.devicePixelRatio || 1, Math.sqrt(8e6 / (w * 1.4 * h)));
		lineH = h / rows;
		const cs = getComputedStyle(preEl);
		font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
		const stops = cs.backgroundImage.match(/rgba?\([^)]*\)|#[0-9a-f]{3,8}/gi) ?? [];
		if (stops.length >= 2) gradStops = [stops[0]!, stops[1]!];
		bandColors = gradientBands(gradStops[0], gradStops[1]);
		baseW = w;
		pad = Math.ceil(w * 0.2);

		// Widths are measured at css size; glyphs are drawn at device size.
		measureCtx = document.createElement('canvas').getContext('2d')!;
		measureCtx.font = font;
		advance.clear();
		const widest = Math.max(measure('M'), measure('\u28ff'));
		slotW = Math.ceil(widest * dpr) + 2;
		slotH = Math.ceil(lineH * dpr);
		sheetFont = `${cs.fontWeight} ${parseFloat(cs.fontSize) * dpr}px ${cs.fontFamily}`;
		buildSheets([]);

		layers = canvasEls.map((el) => {
			el.width = Math.round((w + 2 * pad) * dpr);
			el.height = Math.round(h * dpr);
			el.style.width = `${w + 2 * pad}px`;
			el.style.left = `${-pad}px`;
			el.style.transition = 'none';
			el.style.opacity = '1';
			return {
				el,
				ctx: el.getContext('2d')!,
				layout: base,
				xs: new Float32Array(rows * cols),
				ws: new Float32Array(rows * cols),
				drawn: new Array(rows * cols).fill(' '),
				left: 0,
				width: 1
			};
		});
		fading = -1;

		// A resize mid-change just lands on the new art.
		const showing = dissolving ? goal : from;
		dissolving = false;
		from = showing;
		front = 0;
		back = 1;
		layers.forEach((l) => (l.el.style.visibility = 'hidden'));
		layers[front].el.style.visibility = 'visible';
		layoutLayer(layers[front], showing);
		for (let i = 0; i < showing.length; i++) paint(layers[front], i, showing[i]);
		ready = true;
	}

	let measureCtx: CanvasRenderingContext2D | null = null;
	let sheetFont = '';

	function visibleBox() {
		if (!preEl || !stageEl) return { c0: 0, c1: cols, r0: 0, r1: rows };
		// Use the untransformed size; the 3D tilt inflates the bounding box.
		const parent = (stageEl.offsetParent as HTMLElement | null) ?? stageEl.parentElement!;
		const pBox = parent.getBoundingClientRect();
		const w = preEl.offsetWidth;
		const h = preEl.offsetHeight;
		const rect = { left: pBox.left + stageEl.offsetLeft, top: pBox.top + stageEl.offsetTop };
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
		if (!ready) {
			from = next;
			return;
		}
		if (dissolving) {
			// Interrupted: the half-built art becomes the outgoing art, and the
			// art that was leaving fades away on its own.
			if (fading >= 0) clearLayer(layers[fading]);
			fading = front;
			const el = layers[fading].el;
			el.style.transition = 'opacity 0.25s ease';
			el.style.opacity = '0';
			clearTimeout(fadeTimer);
			const f = fading;
			fadeTimer = window.setTimeout(() => {
				clearLayer(layers[f]);
				layers[f].el.style.transition = 'none';
				layers[f].el.style.opacity = '1';
				if (fading === f) fading = -1;
			}, 260);
			front = back;
			from = layers[front].drawn.slice();
			back = [0, 1, 2].find((n) => n !== front && n !== fading)!;
		} else {
			from = layers[front].drawn.slice();
		}
		const incoming = layers[back];
		clearLayer(incoming);
		incoming.el.style.transition = 'none';
		incoming.el.style.opacity = '1';
		incoming.el.style.visibility = 'visible';
		layoutLayer(incoming, next);
		goal = next;
		for (let i = 0; i < delays.length; i++) delays[i] = Math.random() * (DISSOLVE_MS - 160);
		dissolveStart = performance.now();
		dissolving = true;
	}

	// Scramble characters change at ~30 fps, so a cell repaints every other frame.
	const noise = (i: number, e: number, salt: number) =>
		RAMP[1 + ((((i * 2654435761) ^ (((e / 33) | 0) * 40503 + salt)) >>> 0) % (RAMP.length - 1))];

	function step(now: number) {
		const out = layers[front];
		const inc = layers[back];
		const e = now - dissolveStart;
		const half = SCRAMBLE_MS / 2;
		let done = true;
		for (let i = 0; i < goal.length; i++) {
			const d = delays[i];
			const scramble = from[i] !== goal[i];
			if (e < d) {
				done = false;
				continue;
			}
			if (scramble && e < d + half) {
				paint(out, i, noise(i, e, 1));
				done = false;
			} else if (scramble && e < d + SCRAMBLE_MS) {
				paint(out, i, ' ');
				paint(inc, i, noise(i, e, 2));
				done = false;
			} else {
				paint(out, i, ' ');
				paint(inc, i, goal[i]);
			}
		}
		if (done) {
			dissolving = false;
			clearLayer(out);
			[front, back] = [back, front];
			from = goal;
		}
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
		if (preEl) preEl.textContent = baseLines.map((l) => l.padEnd(cols, ' ')).join('\n');
		const pending = from;
		setup();
		if (pending !== from) startDissolve(pending);
		document.fonts?.ready.then(() => setup());
		let lastW = preEl?.offsetWidth ?? 0;
		let lastH = preEl?.offsetHeight ?? 0;
		const ro = new ResizeObserver(() => {
			if (!preEl || (preEl.offsetWidth === lastW && preEl.offsetHeight === lastH)) return;
			lastW = preEl.offsetWidth;
			lastH = preEl.offsetHeight;
			setup();
		});
		if (preEl) ro.observe(preEl);

		// The hero only animates while it is on screen.
		let onScreen = true;
		const io = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
		if (stageEl) io.observe(stageEl.parentElement ?? stageEl);

		function tick(now: number) {
			if (onScreen) {
				const t = now - startTime;
				if (!reduceMotion) {
					rotateX = Math.sin(-t * 0.0003) * 15;
					rotateY = Math.cos(-t * 0.0003) * 15;
					scale = 1 + Math.sin(t * 0.0005) * 0.05;
				}
				if (dissolving && ready) step(now);
			}
			frame = requestAnimationFrame(tick);
		}
		frame = requestAnimationFrame(tick);
		return () => {
			cancelAnimationFrame(frame);
			clearTimeout(fadeTimer);
			io.disconnect();
			ro.disconnect();
		};
	});
</script>

<div class="graphic-container" aria-hidden="true">
	<div
		class="ascii-stage"
		bind:this={stageEl}
		style="transform: perspective(1000px) rotateX({rotateX}deg) rotateY({rotateY}deg) scale({scale});"
	>
		<pre bind:this={preEl} class="ascii-art"></pre>
		{#each [0, 1, 2] as n}
			<canvas bind:this={canvasEls[n]}></canvas>
		{/each}
	</div>
</div>

<style>
	.ascii-stage {
		position: relative;
		will-change: transform;
		transition: transform 0.1s ease-out;
	}

	/* Sizing only; the canvases paint the art. */
	.ascii-stage :global(.ascii-art) {
		visibility: hidden;
		transform: none;
		transition: font-size 0.3s linear;
		will-change: auto;
	}

	canvas {
		position: absolute;
		top: 0;
		height: 100%;
	}
</style>
