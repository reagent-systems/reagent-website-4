<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { animate } from 'motion';

	/**
	 * Isometric scenes.
	 * Sticky mode: follows the story (mission, how, why), rebuilding itself for each
	 * section; beside the text on desktop, a band across the top on phones.
	 * Inline mode: draws the portal in place and builds it up when it comes into view.
	 */
	let {
		anchors = [],
		inline = false,
		portalTag = null
	}: {
		anchors?: HTMLElement[];
		inline?: boolean;
		/** Live status shown on a tag, led off the portal ring. */
		portalTag?: { title: string; detail?: string } | null;
	} = $props();

	type Box = { x: number; y: number; z: number; w: number; d: number; h: number; win: number; tone: number };
	type Tuple = [number, number, number, number, number, number, number?, number?];

	type Overlay =
		| { kind: 'gate'; box: number; href: string }
		| { kind: 'portal'; box: number; href: string; live: string; poster: string };

	type Scene = {
		boxes: Box[];
		float?: number;
		overlays?: Overlay[];
		actors?: (t: number) => Tuple[];
		/** Extra extent for framing, for things drawn outside the boxes. */
		bounds?: Tuple[];
		/** Set for the portal scene: draws the ring and its surface. */
		portal?: { zc: number; R: number; ring: number; depth: number };
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

	// Portal: a standing ring on a dark plinth. Through it, a live view of where it leads.
	const SPARK = 'https://spark.reagent-systems.com';
	const PORTAL = { zc: 2.65, R: 2, ring: 0.36, depth: 0.42 };
	const gate: Scene = {
		boxes: pad(
			[
				[-2.7, -1.15, 0, 5.4, 2.3, 0.55, 0, 0.85]
			],
			[0, 0, 0.3]
		),
		// The extra height above the ring leaves room for the status tag.
		bounds: [[-PORTAL.R, -0.3, 0, PORTAL.R * 2, 0.6, PORTAL.zc + PORTAL.R + 1.9]],
		portal: PORTAL,
		overlays: [
			{
				kind: 'portal',
				box: 0,
				href: SPARK,
				live: SPARK,
				poster: '/portal/spark-preview.jpg'
			},
			{ kind: 'gate', box: 0, href: SPARK }
		]
	};

	// Inline mode starts with the portal folded flat, then builds it.
	const folded: Scene = {
		...gate,
		boxes: gate.boxes.map((b) => ({ ...b, z: 0, h: 0 })),
		overlays: []
	};

	const scenes: Scene[] = untrack(() => inline)
		? [folded, gate]
		: [
				scatter,
				gathered, // mission
				conversation, // first, we talk with the founder
				whole, // terms
				steps, // why: founders helping founders
				campus // decades ahead
			];

	// --- State shared with the template ------------------------------------

	let svgEl: SVGSVGElement | undefined = $state();
	let layerEl: HTMLDivElement | undefined = $state();
	let active = $state(0);
	let settled = $state(false);
	let hovered = $state(-1);
	let tagEl: HTMLDivElement | undefined = $state();
	let panelEl: HTMLDivElement | undefined = $state();

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

		// The portal's glow, in the brand's two colours.
		svg.innerHTML = `<defs>
			<radialGradient id="portal-glow" cx="50%" cy="50%" r="55%">
				<stop offset="0%" stop-color="#fafafa" stop-opacity="1"/>
				<stop offset="35%" stop-color="#9aa9cf" stop-opacity="0.9"/>
				<stop offset="75%" stop-color="#2d4a8a" stop-opacity="0.95"/>
				<stop offset="100%" stop-color="#800020" stop-opacity="1"/>
			</radialGradient>
		</defs>`;

		// A reusable pool of paths, written in paint order each frame.
		const pool: SVGPathElement[] = [];
		let used = 0;
		type Style = {
			fill?: string;
			fillOpacity?: number;
			stroke?: string;
			strokeOpacity?: number;
			strokeWidth?: number;
			evenodd?: boolean;
		};
		function shape(d: string, st: Style) {
			let p = pool[used];
			if (!p) {
				p = document.createElementNS(ns, 'path');
				p.setAttribute('stroke-linejoin', 'round');
				p.setAttribute('stroke-linecap', 'round');
				svg.append(p);
				pool.push(p);
			}
			used++;
			p.setAttribute('d', d);
			p.setAttribute('fill', st.fill ?? 'none');
			p.setAttribute('fill-opacity', (st.fillOpacity ?? 1).toFixed(3));
			p.setAttribute('fill-rule', st.evenodd ? 'evenodd' : 'nonzero');
			p.setAttribute('stroke', st.stroke ?? 'none');
			p.setAttribute('stroke-opacity', (st.strokeOpacity ?? 1).toFixed(3));
			p.setAttribute('stroke-width', (st.strokeWidth ?? 0.85).toFixed(2));
			p.style.display = '';
		}
		const closed = (pts: string[]) => `M${pts.join('L')}Z`;
		const open = (pts: string[]) => `M${pts.join('L')}`;

		const cur: Box[] = scenes[0].boxes.map((b) => ({ ...b }));

		// Each scene's extent in projected grid units, so it can be framed to fill the panel.
		const frames = scenes.map((sc) => {
			let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
			for (const b of [...sc.boxes, ...(sc.bounds ?? []).map(toBox)]) {
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
		// The folded portal is framed like the built one, so the camera stays put.
		if (untrack(() => inline)) frames[0] = frames[frames.length - 1];
		const view = { u: 0, cx: frames[0].cx, cy: frames[0].cy };
		const grow = { k: 0 };
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
			const ring = scenes[index].portal && scenes[index].boxes.some((b) => b.h > 0) ? 1 : 0;
			controls.push(
				animate(grow, { k: ring }, { type: 'spring', stiffness: 90, damping: 15, delay: reduceMotion ? 0 : 0.3 })
			);
			settleTimer = setTimeout(() => (settled = true), reduceMotion ? 0 : ring ? 1200 : 750);
		}

		// Inline mode: build the scene once it is properly in view.
		let revealed = false;
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) revealed = true;
			},
			{ threshold: 0.35 }
		);
		if (untrack(() => inline)) io.observe(svg);

		function sectionIndex(): number {
			const vh = window.innerHeight;
			const mobile = window.innerWidth <= 768;
			// The reading line: the middle of the screen, or of the space below the panel on phones.
			const line = vh * (mobile ? 0.64 : 0.5);
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

		// Projection state for the current frame.
		let u = 1;
		let ox = 0;
		let oy = 0;
		const pt = (x: number, y: number, z: number): [number, number] => [
			ox + (x - y) * C * u,
			oy + (x + y) * S * u - z * u
		];
		const P = (x: number, y: number, z: number) => {
			const [a, b] = pt(x, y, z);
			return `${a.toFixed(1)},${b.toFixed(1)}`;
		};

		// Plan outline of a box with rounded corners, inset by `k`.
		function outline(x: number, y: number, w: number, d: number, r: number, k: number): [number, number][] {
			const out: [number, number][] = [];
			const rr = Math.max(0.001, r - k);
			const corners: [number, number, number][] = [
				[x + w - r, y + r, -Math.PI / 2],
				[x + w - r, y + d - r, 0],
				[x + r, y + d - r, Math.PI / 2],
				[x + r, y + r, Math.PI]
			];
			for (const [cx, cy, a0] of corners)
				for (let s2 = 0; s2 <= 4; s2++) {
					const a = a0 + (s2 / 4) * (Math.PI / 2);
					out.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
				}
			return out;
		}

		// A block with rounded vertical edges and a chamfered top.
		function drawBox(b: Box, tone: number, n: number, t: number) {
			const { x, y, z, w, d, h } = b;
			const r = Math.min(0.2, w * 0.22, d * 0.22);
			const c = Math.min(0.07, h * 0.3, r * 0.6);
			const top = z + h;
			const side = top - c;
			const ring = outline(x, y, w, d, r, 0);
			const cx = x + w / 2;
			const cy = y + d / 2;
			const lightX = 232 + (40 - 232) * tone;
			const lightY = 211 + (30 - 211) * tone;

			// Sides: one strip per edge segment that faces the viewer, shaded by its direction.
			let iMin = 0;
			let iMax = 0;
			for (let i = 0; i < ring.length; i++) {
				const a = ring[i];
				if (a[0] - a[1] < ring[iMin][0] - ring[iMin][1]) iMin = i;
				if (a[0] - a[1] > ring[iMax][0] - ring[iMax][1]) iMax = i;
				const bb = ring[(i + 1) % ring.length];
				let nx = bb[1] - a[1];
				let ny = -(bb[0] - a[0]);
				const mx = (a[0] + bb[0]) / 2 - cx;
				const my = (a[1] + bb[1]) / 2 - cy;
				if (nx * mx + ny * my < 0) {
					nx = -nx;
					ny = -ny;
				}
				if (nx + ny <= 0) continue;
				const px2 = Math.max(0, nx);
				const py2 = Math.max(0, ny);
				const f = px2 / (px2 + py2 || 1);
				const v = Math.round(lightY + (lightX - lightY) * f);
				const col = `rgb(${v},${v},${v})`;
				shape(closed([P(a[0], a[1], z), P(bb[0], bb[1], z), P(bb[0], bb[1], side), P(a[0], a[1], side)]), {
					fill: col,
					stroke: col,
					strokeWidth: 0.6
				});
			}

			// Outline: the bottom curve across the front, and the two outer edges.
			const walk = (from: number, to: number) => {
				const pts: string[] = [];
				let sum = 0;
				for (let i = from; ; i = (i + 1) % ring.length) {
					pts.push(P(ring[i][0], ring[i][1], z));
					sum += ring[i][0] + ring[i][1];
					if (i === to) break;
				}
				return { pts, mean: sum / pts.length };
			};
			const one = walk(iMin, iMax);
			const two = walk(iMax, iMin);
			shape(open((one.mean >= two.mean ? one : two).pts), { stroke: '#1a1a1a' });
			shape(open([P(ring[iMin][0], ring[iMin][1], z), P(ring[iMin][0], ring[iMin][1], side)]), { stroke: '#1a1a1a' });
			shape(open([P(ring[iMax][0], ring[iMax][1], z), P(ring[iMax][0], ring[iMax][1], side)]), { stroke: '#1a1a1a' });

			// Chamfer band, then the top face.
			const bandV = Math.round(244 + (48 - 244) * tone);
			shape(closed(ring.map(([a, bb]) => P(a, bb, side))), { fill: `rgb(${bandV},${bandV},${bandV})`, stroke: '#1a1a1a' });
			const topV = Math.round(253 + (58 - 253) * tone);
			shape(closed(outline(x, y, w, d, r, c).map(([a, bb]) => P(a, bb, top))), {
				fill: `rgb(${topV},${topV},${topV})`,
				stroke: '#1a1a1a',
				strokeOpacity: 0.3,
				strokeWidth: 0.6
			});

			// Windows on the flat stretches of the two front faces, a few of them lit.
			if (b.win > 0.05 && h > 0.9) {
				const lit = (k: number) => Math.sin(t * 0.7 + k * 12.9898) > 0.55;
				let k = n * 97;
				for (let zz = z + 0.35; zz + 0.3 < side - 0.12; zz += 0.5) {
					for (let yy = y + r + 0.06; yy + 0.2 < y + d - r - 0.04; yy += 0.4) {
						const on = lit(k++);
						shape(closed([P(x + w, yy, zz), P(x + w, yy + 0.2, zz), P(x + w, yy + 0.2, zz + 0.28), P(x + w, yy, zz + 0.28)]), {
							fill: on ? '#fafafa' : '#1a1a1a',
							fillOpacity: b.win * (on ? 1 : 0.45)
						});
					}
					for (let xx = x + r + 0.06; xx + 0.2 < x + w - r - 0.04; xx += 0.4) {
						const on = lit(k++);
						shape(closed([P(xx, y + d, zz), P(xx + 0.2, y + d, zz), P(xx + 0.2, y + d, zz + 0.28), P(xx, y + d, zz + 0.28)]), {
							fill: on ? '#fafafa' : '#1a1a1a',
							fillOpacity: b.win * (on ? 1 : 0.5)
						});
					}
				}
			}
		}

		// The portal: a round ring standing upright, its surface drawing light inward.
		function drawPortal(pd: { zc: number; R: number; ring: number; depth: number }, t: number) {
			const k = grow.k;
			if (k < 0.02) return;
			// Rises out of the plinth as it grows.
			const R = pd.R * k;
			const ring = pd.ring * k;
			const depth = pd.depth;
			const zc = 0.55 + (pd.zc - 0.55) * k;
			const Ri = R - ring;
			const yf = depth / 2;
			const yb = -depth / 2;
			const N = 72;
			const circ = (r: number, yy: number) =>
				Array.from({ length: N }, (_, i) => {
					const a = (i / N) * Math.PI * 2;
					return P(Math.cos(a) * r, yy, zc + Math.sin(a) * r);
				});
			const disc = (r: number, yy: number) => closed(circ(r, yy));

			// The surface sits at the back of the ring.
			shape(disc(Ri, yb), { fill: 'url(#portal-glow)' });

			// Rings drifting toward the centre.
			for (let j = 0; j < 4; j++) {
				const f = 1 - ((t * 0.22 + j / 4) % 1);
				shape(disc(Ri * f * 0.96, yb), { stroke: '#fafafa', strokeOpacity: 0.55 * f, strokeWidth: 0.8 });
			}

			// Light spiralling inward along three arms.
			let dots = '';
			const dotR = Math.max(0.6, u * 0.025);
			for (let k = 0; k < 66; k++) {
				const arm = k % 3;
				const s2 = (k / 66 + t * 0.12) % 1;
				const r = Ri * (1 - s2) * 0.92;
				const a = arm * ((Math.PI * 2) / 3) + s2 * 5.5 + t * 0.6;
				const [qx, qy] = pt(Math.cos(a) * r, yb, zc + Math.sin(a) * r);
				const rr = dotR * (0.6 + (1 - s2));
				dots += `M${(qx - rr).toFixed(1)},${qy.toFixed(1)}a${rr.toFixed(2)},${rr.toFixed(2)} 0 1,0 ${(rr * 2).toFixed(2)},0a${rr.toFixed(2)},${rr.toFixed(2)} 0 1,0 ${(-rr * 2).toFixed(2)},0`;
			}
			shape(dots, { fill: '#fafafa', fillOpacity: 0.85 });

			// Inside of the ring, where it faces the viewer.
			for (let i = 0; i < N; i++) {
				const a0 = (i / N) * Math.PI * 2;
				const a1 = ((i + 1) / N) * Math.PI * 2;
				const am = (a0 + a1) / 2;
				if (-(Math.cos(am) + Math.sin(am)) <= 0) continue;
				const v = Math.round(214 + 26 * Math.max(0, -Math.sin(am)));
				const col = `rgb(${v},${v},${v})`;
				shape(
					closed([
						P(Math.cos(a0) * Ri, yb, zc + Math.sin(a0) * Ri),
						P(Math.cos(a1) * Ri, yb, zc + Math.sin(a1) * Ri),
						P(Math.cos(a1) * Ri, yf, zc + Math.sin(a1) * Ri),
						P(Math.cos(a0) * Ri, yf, zc + Math.sin(a0) * Ri)
					]),
					{ fill: col, stroke: col, strokeWidth: 0.5 }
				);
			}

			// Outside of the ring, where it faces the viewer.
			for (let i = 0; i < N; i++) {
				const a0 = (i / N) * Math.PI * 2;
				const a1 = ((i + 1) / N) * Math.PI * 2;
				const am = (a0 + a1) / 2;
				if (Math.cos(am) + Math.sin(am) <= 0) continue;
				const v = Math.round(210 + 36 * Math.max(0, Math.sin(am)));
				const col = `rgb(${v},${v},${v})`;
				shape(
					closed([
						P(Math.cos(a0) * R, yb, zc + Math.sin(a0) * R),
						P(Math.cos(a1) * R, yb, zc + Math.sin(a1) * R),
						P(Math.cos(a1) * R, yf, zc + Math.sin(a1) * R),
						P(Math.cos(a0) * R, yf, zc + Math.sin(a0) * R)
					]),
					{ fill: col, stroke: col, strokeWidth: 0.5 }
				);
			}

			// Front face of the ring.
			shape(`${disc(R, yf)} ${disc(Ri, yf)}`, { fill: '#fdfdfd', stroke: '#1a1a1a', evenodd: true });

			// A leader from the top of the ring out to the status tag.
			if (tagEl && portalTag && settled) {
				const a = Math.PI / 2;
				const [ax, ay] = pt(Math.cos(a) * R, yf, zc + Math.sin(a) * R);
				const tw = tagEl.offsetWidth;
				const th = tagEl.offsetHeight;
				const rise = Math.max(th / 2 + 12, u * 0.55);
				const run = Math.max(22, u * 0.7);
				const dot = 2.2;
				if (window.innerWidth <= 768) {
					// Phones: the tag sits centred above the ring, and the leader runs
					// straight up from the top of the ring to the middle of the tag.
					const gap = Math.max(36, u * 1.1);
					const tx = Math.max(8, Math.min(pw - tw - 8, ax - tw / 2));
					const ty = Math.max(4, ay - gap - th);
					shape(`M${ax.toFixed(1)},${ay.toFixed(1)}L${ax.toFixed(1)},${(ty + th).toFixed(1)}`, {
						stroke: '#1a1a1a',
						strokeWidth: 0.8
					});
					shape(
						`M${(ax - dot).toFixed(1)},${ay.toFixed(1)}a${dot},${dot} 0 1,0 ${dot * 2},0a${dot},${dot} 0 1,0 ${-dot * 2},0`,
						{ fill: '#1a1a1a' }
					);
					tagEl.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
					return;
				}
				// Go toward whichever side has more room, and keep the tag inside the panel.
				const dir = ax > pw / 2 ? -1 : 1;
				const ex = ax + dir * rise;
				const ey = Math.max(th / 2 + 6, ay - rise);
				let tx = dir > 0 ? ex + run + 6 : ex - run - 6 - tw;
				tx = Math.max(8, Math.min(pw - tw - 8, tx));
				// If the tag ended up right above the ring, the leader runs straight up into it.
				const over = ax >= tx && ax <= tx + tw;
				const lead = over
					? `M${ax.toFixed(1)},${ay.toFixed(1)}L${ax.toFixed(1)},${(ey + th / 2 + 4).toFixed(1)}`
					: `M${ax.toFixed(1)},${ay.toFixed(1)}L${ex.toFixed(1)},${ey.toFixed(1)}L${(ex < tx ? tx - 6 : tx + tw + 6).toFixed(1)},${ey.toFixed(1)}`;
				shape(lead, { stroke: '#1a1a1a', strokeWidth: 0.8 });
				shape(
					`M${(ax - dot).toFixed(1)},${ay.toFixed(1)}a${dot},${dot} 0 1,0 ${dot * 2},0a${dot},${dot} 0 1,0 ${-dot * 2},0`,
					{ fill: '#1a1a1a' }
				);
				tagEl.style.transform = `translate(${tx.toFixed(1)}px, ${(ey - th / 2).toFixed(1)}px)`;
			}
		}

		function tick(now: number) {
			const idx = untrack(() => inline) ? (revealed ? 1 : 0) : sectionIndex();
			if (idx !== active) {
				active = idx;
				goTo(idx);
			}

			const story = anchors[0]?.parentElement?.getBoundingClientRect();
			const visible = untrack(() => inline)
				? true
				: story
					? story.top < window.innerHeight && story.bottom > 0
					: false;
			alpha += ((visible ? 1 : 0) - alpha) * 0.08;
			svg.style.opacity = alpha.toFixed(3);
			layer.style.opacity = alpha.toFixed(3);

			// Sticky mode: as the story ends, the panel leaves with its last section
			// instead of hanging over what comes next.
			if (!untrack(() => inline) && panelEl && story) {
				const limit = window.innerWidth <= 768 ? panelEl.offsetHeight : window.innerHeight;
				const shift = Math.min(0, story.bottom - limit);
				panelEl.style.transform = shift ? `translateY(${shift.toFixed(1)}px)` : '';
			}

			const t = now / 1000;
			const scene = scenes[active];
			// Frame the scene: fill most of the panel, but keep small scenes modest.
			const fr = frames[active];
			// Inline scenes have the panel to themselves, so they can fill more of it.
			const cap = Math.min(pw, ph) / (untrack(() => inline) ? 4.5 : 8);
			// On phones the band starts under the status bar, so its scene sits a little
			// low in the band rather than dead centre.
			const lowered = !untrack(() => inline) && pw < 769 && window.innerWidth <= 768;
			const fitH = lowered ? 0.72 : 0.8;
			const targetU = Math.min((pw * 0.9) / Math.max(fr.w, 1), (ph * fitH) / Math.max(fr.h, 1), cap);
			const ease = view.u === 0 ? 1 : 0.07;
			view.u += (targetU - view.u) * ease;
			view.cx += (fr.cx - view.cx) * ease;
			view.cy += (fr.cy - view.cy) * ease;
			u = view.u;
			ox = pw / 2 - view.cx * u;
			oy = ph * (lowered ? 0.58 : 0.5) - view.cy * u;

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
				shape(
					closed([
						P(b.x + b.w, b.y, g),
						P(b.x + b.w + s, b.y + s * 0.15, g),
						P(b.x + b.w + s, b.y + b.d + s * 0.15, g),
						P(b.x + b.w, b.y + b.d, g)
					]),
					{ fill: '#1a1a1a', fillOpacity: 0.06 }
				);
			}

			// Ground slabs always go down first; everything else back to front.
			const depth = (b: Box) =>
				b.z < 0.05 && b.h < 0.2 ? -1e6 : b.x + b.w / 2 + b.y + b.d / 2 + b.z;
			all.sort((p, q) => depth(p.b) - depth(q.b));

			for (const { b, n } of all) drawBox(b, Math.min(1, b.tone), n, t);

			if (scene.portal) drawPortal(scene.portal, t);

			for (let i = used; i < pool.length; i++) pool[i].style.display = 'none';

			// Pin the clickable layer onto the block faces (40px per grid unit).
			const px = u / 40;
			overlays.forEach((o, i) => {
				if (o.kind === 'portal' && scene.portal) {
					// The view sits in the ring's opening, on the ring's own plane.
					const el = overlayTop[i];
					if (el) {
						const { zc, R, ring, depth } = scene.portal;
						const Ri = R - ring;
						const [ex, ey] = pt(-Ri, depth / 2, zc + Ri);
						const size = Ri * 2 * 40;
						el.style.width = `${size}px`;
						el.style.height = `${size}px`;
						el.style.transform = `matrix(${C * px},${S * px},0,${px},${ex},${ey})`;
						el.style.setProperty('--view-scale', String(size / 1200));
					}
					return;
				}
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
			io.disconnect();
		};
	});
