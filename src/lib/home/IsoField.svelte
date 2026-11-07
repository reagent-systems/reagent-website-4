<script lang="ts">
	import { onMount } from 'svelte';
	import { animate } from 'motion';
	import { COMPANIES } from './companies';
	import { ARTICLES, RESEARCH_ITEMS } from './content';

	/**
	 * Isometric scenes that rebuild themselves for each story section.
	 * Desktop: a panel beside the text. Phones: a solid lower half.
	 * In the sections people can act on, the blocks become the things to click:
	 * research images, books, the portal gate, and the six company buildings.
	 */
	let {
		anchors,
		picked = null,
		onpick
	}: {
		anchors: HTMLElement[];
		picked?: string | null;
		onpick?: (slug: string) => void;
	} = $props();

	type Box = { x: number; y: number; z: number; w: number; d: number; h: number; win: number; tone: number };
	type Tuple = [number, number, number, number, number, number, number?, number?];

	type Overlay =
		| { kind: 'image'; box: number; src: string; label: string; href: string }
		| { kind: 'cover'; box: number; title: string; href: string }
		| { kind: 'gate'; box: number; href: string }
		| { kind: 'company'; box: number; slug: string; name: string };

	type Scene = {
		boxes: Box[];
		float?: number;
		overlays?: Overlay[];
		actors?: (t: number) => Tuple[];
	};

	const K = 24;
	const toBox = ([x, y, z, w, d, h, win = 0, tone = 0]: Tuple): Box => ({ x, y, z, w, d, h, win, tone });

	function pad(list: Tuple[], at: [number, number, number] = [0, 0, 0]): Box[] {
		const out = list.slice(0, K).map(toBox);
		while (out.length < K) out.push(toBox([at[0], at[1], at[2], 0, 0, 0]));
		return out;
	}

	let seed = 11;
	const rand = () => {
		seed = (seed * 16807) % 2147483647;
		return (seed - 1) / 2147483646;
	};

	const cube = (x: number, y: number, z: number, s = 1, win = 0, tone = 0): Tuple => [x, y, z, s, s, s, win, tone];

	// --- Scenes, in story order -------------------------------------------

	const scatter: Scene = {
		boxes: pad(
			Array.from({ length: 16 }, () =>
				cube(rand() * 6 - 3.5, rand() * 6 - 3.5, rand() * 3, 0.45 + rand() * 0.3)
			)
		),
		float: 0.18
	};

	// Mission: every block gathered into one place.
	const gathered: Scene = {
		boxes: pad(
			Array.from({ length: 16 }, (_, i) => {
				const layer = Math.floor(i / 4);
				const k = i % 4;
				return cube(-1 + (k % 2), -1 + Math.floor(k / 2), layer, 1, 0, i === 13 ? 0.85 : 0);
			})
		),
		float: 0.05
	};

	// First, we talk with the founder: two pillars and a bridge, with traffic across it.
	const conversation: Scene = {
		boxes: pad(
			[
				[-3.4, -2.2, 0, 6.6, 4.4, 0.12],
				cube(-2.6, -0.5, 0.12),
				cube(-2.6, -0.5, 1.12),
				cube(-2.6, -0.5, 2.12),
				cube(1.6, -0.5, 0.12),
				cube(1.6, -0.5, 1.12),
				cube(1.6, -0.5, 2.12, 1, 0, 0.85),
				[-1.6, -0.5, 2.72, 1.05, 1, 0.2],
				[-0.55, -0.5, 2.72, 1.1, 1, 0.2],
				[0.55, -0.5, 2.72, 1.05, 1, 0.2]
			],
			[-0.5, -0.5, 2.7]
		),
		actors: (t) => {
			const f = (Math.sin(t * 1.1) + 1) / 2;
			const g = (Math.sin(t * 1.1 + Math.PI) + 1) / 2;
			return [
				cube(-1.5 + f * 2.75, -0.35, 2.92, 0.3, 0, 0.85),
				cube(-1.5 + g * 2.75, 0.05, 2.92, 0.3)
			];
		}
	};

	// Terms: one whole, uncut block.
	const whole: Scene = {
		boxes: pad([[-1.6, -1.6, 0, 3.2, 3.2, 3.2, 0, 0]], [0, 0, 1.6]),
		float: 0.06
	};

	// Why: steps, and a small block climbing them, one after another.
	const stepTop = (i: number) => 0.55 * (i + 1);
	const stepX = (i: number) => 2.2 - i * 1.05;
	const steps: Scene = {
		boxes: pad(
			Array.from({ length: 6 }, (_, i): Tuple => [stepX(i), -0.8, 0, 1.05, 1.6, stepTop(i)]),
			[0, 0, 1]
		),
		actors: (t) => {
			const phase = (t * 0.85) % 6.6;
			const i = Math.min(5, Math.floor(phase));
			const f = Math.min(1, phase - i);
			const j = Math.min(5, i + 1);
			const x = stepX(i) + 0.33 + (stepX(j) - stepX(i)) * f;
			const z = stepTop(i) + (stepTop(j) - stepTop(i)) * f + Math.sin(f * Math.PI) * (i === j ? 0 : 0.55);
			const s = phase > 6 ? Math.max(0, 0.38 * (1 - (phase - 6) / 0.6)) : 0.38;
			return [cube(x, -0.2, z, s, 0, 0.85)];
		}
	};

	// Decades ahead, a modern Bell Labs: a campus with lights on.
	const campusHeights = [1.6, 2.4, 1.2, 2, 1.4, 2.8];
	const campus: Scene = {
		boxes: pad(
			[
				[-3.6, -3.6, 0, 7.2, 7.2, 0.12],
				[-0.65, -0.65, 0.12, 1.3, 1.3, 4.2, 1],
				[-0.06, -0.06, 4.32, 0.12, 0.12, 0.9],
				...Array.from({ length: 6 }, (_, i): Tuple => {
					const a = (i / 6) * Math.PI * 2;
					return [Math.cos(a) * 2.4 - 0.5, Math.sin(a) * 2.4 - 0.5, 0.12, 1, 1, campusHeights[i], 1];
				})
			],
			[0, 0, 0.5]
		),
		actors: (t) => {
			const blink = Math.sin(t * 3) > 0.2 ? 0.22 : 0;
			return [cube(-0.11, -0.11, 5.22, blink, 0, 1)];
		}
	};

	// Research: the four studies, laid out as tiles.
	const research: Scene = {
		boxes: pad(
			[
				[-2.8, -2.8, 0, 2.5, 2.5, 0.32],
				[0.1, -2.8, 0, 2.5, 2.5, 0.32],
				[-2.8, 0.1, 0, 2.5, 2.5, 0.32],
				[0.1, 0.1, 0, 2.5, 2.5, 0.32]
			],
			[0, 0, 0.2]
		),
		overlays: RESEARCH_ITEMS.map((r, i) => ({
			kind: 'image' as const,
			box: i,
			src: r.image,
			label: r.name,
			href: '/research'
		}))
	};

	// Writing: three books.
	const books: Scene = {
		boxes: pad(
			ARTICLES.map((_, i): Tuple => [-3.3 + i * 2.25, -1.5, 0, 1.95, 2.8, 0.42]),
			[0, 0, 0.2]
		),
		overlays: ARTICLES.map((a, i) => ({ kind: 'cover' as const, box: i, title: a.title, href: a.href }))
	};

	// Portal: a gate, with light passing through.
	const gate: Scene = {
		boxes: pad(
			[
				[-3, -2.4, 0, 6, 4.8, 0.15],
				[-2, -0.45, 0.15, 0.9, 0.9, 4],
				[1.1, -0.45, 0.15, 0.9, 0.9, 4],
				[-2.2, -0.55, 4.15, 4.4, 1.1, 0.75, 0, 0.85]
			],
			[0, 0, 2]
		),
		overlays: [{ kind: 'gate', box: 3, href: '/portal' }],
		actors: (t) =>
			Array.from({ length: 4 }, (_, k) => {
				const f = (t * 0.35 + k / 4) % 1;
				const s = 0.26 * Math.sin(f * Math.PI);
				return cube(-0.5 + (k % 2) * 0.5, -2.2 + f * 4.2, 0.3 + (k % 3) * 0.9 + f * 0.4, s, 0, k % 2 ? 0.85 : 0);
			})
	};

	// Join: the six companies, each one a building to pick. Two rows, the taller
	// row behind, so every rooftop name stays visible.
	const joinSpots: [number, number, number][] = [
		[-2.6, -2.6, 2.6],
		[-0.4, -2.6, 3],
		[1.8, -2.6, 2.3],
		[-2.6, -0.2, 1.2],
		[-0.4, -0.2, 1.5],
		[1.8, -0.2, 1]
	];
	const join: Scene = {
		boxes: pad(
			[
				[-3.3, -3.3, 0, 6.6, 4.6, 0.12],
				...COMPANIES.map((_, i): Tuple => {
					const [x, y, h] = joinSpots[i];
					return [x, y, 0.12, 1.5, 1.6, h, 1];
				})
			],
			[0, 0, 0.5]
		),
		overlays: COMPANIES.map((c, i) => ({ kind: 'company' as const, box: i + 1, slug: c.slug, name: c.name }))
	};

	// Quote: one block, and a small one circling it fast.
	const single: Scene = {
		boxes: pad([cube(-0.5, -0.5, 0)], [0, 0, 0.5]),
		actors: (t) => [cube(Math.cos(t * 2.2) * 1.3 - 0.13, Math.sin(t * 2.2) * 1.3 - 0.13, 0.35, 0.26, 0, 0.85)]
	};

	const scenes: Scene[] = [
		scatter,
		gathered, // mission
		conversation, // first, we talk with the founder
		whole, // terms
		steps, // why: founders helping founders
		campus, // decades ahead
		research,
		books, // writing
		gate, // portal
		join,
		single // quote
	];

	// --- State shared with the template ------------------------------------

	let svgEl: SVGSVGElement | undefined = $state();
	let layerEl: HTMLDivElement | undefined = $state();
	let active = $state(0);
	let settled = $state(false);
	let hovered = $state(-1);

	const overlays = $derived(scenes[active].overlays ?? []);
	let overlayTop: (HTMLElement | undefined)[] = $state([]);
	let overlayFront: (HTMLElement | undefined)[] = $state([]);

	onMount(() => {
		if (!svgEl || !layerEl) return;
		const svg = svgEl;
		const layer = layerEl;
		const ns = 'http://www.w3.org/2000/svg';
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const C = Math.cos(Math.PI / 6);
		const S = 0.5;

		// A reusable pool of polygons, written in paint order each frame.
		const pool: SVGPolygonElement[] = [];
		let used = 0;
		function poly(points: string, fill: string, opacity = 1, stroke = true) {
			let p = pool[used];
			if (!p) {
				p = document.createElementNS(ns, 'polygon');
				p.setAttribute('stroke-linejoin', 'round');
				p.setAttribute('stroke-width', '0.85');
				svg.append(p);
				pool.push(p);
			}
			used++;
			p.setAttribute('points', points);
			p.setAttribute('fill', fill);
			p.setAttribute('fill-opacity', opacity.toFixed(3));
			p.setAttribute('stroke', stroke ? '#1a1a1a' : 'none');
			p.style.display = '';
		}

		const cur: Box[] = scenes[0].boxes.map((b) => ({ ...b }));

		// Each scene's extent in projected grid units, so it can be framed to fill the panel.
		const frames = scenes.map((sc) => {
			let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
			for (const b of sc.boxes) {
				if (b.w < 0.02 || b.d < 0.02 || b.h < 0.02) continue;
				for (const [x, y] of [[b.x, b.y], [b.x + b.w, b.y], [b.x, b.y + b.d], [b.x + b.w, b.y + b.d]])
					for (const z of [b.z, b.z + b.h]) {
						const X = (x - y) * C;
						const Y = (x + y) * S - z;
						x0 = Math.min(x0, X); x1 = Math.max(x1, X);
						y0 = Math.min(y0, Y); y1 = Math.max(y1, Y);
					}
			}
			return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
		});
		const view = { u: 0, cx: frames[0].cx, cy: frames[0].cy };
		const lift = new Array(K).fill(0);
		let controls: { stop: () => void }[] = [];
		let pw = 0;
		let ph = 0;
		let alpha = 0;
		let frame = 0;
		let settleTimer: ReturnType<typeof setTimeout> | undefined;

		function resize() {
			const r = svg.getBoundingClientRect();
			pw = r.width;
			ph = r.height;
			svg.setAttribute('viewBox', `0 0 ${pw} ${ph}`);
		}
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(svg);

		// Blocks spring into the next scene, lowest first, so it builds upward.
		function goTo(index: number) {
			controls.forEach((c) => c.stop());
			settled = false;
			clearTimeout(settleTimer);
			const target = scenes[index].boxes;
			controls = target.map((b, n) =>
				animate(cur[n], { ...b }, {
					type: 'spring',
					stiffness: 140,
					damping: 19,
					mass: 0.9,
					delay: reduceMotion ? 0 : Math.min(0.5, b.z * 0.06 + n * 0.012)
				})
			);
			settleTimer = setTimeout(() => (settled = true), reduceMotion ? 0 : 750);
		}

		function sectionIndex(): number {
			const vh = window.innerHeight;
			const mobile = window.innerWidth <= 768;
			const line = vh * (mobile ? 0.25 : 0.5);
			let idx = 0;
			anchors.forEach((el, i) => {
				if (el.getBoundingClientRect().top <= line) idx = i + 1;
			});
			return Math.min(idx, scenes.length - 1);
		}

		const shade = (light: number, dark: number, t: number) => {
			const v = Math.round(light + (dark - light) * t);
			return `rgb(${v},${v},${v})`;
		};

		function tick(now: number) {
			const idx = sectionIndex();
			if (idx !== active) {
				active = idx;
				goTo(idx);
			}

			const story = anchors[0]?.parentElement?.getBoundingClientRect();
			const visible = story ? story.top < window.innerHeight && story.bottom > 0 : false;
			alpha += ((visible ? 1 : 0) - alpha) * 0.08;
			svg.style.opacity = alpha.toFixed(3);
			layer.style.opacity = alpha.toFixed(3);

			const t = now / 1000;
			const scene = scenes[active];
			// Frame the scene: fill most of the panel, but keep small scenes modest.
			const fr = frames[active];
			const targetU = Math.min((pw * 0.9) / Math.max(fr.w, 1), (ph * 0.72) / Math.max(fr.h, 1), Math.min(pw, ph) / 8);
			const ease = view.u === 0 ? 1 : 0.07;
			view.u += (targetU - view.u) * ease;
			view.cx += (fr.cx - view.cx) * ease;
			view.cy += (fr.cy - view.cy) * ease;
			const u = view.u;
			const ox = pw / 2 - view.cx * u;
			const oy = ph / 2 - view.cy * u;
			const pt = (x: number, y: number, z: number): [number, number] => [
				ox + (x - y) * C * u,
				oy + (x + y) * S * u - z * u
			];
			const P = (x: number, y: number, z: number) => {
				const [a, b] = pt(x, y, z);
				return `${a.toFixed(1)},${b.toFixed(1)}`;
			};

			// Hover raises a block a little.
			for (let n = 0; n < K; n++) lift[n] += ((hovered === n ? 0.35 : 0) - lift[n]) * 0.15;

			const float = reduceMotion ? 0 : (scene.float ?? 0);
			const drawn: Box[] = cur.map((b, n) => ({
				...b,
				z: b.z + lift[n] + Math.sin(t * 1.3 + n * 0.55) * float
			}));
			const actors = reduceMotion ? [] : (scene.actors?.(t) ?? []).map(toBox);
			const all = [...drawn.map((b, n) => ({ b, n })), ...actors.map((b) => ({ b, n: -1 }))].filter(
				({ b }) => b.w > 0.02 && b.d > 0.02 && b.h > 0.02
			);

			used = 0;

			// Soft shadows on the ground, cast toward the lower right.
			for (const { b } of all) {
				if (b.z > 0.5) continue;
				const s = Math.min(1.6, b.h * 0.45);
				const g = b.z + 0.001;
				poly(
					[
						P(b.x + b.w, b.y, g),
						P(b.x + b.w + s, b.y + s * 0.15, g),
						P(b.x + b.w + s, b.y + b.d + s * 0.15, g),
						P(b.x + b.w, b.y + b.d, g)
					].join(' '),
					'#1a1a1a',
					0.06,
					false
				);
			}

			const depth = (b: Box) => b.x + b.w / 2 + b.y + b.d / 2 + b.z;
			all.sort((p, q) => depth(p.b) - depth(q.b));

			const isJoin = scene === join;
			for (const { b, n } of all) {
				const { x, y, z, w, d, h } = b;
				const pickedHere = isJoin && n > 0 && COMPANIES[n - 1]?.slug === picked;
				const tt = Math.min(1, b.tone + (pickedHere ? 0.85 : 0));
				poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)].join(' '), shade(253, 58, tt));
				poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)].join(' '), shade(232, 40, tt));
				poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)].join(' '), shade(211, 30, tt));

				// Windows, a few of them lit and changing slowly.
				if (b.win > 0.05 && h > 0.9) {
					const lit = (k: number) => Math.sin(t * 0.7 + k * 12.9898) > 0.55;
					let k = n * 97;
					for (let zz = z + 0.35; zz + 0.3 < z + h - 0.15; zz += 0.5) {
						for (let yy = y + 0.18; yy + 0.2 < y + d - 0.08; yy += 0.4) {
							const on = lit(k++);
							poly(
								[P(x + w, yy, zz), P(x + w, yy + 0.2, zz), P(x + w, yy + 0.2, zz + 0.28), P(x + w, yy, zz + 0.28)].join(' '),
								on ? '#fafafa' : '#1a1a1a',
								b.win * (on ? 1 : 0.45),
								false
							);
						}
						for (let xx = x + 0.18; xx + 0.2 < x + w - 0.08; xx += 0.4) {
							const on = lit(k++);
							poly(
								[P(xx, y + d, zz), P(xx + 0.2, y + d, zz), P(xx + 0.2, y + d, zz + 0.28), P(xx, y + d, zz + 0.28)].join(' '),
								on ? '#fafafa' : '#1a1a1a',
								b.win * (on ? 1 : 0.5),
								false
							);
						}
					}
				}
			}
			for (let i = used; i < pool.length; i++) pool[i].style.display = 'none';

			// Pin the clickable layer onto the block faces (40px per grid unit).
			const px = u / 40;
			overlays.forEach((o, i) => {
				const b = drawn[o.box];
				if (!b) return;
				const top = overlayTop[i];
				if (top) {
					const [ex, ey] = pt(b.x, b.y, b.z + b.h);
					top.style.width = `${b.w * 40}px`;
					top.style.height = `${b.d * 40}px`;
					top.style.transform = `matrix(${C * px},${S * px},${-C * px},${S * px},${ex},${ey})`;
				}
				const front = overlayFront[i];
				if (front) {
					const [ex, ey] = pt(b.x, b.y + b.d, b.z + b.h);
					front.style.width = `${b.w * 40}px`;
					front.style.height = `${b.h * 40}px`;
					front.style.transform = `matrix(${C * px},${S * px},0,${px},${ex},${ey})`;
				}
			});

			frame = requestAnimationFrame(tick);
		}
		frame = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frame);
			controls.forEach((c) => c.stop());
			clearTimeout(settleTimer);
			ro.disconnect();
		};
	});
