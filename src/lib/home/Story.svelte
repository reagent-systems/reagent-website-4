<script lang="ts">
	import { onMount } from 'svelte';
	import IsoField from './IsoField.svelte';
	import type { SparkSummary } from './spark';
	import { COMPANIES } from './companies';

	type Statement = { title?: string; body: string; link?: { href: string; label: string } };

	// Founder's own phrasing, made slightly more formal. Mission first, then how, then why.
	const statements: Statement[] = [
		{
			title: 'build what builders need.',
			body: "we founded a network out of necessity. there are unknown unknowns in any entrepreneurial career. but that shouldn't stop you from achieving success. so we gathered the resources, the knowledge, and the capital in one place to help any early stage founder succeed. we've been helped where you are now, and helping founders is our favorite place to be."
		},
		{
			body: 'first, we talk with the founder. we want to hear what project they are working on and what blockers they have. through a questionnaire, we estimate the true technology readiness level or manufacturing readiness level of that company. in doing so, we identify the constraints they will be facing or are currently facing, and work in a partnership capacity towards solutions to these constraints. from there, we build up companies to a stage almost assuredly ready to reach a capital raise, and we connect them to our investor network.'
		},
		{
			body: 'where we have to do the work to get a company to that stage, outside of any introductions where others are doing the work, terms are worked out as to our consultancy. we don\'t take any capital, we don\'t take any equity, and we don\'t take any profit share. beyond the engineering, management, marketing, development, or administrative roles we fill, we take nothing. if there is work that we are doing, we get paid for it. but we choose not to take a percentage of any introduction, because to us it stifles the forward progress of a company.'
		},
		{
			body: "why do we do this? because we've been where they are now. we know what it's like to tunnel vision and not realize the mistakes we may be making. we know that while it is a trial for us and anyone else to get to a point where the market agrees with them, the most invaluable thing is having a network of founders that reach out and assist. we want to see people succeed."
		},
		{
			body: 'we want to see our defense industrial base and its supply chain secured for decades to come. we want to be the modern equivalent of bell labs. we want to see innovation, and to pay people to pursue their dreams and their innovations. if the only thing stopping anybody from achieving the next breakthrough, the next innovation, the next frontier, is a lack of our assistance, then by all means, we are going to assist. we pay it forward.'
		}
	];

	let statementEls: HTMLElement[] = $state([]);
	let research: HTMLElement | undefined = $state();
	let writing: HTMLElement | undefined = $state();
	let portal: HTMLElement | undefined = $state();
	let join: HTMLElement | undefined = $state();
	let quote: HTMLElement | undefined = $state();

	const anchors = $derived(
		[...statementEls, research, writing, portal, join, quote].filter(
			(el): el is HTMLElement => !!el
		)
	);

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

	let contactCompany = $state(COMPANIES[0].slug);
	let contactName = $state('');
	let contactEmail = $state('');
	let contactMessage = $state('');
	let contactSent = $state(false);
	const pickedName = $derived(COMPANIES.find((c) => c.slug === contactCompany)?.name ?? '');

	function submitNewsletter(e: SubmitEvent) {
		e.preventDefault();
		newsletterSent = true;
	}

	function submitContact(e: SubmitEvent) {
		e.preventDefault();
		contactSent = true;
	}
</script>

