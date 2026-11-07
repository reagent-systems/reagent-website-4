<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, inView, stagger } from 'motion';
	import IsoField from './IsoField.svelte';
	import type { SparkSummary } from './spark';
	import { ARTICLES, RELEASES } from './content';

	type Statement = { title?: string; body: string };

	// Founder's own phrasing, trimmed. Mission first, then how, then why.
	const statements: Statement[] = [
		{
			title: 'building what builders need.',
			body: "we founded a network out of necessity. there are unknown unknowns in any entrepreneurial career, but that shouldn't stop you from achieving success. so we gathered the resources, the knowledge, and the capital in one place."
		},
		{
			body: 'first, we talk with the founder. we estimate the true technology or manufacturing readiness of the company, identify its constraints, and work in a partnership capacity towards solutions.'
		},
		{
			body: 'from there, we build up companies to a stage almost assuredly ready to reach a capital raise. we take no equity and no percentage of any introduction, because to us it stifles the forward progress of a company.'
		},
		{
			body: "why do we do this? because we've been where they are now. the most invaluable thing is a network of founders that reach out and assist."
		},
		{
			body: 'if the only thing stopping anybody from the next breakthrough is a lack of our assistance, then by all means, we are going to assist.'
		}
	];

	// Hyphenated words stay on one line ("phone-centric", never "phone-" / "centric").
	const pieces = (text: string) =>
		text.split(/(\s+)/).map((w) => ({ w, keep: /\S-\S/.test(w) }));

	let statementEls: HTMLElement[] = $state([]);
	const anchors = $derived(statementEls.filter((el): el is HTMLElement => !!el));

	// Cards and visuals rise into place as they come into view.
	function reveal(node: HTMLElement) {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const items = Array.from(node.children) as HTMLElement[];
		items.forEach((el) => {
			el.style.opacity = '0';
			el.style.transform = 'translateY(32px) scale(0.97)';
		});
		const stop = inView(
			node,
			() => {
				animate(
					items,
					{ opacity: [0, 1], y: [32, 0], scale: [0.97, 1] },
					{ type: 'spring', stiffness: 110, damping: 18, delay: stagger(0.12) }
				);
			},
			{ amount: 0.25 }
		);
		return { destroy: stop };
	}

	// Live status from Spark, refreshed every minute.
	let spark = $state<SparkSummary | null>(null);
	const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

	function tokensText(n: number) {
		if (n >= 1e9) return `${(n / 1e9).toFixed(2)} billion`;
		if (n >= 1e6) return `${(n / 1e6).toFixed(1)} million`;
		return n.toLocaleString('en-US');
	}

	function sinceText(iso: string) {
		const [y, m] = iso.split('-').map(Number);
		return y && m ? `${MONTHS[m - 1]} ${y}` : '';
	}

	function untilText(epoch: number) {
		return new Date(epoch * 1000)
			.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
			.toLowerCase();
	}

	const sparkStatus = $derived.by(() => {
		if (!spark || !spark.ok) return null;
		if (spark.status === 'training')
			return spark.until ? `in a training session until ${untilText(spark.until)}` : 'in a training session';
		if (spark.status === 'serving') return spark.model ? `now serving ${spark.model.toLowerCase()}` : 'serving now';
		return 'resting';
	});

	const portalTag = $derived(
		sparkStatus && spark?.ok
			? {
					title: sparkStatus,
					detail:
						spark.tokens > 0
							? `${tokensText(spark.tokens)} tokens served${spark.since ? ` since ${sinceText(spark.since)}` : ''}`
							: undefined
				}
			: null
	);

	onMount(() => {
		const load = () =>
			fetch('/api/spark')
				.then((r) => r.json())
				.then((d: SparkSummary) => (spark = d))
				.catch(() => {});
		load();
		const timer = setInterval(load, 60000);
		return () => clearInterval(timer);
	});

	let newsletterEmail = $state('');
	let newsletterSent = $state(false);

	let contactName = $state('');
	let contactEmail = $state('');
	let contactMessage = $state('');
	let contactSent = $state(false);

	function submitNewsletter(e: SubmitEvent) {
		e.preventDefault();
		newsletterSent = true;
	}

	function submitContact(e: SubmitEvent) {
		e.preventDefault();
		contactSent = true;
	}
</script>

