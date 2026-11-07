<script lang="ts">
	import IsoField from './IsoField.svelte';
	import { COMPANIES } from './companies';

	type Statement = { title: string; body: string; link?: { href: string; label: string } };

	// Mission, then how we work, then why.
	const statements: Statement[] = [
		{
			title: 'build what builders need.',
			body: 'reagent systems was founded out of necessity. every founder meets problems no one warned them about, and none of them should decide whether a company survives. so we brought the knowledge, the resources, and the capital into one place, for any early-stage founder who needs them. we have been where you are. helping founders is our favorite place to be.'
		},
		{
			title: 'it starts with a conversation.',
			body: 'we sit down with every founder to hear what they are building and what is in the way. then we measure where the company truly stands, its technology and manufacturing readiness, so the constraints ahead are clear before they arrive.'
		},
		{
			title: 'then we build alongside you.',
			body: 'we work as partners against those constraints until the company is ready to raise. when it is, we bring it to our investor network.'
		},
		{
			title: 'no equity. no cut.',
			body: 'when we do the work, in engineering, management, marketing, development, or administration, we are paid for that work. we take no equity, no profit share, and no percentage of any introduction. a cut of the raise slows a company down. we would rather see it move.'
		},
		{
			title: 'we pay it forward.',
			body: 'we have been where every founder is: heads down, too close to see the mistakes. what carried us was other founders who reached out and helped. now we do the same.',
			link: { href: '/community', label: 'meet the community' }
		},
		{
			title: 'a modern bell labs.',
			body: 'we want a defense industrial base and a supply chain secured for decades to come. we want to pay people to chase the breakthroughs they believe in. if the only thing standing between someone and the next frontier is our help, we will help.'
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

	const researchItems = [
		{
			name: 'dandelion',
			line: 'neuro-symbolic prototypes built close to the hardware.',
			image: '/research-images/dandelion.png'
		},
		{
			name: 'simple-agent-core',
			line: 'a minimal agent framework with tools that load on demand.',
			image: '/research-images/simple-agent-core.png'
		},
		{
			name: 'phone-agent',
			line: 'an agent stack for work that starts with a phone call.',
			image: '/research-images/phone-agent.png'
		},
		{
			name: 'bently coder 7b',
			line: 'an open coding model tuned on real repositories.',
			image: '/research-images/bently-coder-7b.png'
		}
	];

	// Placeholder articles until the blog is live.
	const articles = [
		{
			title: 'why we build in the open',
			excerpt: 'open work compounds. every release is a foundation someone else can stand on.',
			href: '/blog'
		},
		{
			title: 'small models, real work',
			excerpt: 'what a seven billion parameter model can do when it is trained on the right things.',
			href: '/blog'
		},
		{
			title: 'from idea to company',
			excerpt: 'the first months decide most of what follows. a note on getting them right.',
			href: '/blog'
		}
	];

	let newsletterEmail = $state('');
	let newsletterSent = $state(false);

	let contactCompany = $state(COMPANIES[0].slug);
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

<div class="story">
	<IsoField {anchors} />

	{#each statements as statement, i}
		<section class="statement" bind:this={statementEls[i]}>
			<div class="statement-copy">
				<h2>{statement.title}</h2>
				<p>{statement.body}</p>
				{#if statement.link}
					<a class="quiet-link" href={statement.link.href}>{statement.link.label}</a>
				{/if}
			</div>
		</section>
	{/each}

	<section class="resource" bind:this={research}>
		<h2 class="resource-title">research</h2>
		<ul class="card-row four">
			{#each researchItems as item}
				<li>
					<a class="card" href="/research">
						<div class="card-image square">
							<img src={item.image} alt="" loading="lazy" />
						</div>
						<span class="card-name">{item.name}</span>
						<span class="card-line">{item.line}</span>
					</a>
				</li>
			{/each}
		</ul>
		<a class="quiet-link" href="/research">all research</a>
	</section>

	<section class="resource" bind:this={writing}>
		<h2 class="resource-title">writing</h2>
		<ul class="articles">
			{#each articles as article}
				<li>
					<a class="article" href={article.href}>
						<span class="article-title">{article.title}</span>
						<span class="article-excerpt">{article.excerpt}</span>
					</a>
				</li>
			{/each}
		</ul>
		<a class="quiet-link" href="/blog">all writing</a>
	</section>

	<section class="resource portal" bind:this={portal}>
		<h2 class="resource-title">portal</h2>
		<p class="portal-line">ask the factory anything.</p>
		<a class="quiet-link" href="/portal">enter the portal</a>
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
				<h3>talk to a company</h3>
				{#if contactSent}
					<p class="sent">thank you. we will be in touch.</p>
				{:else}
					<div class="choices" role="radiogroup" aria-label="company">
						{#each COMPANIES as company}
							<label class="choice" class:active={contactCompany === company.slug}>
								<input
									type="radio"
									name="company"
									value={company.slug}
									bind:group={contactCompany}
								/>
								{company.name}
							</label>
						{/each}
					</div>
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
		font-size: clamp(2.75rem, 5.2vw, 5.25rem);
		line-height: 1.02;
		letter-spacing: -0.02em;
		color: #1a1a1a;
		margin-bottom: 2rem;
	}

	.statement p {
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: clamp(1.1rem, 1.35vw, 1.35rem);
		line-height: 1.7;
		color: #5f5f5f;
		max-width: 30rem;
	}

	/* Research, writing, portal */
	.resource {
		padding: 22vh 8vw;
	}

	.resource-title {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: clamp(3rem, 6vw, 6rem);
		letter-spacing: -0.02em;
		line-height: 1;
		color: #1a1a1a;
		margin-bottom: 4.5rem;
	}

	.card-row {
		list-style: none;
		display: grid;
		gap: 3rem 2.5rem;
	}

	.card-row.four {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: inherit;
	}

	.card-image {
		border-radius: 20px;
		overflow: hidden;
		background: #ececec;
		margin-bottom: 1.5rem;
	}

	.card-image.square {
		aspect-ratio: 1;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: opacity 0.4s ease;
	}

	.card:hover .card-image img {
		opacity: 0.88;
	}

	.card-name {
		font-family: var(--main-font);
		font-weight: 300;
		font-size: 1.6rem;
		color: #1a1a1a;
		margin-bottom: 0.5rem;
	}

	.card-line {
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: 1.05rem;
		line-height: 1.6;
		color: #6b6b6b;
	}

	.articles {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 3.5rem;
		max-width: 52rem;
	}

	.article {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		text-decoration: none;
	}

	.article-title {
		font-family: var(--main-font);
		font-weight: 200;
		font-size: clamp(1.8rem, 2.8vw, 2.6rem);
		line-height: 1.15;
		color: #1a1a1a;
		transition: color 0.3s ease;
	}

	.article:hover .article-title {
		color: #6b6b6b;
	}

	.article-excerpt {
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: 1.1rem;
		line-height: 1.7;
		color: #6b6b6b;
	}

	.quiet-link {
		display: inline-block;
		margin-top: 4rem;
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: 1.15rem;
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
		margin-bottom: 2rem;
	}

	.portal-line {
		font-family: var(--main-font);
		font-weight: 200;
		font-size: clamp(1.8rem, 2.8vw, 2.6rem);
		line-height: 1.15;
		color: #1a1a1a;
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
		font-size: 2.2rem;
		color: #1a1a1a;
		margin-bottom: 0.25rem;
	}

	.join-block > p {
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: 1.1rem;
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
		font-size: 1.1rem;
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
		font-size: 1.1rem;
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

	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin-bottom: 0.75rem;
	}

	.choice {
		font-family: 'Raleway Variable', var(--main-font);
		font-weight: 300;
		font-size: 1.05rem;
		color: #6b6b6b;
		background: #efefef;
		border-radius: 999px;
		padding: 0.55rem 1.1rem;
		cursor: pointer;
		transition:
			background 0.3s ease,
			color 0.3s ease;
	}

	.choice input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
		pointer-events: none;
	}

	.choice.active {
		background: #1a1a1a;
		color: #fafafa;
	}

	.choice:has(input:focus-visible) {
		outline: 2px solid #1a1a1a;
		outline-offset: 2px;
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
		max-width: 40rem;
	}

	.quote p {
		font-family: var(--main-font);
		font-weight: 100;
		font-size: clamp(2rem, 3.6vw, 3.8rem);
		line-height: 1.12;
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

	@media (max-width: 1024px) {
		.card-row.four {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 768px) {
		/* Phones: text scrolls in the top half; the blocks hold the bottom half. */
		.story {
			padding-bottom: 50svh;
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
			font-size: 2.4rem;
			margin-bottom: 1.1rem;
		}
		.statement p {
			font-size: 1.02rem;
			line-height: 1.65;
		}
		.statement .quiet-link {
			margin-top: 1.5rem;
		}
		.resource,
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
		.card-row.four {
			gap: 2.5rem 1.25rem;
		}
		.card-name {
			font-size: 1.3rem;
		}
		.card-line {
			font-size: 0.98rem;
		}
		.inline-field {
			flex-direction: column;
		}
		.quote {
			min-height: 75vh;
			min-height: 75svh;
			padding: 0 1.5rem;
		}
	}
</style>