</script>

<div class="stage" class:inline>
	<div class="panel" bind:this={panelEl}>
		<svg bind:this={svgEl} class="iso" aria-hidden="true"></svg>
		<div class="layer" class:live={settled} bind:this={layerEl}>
			{#if scenes[active].portal && portalTag}
				<div class="tag" bind:this={tagEl}>
					<span class="tag-title">{portalTag.title}</span>
					{#if portalTag.detail}<span class="tag-detail">{portalTag.detail}</span>{/if}
				</div>
			{/if}
			{#each overlays as o, i (active + '-' + i)}
				{#if o.kind === 'gate'}
					<a
						class="face front gate"
						href={o.href}
						bind:this={overlayFront[i]}
						onmouseenter={() => (hovered = o.box)}
						onmouseleave={() => (hovered = -1)}>enter</a
					>
				{:else if o.kind === 'portal'}
					<a class="face portal-view" href={o.href} bind:this={overlayTop[i]} aria-label="enter the portal to spark">
						<img class="portal-poster" src={o.poster} alt="" />
						<iframe class="portal-live" src={o.live} title="spark preview" tabindex="-1" aria-hidden="true" loading="lazy"></iframe>
						<span class="portal-rim" aria-hidden="true"></span>
					</a>
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

	/* Inline: sits in the page like an image. */
	.stage.inline {
		position: relative;
		height: clamp(300px, 50vh, 540px);
		margin: 0;
		z-index: auto;
	}

	.stage.inline .panel {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		background: none;
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

	/* The status tag at the end of the leader. */
	.tag {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.45rem 0.7rem;
		border-radius: 8px;
		background: #fdfdfd;
		box-shadow: 0 1px 10px rgba(26, 26, 26, 0.08);
		font-family: 'Raleway Variable', var(--main-font);
		white-space: nowrap;
		opacity: 0;
		transition: opacity 0.5s ease;
		pointer-events: none;
	}

	.layer.live .tag {
		opacity: 1;
	}

	.tag-title {
		font-size: 0.82rem;
		font-weight: 400;
		color: #1a1a1a;
	}

	.tag-detail {
		font-size: 0.72rem;
		font-weight: 300;
		color: #6b6b6b;
	}

	@media (max-width: 768px) {
		.tag {
			padding: 0.35rem 0.55rem;
		}
		.tag-title {
			font-size: 0.72rem;
		}
		.tag-detail {
			font-size: 0.62rem;
		}
	}

	/* What lies on the other side: the live page, seen through the ring. */
	.portal-view {
		display: block;
		border-radius: 50%;
		overflow: hidden;
		background: #0d1117;
		isolation: isolate;
	}

	.portal-poster,
	.portal-live {
		position: absolute;
		top: 0;
		left: 0;
		width: 1200px;
		height: 1200px;
		border: 0;
		transform-origin: 0 0;
		transform: scale(var(--view-scale, 0.1));
		pointer-events: none;
	}

	/* The edge of the opening glows in the brand colours and slowly turns. */
	.portal-rim {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background:
			radial-gradient(circle, transparent 52%, rgba(45, 74, 138, 0.35) 72%, rgba(128, 0, 32, 0.75) 100%),
			conic-gradient(from 0deg, rgba(250, 250, 250, 0.18), transparent 25%, rgba(250, 250, 250, 0.12) 50%, transparent 75%, rgba(250, 250, 250, 0.18));
		animation: portal-turn 9s linear infinite;
		pointer-events: none;
	}

	@keyframes portal-turn {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.portal-rim {
			animation: none;
		}
	}



	.gate:focus-visible,
	.portal-view:focus-visible {
		outline: 1px solid #1a1a1a;
		outline-offset: 1px;
	}

	/* Phones: a solid band across the top third, right under the partner strip.
	   The text scrolls in the space below and slides up behind it. */
	@media (max-width: 768px) {
		.stage:not(.inline) .panel {
			top: 0;
			bottom: auto;
			width: 100%;
			height: var(--panel-h);
			background: var(--page-background);
		}

		.stage:not(.inline) .panel::after {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			top: 100%;
			height: 0.75rem;
			background: linear-gradient(to top, transparent, var(--page-background));
		}
	}
</style>
