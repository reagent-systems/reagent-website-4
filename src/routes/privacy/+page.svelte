<script lang="ts">
	import { onMount } from 'svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>privacy - reagent systems</title>
	<meta name="title" content="privacy - reagent systems" />
	<meta name="description" content="Privacy statement for reagent.systems. How we collect, use, and protect your information." />
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="privacy-page" class:mounted>
	<div class="privacy-header">
		<h1 class="privacy-title">privacy statement</h1>
		<p class="privacy-updated">Last updated: January 28, 2026</p>
	</div>

	<div class="privacy-content">
		<section class="privacy-section">
			<h2>1. Introduction</h2>
			<p>
				reagent systems (“we,” “us,” or “our”) operates the website <a href="https://reagent.systems">reagent.systems</a> (the “Site”). This Privacy Statement describes how we collect, use, and disclose information when you visit the Site. We do not sell your personal information.
			</p>
		</section>

		<section class="privacy-section">
			<h2>2. Information We Collect</h2>
			<p>
				<strong>Information collected automatically.</strong> When you access the Site, our hosting infrastructure may automatically collect certain technical information, such as your IP address, browser type, operating system, referring URLs, pages viewed, and the date and time of your visit. This information is commonly collected by web servers and may be stored in server logs. We use this information to operate the Site, ensure security, and troubleshoot technical issues.
			</p>
			<p>
				<strong>Information you provide.</strong> The Site does not require you to create an account or submit personal information to view content. If you contact us by email (for example, at support@reagent-systems.com), we will receive whatever information you include in your message. We use that information only to respond to your inquiry.
			</p>
		</section>

		<section class="privacy-section">
			<h2>3. How We Use Information</h2>
			<p>
				We use the information described above to:
			</p>
			<ul>
				<li>Provide, maintain, and improve the Site</li>
				<li>Respond to your communications</li>
				<li>Protect against misuse or unauthorized access</li>
				<li>Comply with applicable law</li>
			</ul>
		</section>

		<section class="privacy-section">
			<h2>4. Cookies and Similar Technologies</h2>
			<p>
				The Site does not use cookies or similar technologies for advertising or tracking. Our Site may use minimal technical cookies (for example, to support routing or session state) that are strictly necessary for the Site to function. We do not use third-party analytics or advertising cookies on this Site.
			</p>
		</section>

		<section class="privacy-section">
			<h2>5. Third-Party Links and Services</h2>
			<p>
				The Site contains links to third-party websites and services (such as GitHub, X (Twitter), and Discord). When you follow those links, you leave our Site and are subject to the privacy policies and terms of those third parties. We do not control and are not responsible for their practices. We encourage you to read their privacy policies before providing any information.
			</p>
		</section>

		<section class="privacy-section">
			<h2>6. Data Retention</h2>
			<p>
				We retain server logs and similar technical data only as long as necessary for the purposes described in this statement or as required by law. Email correspondence is retained only as long as needed to respond and for our records.
			</p>
		</section>

		<section class="privacy-section">
			<h2>7. Data Security</h2>
			<p>
				We take reasonable steps to protect the information we hold from unauthorized access, alteration, or destruction. No method of transmission or storage over the Internet is completely secure; we cannot guarantee absolute security.
			</p>
		</section>

		<section class="privacy-section">
			<h2>8. Your Rights and Choices</h2>
			<p>
				Depending on where you live, you may have rights to access, correct, or delete personal information we hold about you, or to object to or restrict certain processing. Because we collect minimal personal information (such as server logs and any information you send by email), the data we hold is limited. To exercise your rights or ask questions about your information, contact us at <a href="mailto:support@reagent-systems.com">support@reagent-systems.com</a>.
			</p>
			<p>
				If you are in the European Economic Area, you may also have the right to lodge a complaint with a supervisory authority. If you are in California, we do not sell personal information as defined under the California Consumer Privacy Act (CCPA).
			</p>
		</section>

		<section class="privacy-section">
			<h2>9. Children</h2>
			<p>
				The Site is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us and we will take steps to delete it.
			</p>
		</section>

		<section class="privacy-section">
			<h2>10. International Visitors</h2>
			<p>
				The Site is operated from the United States. If you access the Site from outside the United States, your information may be transferred to, stored, or processed in the United States or other countries where our service providers operate. By using the Site, you consent to such transfer and processing.
			</p>
		</section>

		<section class="privacy-section">
			<h2>11. Changes to This Privacy Statement</h2>
			<p>
				We may update this Privacy Statement from time to time. We will post the updated version on this page and update the “Last updated” date. Your continued use of the Site after changes are posted constitutes your acceptance of the revised statement. We encourage you to review this page periodically.
			</p>
		</section>

		<section class="privacy-section">
			<h2>12. Contact Us</h2>
			<p>
				If you have questions about this Privacy Statement or our practices, you may contact us at:
			</p>
			<p class="privacy-contact">
				reagent systems<br />
				<a href="mailto:support@reagent-systems.com">support@reagent-systems.com</a>
			</p>
		</section>
	</div>

	<nav class="privacy-nav">
		<a href="/" class="nav-link">home</a>
		<a href="/research" class="nav-link">research</a>
		<a href="/products" class="nav-link">products</a>
		<a href="/community" class="nav-link">community</a>
	</nav>
