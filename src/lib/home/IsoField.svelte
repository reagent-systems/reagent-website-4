<script lang="ts">
	import { onMount } from 'svelte';

	/**
	 * Isometric blocks that rearrange into one scene per story section.
	 * Desktop: a panel beside the text. Phones: a solid panel on the lower
	 * half of the screen, with the text scrolling above it.
	 * `anchors` are the section elements, in order; scene 0 comes before them.
	 */
	let { anchors }: { anchors: HTMLElement[] } = $props();

	// [x, y, z, w, d, h] in grid units. x runs right-down, y left-down, z up.
	type Box = [number, number, number, number, number, number];

	const K = 16;

	function pad(boxes: Box[], at: [number, number, number] = [0, 0, 0]): Box[] {
		const out = boxes.slice(0, K);
		while (out.length < K) out.push([at[0], at[1], at[2], 0, 0, 0]);
		return out;
	}

	// Seeded random so every visit builds the same scenes.
	let seed = 11;
	const rand = () => {
		seed = (seed * 16807) % 2147483647;
		return (seed - 1) / 2147483646;
	};

	const cube = (x: number, y: number, z: number, s = 1): Box => [x, y, z, s, s, s];

	// Loose blocks, before anything is built.
	const scatter = pad(
		Array.from({ length: K }, () =>
			cube(rand() * 6 - 3.5, rand() * 6 - 3.5, rand() * 3, 0.45 + rand() * 0.3)
		)
	);

	// Build what builders need: every block gathered into one place.
	const gathered = pad(
		Array.from({ length: K }, (_, i) => {
			const layer = Math.floor(i / 4);
			const k = i % 4;
			return cube(-1 + (k % 2), -1 + Math.floor(k / 2), layer);
		})
	);

	// A conversation: two pillars and the bridge between them.
	const conversation = pad(
		[
			cube(-2.6, -0.5, 0),
			cube(-2.6, -0.5, 1),
			cube(-2.6, -0.5, 2),
			cube(1.6, -0.5, 0),
			cube(1.6, -0.5, 1),
			cube(1.6, -0.5, 2),
			[-1.6, -0.5, 2.6, 1, 1, 0.22],
			[-0.5, -0.5, 2.6, 1, 1, 0.22],
			[0.6, -0.5, 2.6, 1, 1, 0.22]
		],
		[-0.5, -0.5, 2.7]
	);

	// No equity, no cut: one whole block.
	const whole = pad([[-1.6, -1.6, 0, 3.2, 3.2, 3.2]], [0, 0, 1.6]);

	// Pay it forward: steps, each one lifting the next.
	const steps = pad(
		Array.from({ length: 6 }, (_, i): Box => [2.2 - i * 1.05, -0.8, 0, 1.05, 1.6, 0.55 * (i + 1)]),
		[0, 0, 1]
	);

	// A modern Bell Labs: a campus around one tall centre, six buildings.
	const campus = pad(
		[
			[-3.4, -3.4, 0, 6.8, 6.8, 0.12],
			[-0.6, -0.6, 0.12, 1.2, 1.2, 4.2],
			...Array.from({ length: 6 }, (_, i): Box => {
				const a = (i / 6) * Math.PI * 2;
				const heights = [1.6, 2.4, 1.2, 2, 1.4, 2.8];
				return [Math.cos(a) * 2.3 - 0.45, Math.sin(a) * 2.3 - 0.45, 0.12, 0.9, 0.9, heights[i]];
			})
		],
		[0, 0, 0.5]
	);

	// Research: a crystal lattice.
	const lattice = pad(
		(() => {
			const out: Box[] = [];
			for (let z = 0; z < 2; z++)
				for (let y = 0; y < 2; y++)
					for (let x = 0; x < 2; x++) out.push(cube(-1.75 + x * 2.2, -1.75 + y * 2.2, z * 2.2, 1.3));
			const r = 0.18;
			// Struts between the cubes.
			out.push([-1.1 - r / 2 + 0.65, -1.1, 0.55, 0.9 + r, r, r]);
			out.push([-1.1, -1.1 + 0.65 - r / 2, 0.55, r, 0.9 + r, r]);
			out.push([-1.1, -1.1, 1.3, r, r, 0.9]);
			out.push([1.1 - 0.3, 1.1 - 0.3, 1.3, r, r, 0.9]);
			return out;
		})(),
		[0, 0, 1.5]
	);

	// Writing: a stack of pages.
	const pages = pad(
		Array.from({ length: 7 }, (_, i): Box => {
			const shift = [0, 0.25, -0.15, 0.3, 0.05, -0.2, 0.15][i];
			return [-1.7 + shift, -1.2 - shift * 0.6, i * 0.32, 3.4, 2.4, 0.24];
		}),
		[0, 0, 1]
	);

	// Portal: a gate.
	const gate = pad(
		[
			[-3, -2.2, 0, 6, 4.4, 0.15],
			[-2, -0.45, 0.15, 0.9, 0.9, 4],
			[1.1, -0.45, 0.15, 0.9, 0.9, 4],
			[-2.2, -0.55, 4.15, 4.4, 1.1, 0.75]
		],
		[0, 0, 2]
	);

	// Join: a courtyard with a way in.
	const courtyard = pad(
		[
			[-3, -3, 0, 6, 6, 0.12],
			[-2.6, -2.6, 0.12, 5.2, 0.8, 1],
			[-2.6, -1.8, 0.12, 0.8, 4.4, 1],
			[1.8, -1.8, 0.12, 0.8, 1.6, 1],
			[1.8, 0.6, 0.12, 0.8, 2, 1],
			[-1.8, 1.8, 0.12, 4.4, 0.8, 1],
			[-0.35, -0.35, 0.12, 0.7, 0.7, 0.7]
		],
		[0, 0, 0.5]
	);

	// Quote: one block.
	const single = pad([cube(-0.5, -0.5, 0)], [0, 0, 0.5]);

	const scenes: Box[][] = [
		scatter,
		gathered, // mission
		conversation, // first, we get the founder on a call
		whole, // terms: no equity, no cut
		steps, // why: founders helping founders
		campus, // decades ahead, a modern bell labs
		lattice,
		pages,
		gate,
		courtyard,
		single
	];

	let svgEl: SVGSVGElement | undefined = $state();
	let panelEl: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!svgEl || !panelEl) return;
		const svg = svgEl;
		const ns = 'http://www.w3.org/2000/svg';

		type Faces = { g: SVGGElement; top: SVGPolygonElement; px: SVGPolygonElement; py: SVGPolygonElement };
		const faces: Faces[] = [];
		for (let i = 0; i < K; i++) {
			const g = document.createElementNS(ns, 'g');
			const mk = (fill: string) => {
				const p = document.createElementNS(ns, 'polygon');
				p.setAttribute('fill', fill);
				p.setAttribute('stroke', '#1a1a1a');
				p.setAttribute('stroke-width', '0.9');
				p.setAttribute('stroke-linejoin', 'round');
				g.append(p);
				return p;
			};
			faces.push({ g, top: mk('#fdfdfd'), px: mk('#e6e6e6'), py: mk('#d2d2d2') });
			svg.append(g);
		}

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const cur: Box[] = scenes[0].map((b) => [...b] as Box);
		let alpha = 0;
		let frame = 0;
		let pw = 0;
		let ph = 0;

		function resize() {
			const r = svg.getBoundingClientRect();
			pw = r.width;
			ph = r.height;
			svg.setAttribute('viewBox', `0 0 ${pw} ${ph}`);
		}
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(svg);

		const smooth = (t: number) => t * t * (3 - 2 * t);

		function progress(): { i: number; t: number; fade: number } {
			const vh = window.innerHeight;
			const mobile = window.innerWidth <= 768;
			// The reading line: middle of the screen, or of the top half on phones.
			const y = window.scrollY + vh * (mobile ? 0.25 : 0.5);
			const mids = anchors.map((el) => {
				const r = el.getBoundingClientRect();
				return r.top + window.scrollY + r.height / 2;
			});
			if (!mids.length) return { i: 0, t: 0, fade: 0 };
			const marks = [mids[0] - vh * 0.8, ...mids];
			if (y <= marks[0]) return { i: 0, t: 0, fade: 1 };
			const last = marks.length - 1;
			if (y >= marks[last]) return { i: last, t: 0, fade: 1 };
			let i = 0;
			while (i < last && y >= marks[i + 1]) i++;
			const raw = (y - marks[i]) / (marks[i + 1] - marks[i]);
			return { i, t: smooth(Math.min(1, Math.max(0, (raw - 0.3) / 0.4))), fade: 1 };
		}

		const C = Math.cos(Math.PI / 6);
		const S = 0.5;

		function tick(now: number) {
			const { i, t, fade } = progress();
			const a = scenes[Math.min(i, scenes.length - 1)];
			const b = scenes[Math.min(i + 1, scenes.length - 1)];
			const k = 0.1;
			const time = now * 0.001;

			for (let n = 0; n < K; n++) {
				for (let m = 0; m < 6; m++) {
					let target = a[n][m] + (b[n][m] - a[n][m]) * t;
					// Loose blocks drift a little before the story starts.
					if (m === 2 && i === 0 && !reduceMotion) target += Math.sin(time * 0.8 + n) * 0.12 * (1 - t);
					cur[n][m] += (target - cur[n][m]) * k;
				}
			}
			alpha += (fade - alpha) * k;
			svg.style.opacity = alpha.toFixed(3);

			// Fit roughly 12 grid units across the smaller side of the panel.
			const u = Math.min(pw, ph * 1.05) / 12;
			const ox = pw / 2;
			const oy = ph / 2 + 2.2 * u;
			const P = (x: number, y: number, z: number) =>
				`${(ox + (x - y) * C * u).toFixed(1)},${(oy + (x + y) * S * u - z * u).toFixed(1)}`;

			const order = cur
				.map((bx, idx) => ({ idx, key: bx[0] + bx[3] / 2 + bx[1] + bx[4] / 2 + bx[2] + bx[5] / 2 }))
				.sort((p, q) => p.key - q.key);

			for (const { idx } of order) {
				const [x, y, z, w, d, h] = cur[idx];
				const f = faces[idx];
				svg.append(f.g); // keeps paint order back to front
				if (w < 0.03 || d < 0.03 || h < 0.03) {
					f.g.style.display = 'none';
					continue;
				}
				f.g.style.display = '';
				f.top.setAttribute('points', [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)].join(' '));
				f.px.setAttribute('points', [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)].join(' '));
				f.py.setAttribute('points', [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)].join(' '));
			}

			frame = requestAnimationFrame(tick);
		}
		frame = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frame);
			ro.disconnect();
		};
	});