{#snippet whole(text: string)}{#each pieces(text) as p}{#if p.keep}<span class="nowrap">{p.w}</span>{:else}{p.w}{/if}{/each}{/snippet}

<div class="story">
	<!-- Mission, how and why: the blocks follow along, then scroll away with this part. -->
	<div class="intro">
		<IsoField {anchors} />

		{#each statements as statement, i}
			<section class="statement" bind:this={statementEls[i]}>
				<div class="statement-copy">
					{#if statement.title}
						<h2 class="title">{statement.title}</h2>
					{/if}
					<p class="body">{statement.body}</p>
				</div>
			</section>
		{/each}
	</div>

	<section class="link-section">
		<h2 class="title">research</h2>
		<table class="releases">
			<thead>
				<tr>
					<th scope="col">project</th>
					<th scope="col" class="col-type">type</th>
					<th scope="col" class="col-details">details</th>
					<th scope="col" class="col-date">released</th>
				</tr>
			</thead>
			<tbody use:reveal>
				{#each RELEASES.slice(0, 4) as row}
					<tr>
						<td class="col-name">
							<a href={row.url} target="_blank" rel="noopener noreferrer">{row.name}</a>
							<span class="col-details-inline">{@render whole(row.details)}</span>
						</td>
						<td class="col-type">{row.type}</td>
						<td class="col-details">{@render whole(row.details)}</td>
						<td class="col-date">{row.date}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<a class="quiet-link" href="/research">all research</a>
	</section>

	<section class="link-section">
		<h2 class="title">writing</h2>
		<div class="cards" use:reveal>
			{#each ARTICLES.slice(0, 2) as article}
				<a class="card text" href={article.href}>
					<span class="card-title">{article.title}</span>
					<span class="card-line">{article.excerpt}</span>
				</a>
			{/each}
		</div>
		<a class="quiet-link" href="/blog">all writing</a>
	</section>

	<section class="link-section">
		<h2 class="title">portal</h2>
		<p class="body">
			{@render whole(
				'a shared nvidia dgx spark, open to the community. it serves open models through an openai-compatible api.'
			)}
		</p>
		<div class="visual">
			<IsoField inline {portalTag} />
		</div>
		<div class="links">
			<a class="quiet-link" href="https://spark.reagent-systems.com">enter the portal</a>
			<a class="quiet-link" href="https://spark.reagent-systems.com/docs">read the docs</a>
		</div>
	</section>

	<section class="link-section join" id="join">
		<h2 class="title">join us</h2>
		<div class="join-grid">
			<form class="join-block" onsubmit={submitNewsletter}>
				<h3 class="sub">the newsletter</h3>
				<p class="note">what we are building, sent when there is something worth reading.</p>
				{#if newsletterSent}
					<p class="note">thank you. you are on the list.</p>
				{:else}
					<div class="inline-field">
						<label class="visually-hidden" for="newsletter-email">email</label>
						<input
							id="newsletter-email"
							type="email"
							required
							placeholder="email"
							autocomplete="email"
							bind:value={newsletterEmail}
						/>
						<button type="submit">subscribe</button>
					</div>
				{/if}
			</form>

			<form class="join-block" onsubmit={submitContact}>
				<h3 class="sub">talk to reagent</h3>
				{#if contactSent}
					<p class="note">thank you. we will be in touch.</p>
				{:else}
					<label class="visually-hidden" for="contact-name">name</label>
					<input id="contact-name" required placeholder="name" autocomplete="name" bind:value={contactName} />
					<label class="visually-hidden" for="contact-email">email</label>
					<input
						id="contact-email"
						type="email"
						required
						placeholder="email"
						autocomplete="email"
						bind:value={contactEmail}
					/>
					<label class="visually-hidden" for="contact-message">message</label>
					<textarea
						id="contact-message"
						required
						rows="4"
						placeholder="message"
						bind:value={contactMessage}
					></textarea>
					<button type="submit" class="send">send</button>
				{/if}
			</form>

			<div class="join-block">
				<h3 class="sub">careers</h3>
				<p class="note">build alongside us, in any of the six.</p>
				<a class="quiet-link" href="/careers">open roles</a>
			</div>
		</div>
	</section>

	<section class="link-section quote">
		<blockquote>
			<p>
				we measure progress in decades. to make sure our vision for the future succeeds, we
				accelerate founders in days.
			</p>
		</blockquote>
		<a class="quiet-link" href="/plan">read the plan</a>
	</section>
</div>

<style>
	/* Everything here draws on the shared type and spacing scales in app.css. */

	.story {
		position: relative;
		background: var(--page-background);
	}

	section {
		position: relative;
		z-index: 1;
	}

	/* Type: one style per role. */
	.title {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: var(--text-title);
		line-height: 1.02;
		letter-spacing: -0.02em;
		color: #1a1a1a;
		margin-bottom: var(--space-m);
	}

	.sub {
		font-family: var(--main-font);
		font-weight: 200;
		font-size: var(--text-sub);
		color: #1a1a1a;
	}

	.body {
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: var(--text-body);
		line-height: 1.7;
		color: #5f5f5f;
		max-width: 32rem;
	}

	/* Body copy is fully justified, with the last line centred. */
	p {
		text-align: justify;
		text-align-last: center;
	}

	.note {
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: var(--text-body);
		line-height: 1.6;
		color: #6b6b6b;
		text-align: left;
		text-align-last: left;
	}

	.quiet-link {
		display: inline-block;
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: var(--text-small);
		letter-spacing: 0.05em;
		color: #6b6b6b;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.quiet-link:hover {
		color: #000;
	}

	/* Mission, how and why: text on the left, the blocks on the right. */
	.intro {
		position: relative;
	}

	.intro section {
		padding-right: 48vw;
	}

	.statement {
		min-height: 100vh;
		min-height: 100svh;
		display: flex;
		align-items: center;
		padding-left: var(--gutter);
	}

	.statement-copy {
		max-width: 34rem;
	}

	.statement .title {
		text-align: center;
	}

	/* Research, writing, portal, join, quote: one layout. Title, then the visual
	   below it, then the link. */
	.link-section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-m);
		/* One centred column, so wide screens don't leave an empty half. */
		padding: var(--space-section) max(var(--gutter), calc((100% - 56rem) / 2));
	}

	.link-section .title {
		margin-bottom: 0;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-m);
		width: 100%;
		max-width: 56rem;
	}

	/* Research: the newest releases, as in the table on the research page. */
	.releases {
		width: 100%;
		max-width: 56rem;
		border-collapse: collapse;
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
	}

	.releases th {
		text-align: left;
		font-weight: 300;
		font-size: var(--text-small);
		letter-spacing: 0.04em;
		color: #9a9a9a;
		padding: 0 var(--space-s) var(--space-s) 0;
	}

	.releases td {
		vertical-align: top;
		padding: var(--space-s) var(--space-s) var(--space-s) 0;
		font-size: var(--text-small);
		line-height: 1.5;
		color: #6b6b6b;
	}

	.releases tbody tr {
		transition: background 0.3s ease;
	}

	.releases tbody tr:hover {
		background: rgba(255, 255, 255, 0.7);
	}

	.col-name a {
		font-size: var(--text-body);
		color: #1a1a1a;
		text-decoration: none;
		white-space: nowrap;
	}

	.col-name a:hover {
		color: #6b6b6b;
	}

	.col-date {
		font-family: var(--ascii-font);
		white-space: nowrap;
		text-align: right;
	}

	th.col-date {
		font-family: 'Raleway Variable', var(--main-font);
		text-align: right;
	}

	.nowrap {
		white-space: nowrap;
	}

	.col-details-inline {
		display: none;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		text-decoration: none;
		color: inherit;
	}




	/* Articles: face-on, the title and a line of the piece. */
	.card.text {
		justify-content: space-between;
		min-height: 13rem;
		padding: var(--space-m);
		border-radius: 20px;
		background: #fdfdfd;
		box-shadow: 0 1px 16px rgba(26, 26, 26, 0.06);
		transition: box-shadow 0.4s ease;
	}

	.card.text:hover {
		box-shadow: 0 4px 24px rgba(26, 26, 26, 0.1);
	}

	.card-title {
		font-family: var(--main-font);
		font-weight: 300;
		font-size: var(--text-card);
		line-height: 1.2;
		color: #1a1a1a;
	}

	.card-line {
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: var(--text-small);
		line-height: 1.5;
		color: #6b6b6b;
	}

	.visual {
		width: 100%;
		max-width: 56rem;
	}

	.links {
		display: flex;
		gap: var(--space-m);
	}

	/* Join */
	.join-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--space-l);
		width: 100%;
		max-width: 36rem;
	}

	.join-block {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
	}

	.inline-field {
		display: flex;
		gap: var(--space-xs);
	}

	input,
	textarea {
		width: 100%;
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: var(--text-body);
		color: #1a1a1a;
		background: #efefef;
		border: none;
		border-radius: 14px;
		padding: 1rem 1.25rem;
		outline: none;
		resize: vertical;
		transition: background 0.3s ease;
	}

	input:focus,
	textarea:focus {
		background: #e7e7e7;
	}

	input::placeholder,
	textarea::placeholder {
		color: #9a9a9a;
	}

	button {
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: var(--text-body);
		letter-spacing: 0.05em;
		color: #fafafa;
		background: #1a1a1a;
		border: none;
		border-radius: 14px;
		padding: 1rem 1.75rem;
		cursor: pointer;
		transition: background 0.3s ease;
		flex: none;
	}

	button:hover {
		background: #3a3a3a;
	}

	.send {
		align-self: flex-start;
	}

	/* Quote */
	.quote {
		min-height: 70vh;
		justify-content: center;
	}

	.quote blockquote {
		max-width: 44rem;
	}

	.quote p {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: var(--text-quote);
		line-height: 1.15;
		letter-spacing: -0.01em;
		color: #1a1a1a;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	@media (max-width: 768px) {
		/* Phones: the blocks hold a band at the top; each statement fills the space
		   below it, so its text is clear of the band while it is read. */
		.intro section {
			padding-right: var(--gutter);
		}

		.intro section:first-of-type {
			margin-top: var(--panel-h);
		}

		.statement {
			min-height: calc(100svh - var(--panel-h));
			padding: var(--space-m) var(--gutter);
		}

		.statement .title {
			margin-bottom: var(--space-s);
		}

		.cards {
			gap: var(--space-s);
		}

		/* Phones: name with its details beneath, and the date; type and the
		   separate details column drop away. */
		.releases .col-type,
		.releases .col-details {
			display: none;
		}

		.col-details-inline {
			display: block;
			margin-top: var(--space-xs);
		}

		.card.text {
			min-height: 10rem;
			padding: var(--space-s);
		}

		.inline-field {
			flex-direction: column;
		}

		.quote {
			min-height: 50svh;
		}
	}
</style>