</script>

<div class="stage">
	<div class="panel">
		<svg bind:this={svgEl} class="iso" aria-hidden="true"></svg>
		<div class="layer" class:live={settled} bind:this={layerEl}>
			{#each overlays as o, i (active + '-' + i)}
				{#if o.kind === 'image'}
					<a
						class="face top image"
						href={o.href}
						bind:this={overlayTop[i]}
						onmouseenter={() => (hovered = o.box)}
						onmouseleave={() => (hovered = -1)}
						aria-label={o.label}
					>
						<img src={o.src} alt="" loading="lazy" />
					</a>
					<span class="face front label" bind:this={overlayFront[i]} aria-hidden="true">{o.label}</span>
				{:else if o.kind === 'cover'}
					<a
						class="face top cover"
						href={o.href}
						bind:this={overlayTop[i]}
						onmouseenter={() => (hovered = o.box)}
						onmouseleave={() => (hovered = -1)}
					>
						<span class="cover-title">{o.title}</span>
						<span class="cover-mark">reagent</span>
					</a>
				{:else if o.kind === 'gate'}
					<a
						class="face front gate"
						href={o.href}
						bind:this={overlayFront[i]}
						onmouseenter={() => (hovered = o.box)}
						onmouseleave={() => (hovered = -1)}>enter</a
					>
				{:else if o.kind === 'company'}
					<button
						type="button"
						class="face top company"
						class:picked={picked === o.slug}
						bind:this={overlayTop[i]}
						onmouseenter={() => (hovered = o.box)}
						onmouseleave={() => (hovered = -1)}
						onclick={() => onpick?.(o.slug)}
						aria-pressed={picked === o.slug}
						aria-label="talk to reagent {o.name}"><span>{o.name}</span></button
					>
				{/if}
			{/each}
		</div>
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
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
		opacity: 0;
	}

	/* Same origin as the drawing, so faces line up. */
	.layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	.face {
		position: absolute;
		top: 0;
		left: 0;
		transform-origin: 0 0;
		opacity: 0;
		transition: opacity 0.5s ease;
		pointer-events: none;
	}

	.layer.live .face {
		opacity: 1;
		pointer-events: auto;
	}

	.image {
		display: block;
		border-radius: 6px;
		overflow: hidden;
	}

	.image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.label {
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 400;
		font-size: 7px;
		letter-spacing: 0.08em;
		color: #3a3a3a;
		white-space: nowrap;
	}

	.cover {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 9px 9px 7px;
		background: #fdfdfd;
		text-decoration: none;
	}

	.cover-title {
		font-family: var(--main-font);
		font-weight: 300;
		font-size: 11px;
		line-height: 1.15;
		color: #1a1a1a;
	}

	.cover-mark {
		font-family: var(--ascii-font);
		font-size: 4.5px;
		letter-spacing: 0.3em;
		color: #6b6b6b;
	}

	.gate {
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Raleway Variable', var(--main-font);
		font-size: 9px;
		letter-spacing: 0.35em;
		color: #fafafa;
		text-decoration: none;
	}

	.company {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
		font-family: 'Raleway Variable', var(--main-font);
		font-size: 7.5px;
		letter-spacing: 0.06em;
		color: #3a3a3a;
	}

	.company.picked {
		color: #fafafa;
	}

	.company:focus-visible,
	.image:focus-visible,
	.cover:focus-visible,
	.gate:focus-visible {
		outline: 1px solid #1a1a1a;
		outline-offset: 1px;
	}

	/* Phones: a solid lower half, sized to the tallest the screen gets so
	   nothing shows beneath it when the browser bar slides away. */
	@media (max-width: 768px) {
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

		.panel::before {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			bottom: 100%;
			height: 2.5rem;
			background: linear-gradient(to bottom, transparent, var(--page-background));
		}

		.iso,
		.layer {
			height: 50vh;
			height: 50svh;
		}
	}
</style>
