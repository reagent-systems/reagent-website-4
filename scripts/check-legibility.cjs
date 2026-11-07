/**
 * Legibility check for the homepage story.
 *
 * For each viewport, scrolls to where every story section comes to rest and checks
 * that each piece of text in it is fully on screen, not covered by the scene panel,
 * and at least 14px. Also lists every distinct font size used, to keep the type
 * scale tight. Run against a dev or preview server:
 *
 *   node scripts/check-legibility.cjs http://localhost:5173/
 */
const { chromium } = require('playwright');

const URL = process.argv[2] || 'http://localhost:5173/';
const VIEWPORTS = [
	{ name: 'phone small', width: 375, height: 667 },
	{ name: 'phone', width: 390, height: 664 },
	{ name: 'phone large', width: 430, height: 800 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'laptop', width: 1280, height: 720 },
	{ name: 'desktop', width: 1440, height: 900 }
];
const TEXT = 'h2, h3, p, blockquote p, a.quiet-link, input, textarea, button';

(async () => {
	const browser = await chromium.launch();
	let failures = 0;
	const sizes = new Set();

	for (const vp of VIEWPORTS) {
		const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
		await page.goto(URL, { waitUntil: 'networkidle' });
		const count = await page.locator('.story section').count();
		const problems = [];
		const vpSizes = new Set();

		for (let i = 0; i < count; i++) {
			const section = page.locator('.story section').nth(i);
			// Bring the section to where it rests: just under the band on phones,
			// or with its content centred on larger screens.
			await section.evaluate((el) => {
				const phone = innerWidth <= 768;
				const panel = document.querySelector('.panel');
				// Only the story statements have the scene band above them on phones.
				const banded = phone && panel && el.closest('.intro');
				const band = banded ? panel.getBoundingClientRect().height : 0;
				const r = el.getBoundingClientRect();
				const target = phone ? r.top - band : r.top + r.height / 2 - innerHeight / 2;
				window.scrollTo(0, window.scrollY + target);
			});
			await page.waitForTimeout(900);

			// What each element looks like where the section rests.
			const measure = (sel) =>
				section.evaluate((el, sel) => {
					const phone = innerWidth <= 768;
					const panel = document.querySelector('.panel')?.getBoundingClientRect();
					const band = phone && panel && el.closest('.intro') ? Math.max(0, panel.bottom) : 0;
					const tall = el.getBoundingClientRect().height > innerHeight - band;
					const out = [];
					el.querySelectorAll(sel).forEach((node, index) => {
						const r = node.getBoundingClientRect();
						if (r.width === 0 || r.height === 0) return;
						const cs = getComputedStyle(node);
						if (cs.visibility === 'hidden' || cs.display === 'none') return;
						const label = (node.innerText || node.placeholder || node.tagName).trim().slice(0, 40);
						const covered =
							!!panel &&
							r.left < panel.right && r.right > panel.left &&
							r.top < panel.bottom + (phone ? 12 : 0) && r.bottom > panel.top;
						out.push({
							index,
							label,
							tag: node.tagName.toLowerCase(),
							size: parseFloat(cs.fontSize),
							side: r.left < 0 || r.right > innerWidth + 0.5,
							covered,
							offscreen: r.top < 0 || r.bottom > innerHeight,
							tall
						});
					});
					return out;
				}, sel);

			const found = await measure(TEXT);
			for (const f of found) {
				f.issues = [];
				if (f.size < 14) f.issues.push(`text ${f.size}px is under 14px`);
				if (f.side) f.issues.push('runs off the side');
				if (!f.tall) {
					if (f.covered) f.issues.push('covered by the scene');
					if (f.offscreen) f.issues.push('not fully on screen');
				}
			}

			// Sections longer than the clear space: scroll each element into that space.
			if (found.some((f) => f.tall)) {
				for (const f of found) {
					await section.evaluate((el, [sel, index]) => {
						const node = el.querySelectorAll(sel)[index];
						const panel = document.querySelector('.panel')?.getBoundingClientRect();
						const band = innerWidth <= 768 && panel && el.closest('.intro') ? Math.max(0, panel.bottom) : 0;
						const r = node.getBoundingClientRect();
						const clearMid = band + (innerHeight - band) / 2;
						window.scrollTo(0, window.scrollY + r.top + r.height / 2 - clearMid);
					}, [TEXT, f.index]);
					await page.waitForTimeout(250);
					const again = (await measure(TEXT)).find((g) => g.index === f.index);
					if (again?.covered) f.issues.push('covered by the scene even when scrolled to');
					if (again?.offscreen) f.issues.push('cannot be brought fully on screen');
				}
			}

			for (const f of found) {
				sizes.add(`${f.tag} ${f.size}px`);
				vpSizes.add(`${f.tag} ${Math.round(f.size * 10) / 10}`);
				for (const issue of f.issues) problems.push(`section ${i + 1}, "${f.label}": ${issue}`);
			}
		}

		console.log(`\n${vp.name} (${vp.width}x${vp.height}): ${problems.length ? problems.length + ' problems' : 'all clear'}`);
		console.log('  sizes: ' + [...vpSizes].sort().join(', '));
		for (const p of problems) console.log('  - ' + p);
		failures += problems.length;
		await page.close();
	}

	await browser.close();
	process.exit(failures ? 1 : 0);
})();