</script>

<div class="stage" aria-hidden="true">
	<div class="panel" bind:this={panelEl}>
		<svg bind:this={svgEl} class="iso"></svg>
	</div>
</div>

<style>
	.stage {
		position: sticky;
		top: 0;
		height: 100vh;
		height: 100svh;
		margin-bottom: -100vh;
		margin-bottom: -100svh;
		pointer-events: none;
		z-index: 2;
	}

	/* Desktop: beside the text, on the right. */
	.panel {
		position: absolute;
		top: 0;
		right: 0;
		width: 44vw;
		height: 100%;
	}

	.iso {
		width: 100%;
		height: 100%;
		display: block;
		opacity: 0;
	}

	/* Phones: a solid lower half; text scrolls in the top half and passes behind it. */
	@media (max-width: 768px) {
		/* Sized to the tallest the screen gets, so nothing shows beneath the
		   panel when the browser bar slides away. */
		.stage {
			height: 100lvh;
			margin-bottom: -100lvh;
		}

		.panel {
			top: 50vh;
			top: 50svh;
			bottom: 0;
			width: 100%;
			height: auto;
			background: var(--page-background);
		}

		.iso {
			height: 50vh;
			height: 50svh;
		}

		.panel::before {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			bottom: 100%;
			height: 2.5rem;
			background: linear-gradient(to bottom, transparent, var(--page-background));
		}
	}
</style>