</div>

<style>
	.privacy-page {
		min-height: 100vh;
		padding: 4rem 4rem 4rem 8rem;
		opacity: 0;
		transition: opacity 0.4s ease;
		display: flex;
		flex-direction: column;
	}

	.privacy-page.mounted {
		opacity: 1;
	}

	.privacy-header {
		margin-bottom: 3rem;
	}

	.privacy-title {
		font-size: 4rem;
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: -0.02em;
		margin: 0 0 0.5rem 0;
		font-family: var(--main-font);
	}

	.privacy-updated {
		font-size: 1rem;
		font-weight: 300;
		color: #6b6b6b;
		margin: 0;
		font-family: var(--main-font);
	}

	.privacy-content {
		max-width: 720px;
		margin-bottom: 4rem;
	}

	.privacy-section {
		margin-bottom: 2.5rem;
	}

	.privacy-section h2 {
		font-size: 1.5rem;
		font-weight: 300;
		color: #1a1a1a;
		text-transform: lowercase;
		margin: 0 0 1rem 0;
		font-family: var(--main-font);
	}

	.privacy-section p,
	.privacy-section ul {
		font-size: 1.125rem;
		font-weight: 300;
		color: #1a1a1a;
		line-height: 1.7;
		margin: 0 0 1rem 0;
		font-family: var(--main-font);
	}

	.privacy-section ul {
		padding-left: 1.5rem;
	}

	.privacy-section li {
		margin-bottom: 0.5rem;
	}

	.privacy-section a {
		color: #1a1a1a;
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 0.2s ease;
	}

	.privacy-section a:hover {
		color: #6b6b6b;
	}

	.privacy-contact {
		margin-top: 0.5rem;
	}

	.privacy-nav {
		display: flex;
		gap: 3rem;
		margin-top: auto;
	}

	.privacy-nav .nav-link {
		font-size: 1.5rem;
		font-weight: 300;
		color: #6b6b6b;
		background: none;
		text-decoration: none;
		text-transform: lowercase;
		letter-spacing: 0.05em;
		transition: color 0.3s ease;
		font-family: 'Raleway Variable', var(--main-font);
		position: relative;
	}

	.privacy-nav .nav-link::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 0;
		height: 1px;
		background-color: #6b6b6b;
		transform: translateX(-50%);
		transition: width 0.3s ease;
	}

	.privacy-nav .nav-link:hover {
		color: #000000;
	}

	.privacy-nav .nav-link:hover::after {
		width: 100%;
	}

	@media (max-width: 768px) {
		.privacy-page {
			padding: 2rem;
		}

		.privacy-title {
			font-size: 2.5rem;
		}

		.privacy-section h2 {
			font-size: 1.25rem;
		}

		.privacy-section p,
		.privacy-section ul {
			font-size: 1rem;
		}
	}
</style>