<div class="story">
	<IsoField
		{anchors}
		picked={contactCompany}
		onpick={(slug) => (contactCompany = slug)}
		{portalTag}
	/>

	{#each statements as statement, i}
		<section class="statement" bind:this={statementEls[i]}>
			<div class="statement-copy">
				{#if statement.title}
					<h2>{statement.title}</h2>
				{/if}
				<p>{statement.body}</p>
				{#if statement.link}
					<a class="quiet-link" href={statement.link.href}>{statement.link.label}</a>
				{/if}
			</div>
		</section>
	{/each}

	<section class="resource" bind:this={research}>
		<h2 class="resource-title">research</h2>
		<a class="quiet-link" href="/research">all research</a>
	</section>

	<section class="resource" bind:this={writing}>
		<h2 class="resource-title">writing</h2>
		<a class="quiet-link" href="/blog">all writing</a>
	</section>

	<section class="resource portal" bind:this={portal}>
		<h2 class="resource-title">portal</h2>
		<p class="portal-body">
			a shared nvidia dgx spark, open to the community. it serves open models through an
			openai-compatible api, with its status, uptime and leaderboards kept in the open.
		</p>
		<div class="portal-links">
			<a class="quiet-link" href="https://spark.reagent-systems.com">enter the portal</a>
			<a class="quiet-link" href="https://spark.reagent-systems.com/docs">read the docs</a>
		</div>
	</section>

	<section class="join" bind:this={join} id="join">
		<h2 class="resource-title">join us</h2>
		<div class="join-grid">
			<form class="join-block" onsubmit={submitNewsletter}>
				<h3>the newsletter</h3>
				<p>what we are building, sent when there is something worth reading.</p>
				{#if newsletterSent}
					<p class="sent">thank you. you are on the list.</p>
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
				<h3>talk to reagent {pickedName}</h3>
				{#if contactSent}
					<p class="sent">thank you. we will be in touch.</p>
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

			<div class="join-block careers">
				<h3>careers</h3>
				<p>build alongside us, in any of the six.</p>
				<a class="quiet-link" href="/careers">open roles</a>
			</div>
		</div>
	</section>

	<section class="quote" bind:this={quote}>
		<blockquote>
			<p>we measure progress in decades. to make sure our vision for the future succeeds, we accelerate founders in days.</p>
		</blockquote>
		<a class="quiet-link plan-link" href="/plan">read the plan</a>
	</section>
</div>

<style>
	.story {
		position: relative;
		background: var(--page-background);
	}

	/* Text keeps to the left; the blocks live in the right-hand panel. */
	section {
		position: relative;
		z-index: 1;
		padding-right: 48vw !important;
	}

	/* Mission, why, how */
	.statement {
		min-height: 100vh;
		min-height: 100svh;
		display: flex;
		align-items: center;
		padding: 0 8vw;
	}

	.statement-copy {
		max-width: 36rem;
	}

	.statement h2 {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: var(--text-title);
		line-height: 1.02;
		letter-spacing: -0.02em;
		color: #1a1a1a;
		margin-bottom: 2rem;
	}

	/* All body copy is fully justified, with the last line centred. */
	p {
		text-align: justify;
		text-align-last: center;
	}

	.statement p {
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: var(--text-body);
		line-height: 1.7;
		color: #5f5f5f;
		max-width: 30rem;
	}


	/* Research, writing, portal */
	.resource {
		min-height: 100vh;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 8vw;
	}

	.resource-title {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: var(--text-title);
		letter-spacing: -0.02em;
		line-height: 1;
		color: #1a1a1a;
		margin-bottom: 4.5rem;
	}















	.quiet-link {
		display: inline-block;
		margin-top: 4rem;
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

	.statement .quiet-link {
		margin-top: 2.5rem;
	}

	.portal {
		min-height: 80vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.portal .resource-title {
		margin-bottom: 0;
	}

	.portal-body {
		margin-top: 2rem;
		max-width: 30rem;
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: var(--text-body);
		line-height: 1.7;
		color: #5f5f5f;
	}


	.portal-links {
		display: flex;
		gap: 2rem;
	}

	.portal .quiet-link {
		margin-top: 2.5rem;
	}

	/* Join */
	.join {
		padding: 22vh 8vw;
		min-height: 100vh;
	}

	.join-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-areas: 'newsletter' 'contact' 'careers';
		gap: 5rem;
		align-items: start;
		max-width: 36rem;
	}

	.join-grid > :nth-child(1) {
		grid-area: newsletter;
	}

	.join-grid > :nth-child(2) {
		grid-area: contact;
	}

	.join-grid > :nth-child(3) {
		grid-area: careers;
	}

	.join-block {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.join-block h3 {
		font-family: var(--main-font);
		font-weight: 200;
		font-size: var(--text-sub);
		color: #1a1a1a;
		margin-bottom: 0.25rem;
	}

	.join-block > p {
		text-align: left;
		text-align-last: left;
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: var(--text-body);
		line-height: 1.7;
		color: #6b6b6b;
		margin-bottom: 1rem;
	}

	.careers .quiet-link {
		margin-top: 0;
	}

	.join-block .sent {
		color: #1a1a1a;
	}

	.inline-field {
		display: flex;
		gap: 0.75rem;
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
		margin-top: 0.5rem;
	}






	/* Quote */
	.quote {
		min-height: 100vh;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 8vw;
	}

	.plan-link {
		margin-top: 1rem;
	}

	.quote blockquote {
		max-width: 42vw;
	}

	.quote p {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: var(--text-quote);
		line-height: 1.15;
		letter-spacing: -0.01em;
		color: #1a1a1a;
		margin-bottom: 2rem;
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
		/* Phones: the blocks hold the top third; text scrolls below it. */
		.story {
			padding-top: 34svh;
			padding-bottom: 8svh;
		}
		section {
			padding-right: 1.5rem !important;
		}
		.statement {
			min-height: 75vh;
			min-height: 75svh;
			padding: 0 1.5rem;
		}
		.statement h2 {
			margin-bottom: 1.1rem;
		}
		.statement .quiet-link {
			margin-top: 1.5rem;
		}
		.resource {
			min-height: 75vh;
			min-height: 75svh;
			padding: 0 1.5rem;
		}
		.join {
			padding: 12vh 1.5rem;
		}
		.portal {
			min-height: 75vh;
			min-height: 75svh;
		}
		.resource-title {
			margin-bottom: 2.5rem;
		}
		.inline-field {
			flex-direction: column;
		}
		.quote {
			min-height: 75vh;
			min-height: 75svh;
			padding: 0 1.5rem;
		}
		.quote blockquote {
			max-width: none;
		}
	}
</style>
