<script lang="ts">
	import { onMount } from 'svelte';

	/**
	 * One drawing that follows the reader through the story and changes shape
	 * for each section. `anchors` are the elements whose vertical centres
	 * mark each shape; the first shape (scatter) is reached just before them.
	 */
	let { anchors }: { anchors: HTMLElement[] } = $props();

	const N = 150;
	const MAX_LINES = 700;

	type Pt = [number, number];
	type Stage = {
		pts: Pt[];
		link: number; // connection distance in normalised units
		dot: number; // dot radius in px
		x: number; // centre as a fraction of viewport width (desktop)
		size: number; // size as a fraction of min(vw, vh)
		alpha: number;
	};

	// Seeded random so every visit draws the same shapes.
	let seed = 7;
	const rand = () => {
		seed = (seed * 16807) % 2147483647;
		return (seed - 1) / 2147483646;
	};
	const gauss = () => {
		let u = 0;
		for (let i = 0; i < 6; i++) u += rand();
		return u / 6 - 0.5;
	};

	function scatter(): Pt[] {
		return Array.from({ length: N }, () => [rand() * 2.4 - 1.2, rand() * 2 - 1]);
	}

	function disk(): Pt[] {
		const golden = Math.PI * (3 - Math.sqrt(5));
		return Array.from({ length: N }, (_, i) => {
			const r = Math.sqrt((i + 0.5) / N) * 0.62;
			const a = i * golden;
			return [Math.cos(a) * r, Math.sin(a) * r];
		});
	}

	function network(): Pt[] {
		const hubs: Pt[] = Array.from({ length: 9 }, () => [rand() * 1.8 - 0.9, rand() * 1.6 - 0.8]);
		return Array.from({ length: N }, (_, i) => {
			const h = hubs[i % hubs.length];
			return [h[0] + gauss() * 0.5, h[1] + gauss() * 0.5];
		});
	}

	function hub(): Pt[] {
		const pts: Pt[] = [];
		const core = 18;
		for (let i = 0; i < core; i++) {
			const a = (i / core) * Math.PI * 2;
			pts.push([Math.cos(a) * 0.1, Math.sin(a) * 0.1]);
		}
		const perSpoke = Math.floor((N - core) / 6);
		for (let s = 0; s < 6; s++) {
			const a = (s / 6) * Math.PI * 2 - Math.PI / 2;
			for (let k = 0; k < perSpoke; k++) {
				const d = 0.16 + (k / (perSpoke - 1)) * 0.72;
				const end = k === perSpoke - 1;
				const spread = end ? 0 : 0;
				pts.push([Math.cos(a) * d + spread, Math.sin(a) * d]);
			}
		}
		while (pts.length < N) pts.push([0, 0]);
		return pts;
	}

	function molecule(): Pt[] {
		const centres: Pt[] = [
			[0, 0],
			[-0.62, -0.38],
			[0.6, -0.42],
			[-0.5, 0.52],
			[0.66, 0.4]
		];
		const radii = [0.22, 0.14, 0.12, 0.15, 0.11];
		const pts: Pt[] = [];
		for (let i = 0; i < N; i++) {
			const c = i % centres.length;
			const a = rand() * Math.PI * 2;
			const r = radii[c];
			// Ring on each atom, with a few points on the bonds.
			if (i % 7 === 0 && c !== 0) {
				const t = rand();
				pts.push([centres[c][0] * t, centres[c][1] * t]);
			} else {
				pts.push([centres[c][0] + Math.cos(a) * r, centres[c][1] + Math.sin(a) * r]);
			}
		}
		return pts;
	}

	function textLines(): Pt[] {
		const lengths = [1.5, 1.3, 1.45, 0.9, 1.5, 1.2, 0.7];
		const total = lengths.reduce((a, b) => a + b, 0);
		const pts: Pt[] = [];
		lengths.forEach((len, row) => {
			const count = Math.round((len / total) * N);
			for (let k = 0; k < count && pts.length < N; k++) {
				pts.push([-0.75 + (k / Math.max(1, count - 1)) * len, -0.6 + row * 0.2]);
			}
		});
		while (pts.length < N) pts.push(pts[pts.length - 1]);
		return pts;
	}

	function roundedRect(cx: number, cy: number, w: number, h: number, r: number, n: number): Pt[] {
		const straightW = w - 2 * r;
		const straightH = h - 2 * r;
		const arc = (Math.PI / 2) * r;
		const per = 2 * straightW + 2 * straightH + 4 * arc;
		const pts: Pt[] = [];
		for (let i = 0; i < n; i++) {
			let d = (i / n) * per;
			const segs: [number, (t: number) => Pt][] = [
				[straightW, (t) => [cx - w / 2 + r + t, cy - h / 2]],
				[arc, (t) => corner(cx + w / 2 - r, cy - h / 2 + r, -Math.PI / 2 + t / r)],
				[straightH, (t) => [cx + w / 2, cy - h / 2 + r + t]],
				[arc, (t) => corner(cx + w / 2 - r, cy + h / 2 - r, t / r)],
				[straightW, (t) => [cx + w / 2 - r - t, cy + h / 2]],
				[arc, (t) => corner(cx - w / 2 + r, cy + h / 2 - r, Math.PI / 2 + t / r)],
				[straightH, (t) => [cx - w / 2, cy + h / 2 - r - t]],
				[arc, (t) => corner(cx - w / 2 + r, cy - h / 2 + r, Math.PI + t / r)]
			];
			for (const [len, f] of segs) {
				if (d <= len) {
					pts.push(f(d));
					break;
				}
				d -= len;
			}
		}
		return pts;
		function corner(x: number, y: number, a: number): Pt {
			return [x + Math.cos(a) * r, y + Math.sin(a) * r];
		}
	}

	function cards(): Pt[] {
		const n = Math.floor(N / 3);
		return [
			...roundedRect(-0.62, 0.05, 0.5, 0.62, 0.08, n),
			...roundedRect(0, -0.05, 0.5, 0.62, 0.08, n),
			...roundedRect(0.62, 0.05, 0.5, 0.62, 0.08, N - 2 * n)
		];
	}

	function ring(): Pt[] {
		return Array.from({ length: N }, (_, i) => {
			const a = (i / N) * Math.PI * 2;
			return [Math.cos(a) * 0.8, Math.sin(a) * 0.8];
		});
	}

	function point(): Pt[] {
		return Array.from({ length: N }, () => [0, 0]);
	}

	const stages: Stage[] = [
		{ pts: scatter(), link: 0.0, dot: 1.6, x: 0.7, size: 0.95, alpha: 0.7 },
		{ pts: disk(), link: 0.075, dot: 1.8, x: 0.7, size: 0.75, alpha: 1 },
		{ pts: network(), link: 0.2, dot: 2, x: 0.7, size: 0.8, alpha: 1 },
		{ pts: hub(), link: 0.11, dot: 2.2, x: 0.7, size: 0.8, alpha: 1 },
		{ pts: molecule(), link: 0.14, dot: 1.8, x: 0.5, size: 1.25, alpha: 0.16 },
		{ pts: textLines(), link: 0.08, dot: 1.6, x: 0.5, size: 1.2, alpha: 0.16 },
		{ pts: cards(), link: 0.08, dot: 1.6, x: 0.5, size: 1.3, alpha: 0.16 },
		{ pts: ring(), link: 0.06, dot: 1.6, x: 0.5, size: 1.1, alpha: 0.2 },
		{ pts: point(), link: 0, dot: 5, x: 0.5, size: 0.4, alpha: 1 }
	];

	let svgEl: SVGSVGElement | undefined = $state();

	onMount(() => {
		if (!svgEl) return;
		const svg = svgEl;
		const ns = 'http://www.w3.org/2000/svg';
		const lineGroup = document.createElementNS(ns, 'g');
		const dotGroup = document.createElementNS(ns, 'g');
		svg.append(lineGroup, dotGroup);

		const lines: SVGLineElement[] = [];
		for (let i = 0; i < MAX_LINES; i++) {
			const l = document.createElementNS(ns, 'line');
			l.setAttribute('stroke', '#1a1a1a');
			l.setAttribute('stroke-width', '0.6');
			l.style.display = 'none';
			lineGroup.append(l);
			lines.push(l);
		}
		const dots: SVGCircleElement[] = [];
		for (let i = 0; i < N; i++) {
			const c = document.createElementNS(ns, 'circle');
			c.setAttribute('fill', '#1a1a1a');
			dotGroup.append(c);
			dots.push(c);
		}

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let vw = window.innerWidth;
		let vh = window.innerHeight;
		const cur: Pt[] = stages[0].pts.map((p) => [p[0], p[1]]);
		let curView = { x: stages[0].x, size: stages[0].size, alpha: 0, dot: stages[0].dot, link: 0 };
		let frame = 0;

		function resize() {
			vw = window.innerWidth;
			vh = window.innerHeight;
			svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
		}
		resize();
		window.addEventListener('resize', resize);

		const smooth = (t: number) => t * t * (3 - 2 * t);

		function progress(): { i: number; t: number; fade: number } {
			const y = window.scrollY + vh / 2;
			const mids = anchors.map((el) => {
				const r = el.getBoundingClientRect();
				return r.top + window.scrollY + r.height / 2;
			});
			if (!mids.length) return { i: 0, t: 0, fade: 0 };
			const marks = [mids[0] - vh * 0.9, ...mids];
			if (y <= marks[0]) return { i: 0, t: 0, fade: 1 };
			const last = marks.length - 1;
			if (y >= marks[last]) {
				const fade = 1 - Math.min(1, (y - marks[last]) / (vh * 0.6));
				return { i: last, t: 0, fade };
			}
			let i = 0;
			while (i < last && y >= marks[i + 1]) i++;
			const raw = (y - marks[i]) / (marks[i + 1] - marks[i]);
			// Hold each shape while its section is being read, morph between.
			const t = smooth(Math.min(1, Math.max(0, (raw - 0.25) / 0.5)));
			return { i, t, fade: 1 };
		}

		function tick(now: number) {
			const { i, t, fade } = progress();
			const a = stages[i];
			const b = stages[Math.min(i + 1, stages.length - 1)];
			const mobile = vw <= 768;
			const lerp = (p: number, q: number) => p + (q - p) * t;

			const k = 0.09;
			const target = {
				x: mobile ? 0.5 : lerp(a.x, b.x),
				size: lerp(a.size, b.size),
				alpha: lerp(a.alpha, b.alpha) * fade * (mobile && lerp(a.alpha, b.alpha) > 0.5 ? 0.22 : 1),
				dot: lerp(a.dot, b.dot),
				link: lerp(a.link, b.link)
			};
			curView = {
				x: curView.x + (target.x - curView.x) * k,
				size: curView.size + (target.size - curView.size) * k,
				alpha: curView.alpha + (target.alpha - curView.alpha) * k,
				dot: curView.dot + (target.dot - curView.dot) * k,
				link: curView.link + (target.link - curView.link) * k
			};

			const drift = reduceMotion ? 0 : 0.012;
			const time = now * 0.0004;
			for (let n = 0; n < N; n++) {
				const tx = lerp(a.pts[n][0], b.pts[n][0]) + Math.sin(time + n * 1.7) * drift;
				const ty = lerp(a.pts[n][1], b.pts[n][1]) + Math.cos(time * 1.3 + n * 2.3) * drift;
				cur[n][0] += (tx - cur[n][0]) * k;
				cur[n][1] += (ty - cur[n][1]) * k;
			}

			const s = (Math.min(vw, vh) * curView.size) / 2;
			const cx = vw * curView.x;
			const cy = vh / 2;
			svg.style.opacity = String(curView.alpha);

			for (let n = 0; n < N; n++) {
				dots[n].setAttribute('cx', (cx + cur[n][0] * s).toFixed(1));
				dots[n].setAttribute('cy', (cy + cur[n][1] * s).toFixed(1));
				dots[n].setAttribute('r', curView.dot.toFixed(2));
			}

			let used = 0;
			const thr = curView.link;
			if (thr > 0.005) {
				const thr2 = thr * thr;
				for (let p = 0; p < N && used < MAX_LINES; p++) {
					for (let q = p + 1; q < N && used < MAX_LINES; q++) {
						const dx = cur[p][0] - cur[q][0];
						const dy = cur[p][1] - cur[q][1];
						const d2 = dx * dx + dy * dy;
						if (d2 < thr2 && d2 > 1e-6) {
							const l = lines[used++];
							l.setAttribute('x1', (cx + cur[p][0] * s).toFixed(1));
							l.setAttribute('y1', (cy + cur[p][1] * s).toFixed(1));
							l.setAttribute('x2', (cx + cur[q][0] * s).toFixed(1));
							l.setAttribute('y2', (cy + cur[q][1] * s).toFixed(1));
							l.setAttribute('stroke-opacity', (0.55 * (1 - Math.sqrt(d2) / thr)).toFixed(2));
							l.style.display = '';
						}
					}
				}
			}
			for (let u = used; u < MAX_LINES; u++) {
				if (lines[u].style.display === 'none') break;
				lines[u].style.display = 'none';
			}

			frame = requestAnimationFrame(tick);
		}
		frame = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<div class="field" aria-hidden="true">
	<svg bind:this={svgEl} class="field-svg" preserveAspectRatio="xMidYMid slice"></svg>
</div>

<style>
	.field {
		position: sticky;
		top: 0;
		height: 100vh;
		height: 100svh;
		margin-bottom: -100vh;
		margin-bottom: -100svh;
		pointer-events: none;
		z-index: 0;
	}

	.field-svg {
		width: 100%;
		height: 100%;
		display: block;
		opacity: 0;
	}
</style>
