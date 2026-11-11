<script lang="ts">
	import { onMount } from 'svelte';
	import PageSubnav from '$lib/PageSubnav.svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>terms and conditions - reagent systems</title>
	<meta name="title" content="terms and conditions - reagent systems" />
	<meta name="description" content="Terms and conditions for using reagent-systems.com." />
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="terms-page" class:mounted>
	<div class="terms-header">
		<h1 class="terms-title">terms and conditions</h1>
		<p class="terms-updated">Last updated: November 7, 2026</p>
	</div>

	<div class="terms-content">
		<section class="terms-section">
			<h2>1. Agreement to These Terms</h2>
			<p>
				These Terms and Conditions (the “Terms”) govern your access to and use of <a href="https://reagent-systems.com">reagent-systems.com</a> and any pages, content, forms, and features we make available through it (together, the “Site”), operated by reagent systems and its subsidiaries reagent matter, reagent defense, reagent logistics, reagent capital, reagent research, and reagent creative (“we,” “us,” or “our”). By accessing or using the Site, you agree to be bound by these Terms and by our <a href="/privacy">Privacy Statement</a>. If you do not agree, do not use the Site.
			</p>
		</section>

		<section class="terms-section">
			<h2>2. Eligibility</h2>
			<p>
				You must be at least 13 years old to use the Site. If you use the Site on behalf of a company or other organization, you represent that you have authority to bind that organization to these Terms, and “you” refers to that organization.
			</p>
		</section>

		<section class="terms-section">
			<h2>3. Use of the Site</h2>
			<p>
				You may use the Site for lawful, informational purposes. You agree not to:</p>
			<ul>
				<li>Use the Site in violation of any applicable law or regulation</li>
				<li>Attempt to gain unauthorized access to the Site, its servers, or any connected system or network</li>
				<li>Interfere with or disrupt the Site, including by introducing malware or placing an unreasonable load on our infrastructure</li>
				<li>Scrape, harvest, or collect data from the Site by automated means except as permitted by our robots.txt file</li>
				<li>Impersonate any person or organization, or misrepresent your affiliation with any person or organization</li>
				<li>Submit false, misleading, or unlawful information through any form on the Site</li>
			</ul>
			<p>We may suspend or restrict access to the Site at any time, without notice, if we believe you have violated these Terms.
			</p>
		</section>

		<section class="terms-section">
			<h2>4. Information and No Offer</h2>
			<p>
				Content on the Site, including descriptions of our companies, programs, research, and news, is provided for general information only. Nothing on the Site is an offer to sell, or a solicitation of an offer to buy, any security, investment, or financial product, and nothing on the Site is legal, tax, financial, or investment advice. Any engagement with reagent systems or any of its subsidiaries is governed solely by a separate written agreement signed by the parties.
			</p>
		</section>

		<section class="terms-section">
			<h2>5. Submissions</h2>
			<p>
				When you contact us, subscribe to our newsletter, or otherwise send us information through the Site, you represent that the information is accurate and that you have the right to share it. Do not send confidential or proprietary information through the Site unless we have first agreed in writing to receive it on a confidential basis. Unless a separate written agreement says otherwise, we are not obligated to keep unsolicited ideas, proposals, or materials confidential, and we may use them without obligation to you. Our handling of personal information is described in our <a href="/privacy">Privacy Statement</a>.
			</p>
		</section>

		<section class="terms-section">
			<h2>6. Intellectual Property</h2>
			<p>
				The Site and its content, including text, graphics, artwork, logos, the names reagent systems, reagent matter, reagent defense, reagent logistics, reagent capital, reagent research, and reagent creative, and the design, selection, and arrangement of the Site, are owned by us or our licensors and are protected by copyright, trademark, and other laws. We grant you a limited, non-exclusive, non-transferable, revocable license to view and use the Site for your personal or internal business purposes. You may not copy, modify, distribute, sell, or create derivative works from the Site or its content without our prior written permission, except as permitted by law. Third-party names and logos shown on the Site belong to their respective owners, and their display does not imply endorsement beyond the relationship described.
			</p>
		</section>

		<section class="terms-section">
			<h2>7. Third-Party Links and Services</h2>
			<p>
				The Site links to websites and services we do not control, including GitHub, X (Twitter), and Discord, and to services we operate under their own terms, such as Spark at <a href="https://spark.reagent-systems.com">spark.reagent-systems.com</a>. Your use of any linked site or service is governed by that site's or service's own terms and policies. We are not responsible for the content, availability, or practices of third-party sites and services.
			</p>
		</section>

		<section class="terms-section">
			<h2>8. Disclaimer of Warranties</h2>
			<p>
				THE SITE AND ALL CONTENT ARE PROVIDED “AS IS” AND “AS AVAILABLE,” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT ANY CONTENT, INCLUDING STATISTICS AND THIRD-PARTY DATA, IS ACCURATE, COMPLETE, OR CURRENT.
			</p>
		</section>

		<section class="terms-section">
			<h2>9. Limitation of Liability</h2>
			<p>
				TO THE FULLEST EXTENT PERMITTED BY LAW, REAGENT SYSTEMS, ITS SUBSIDIARIES, AND THEIR OFFICERS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL, ARISING OUT OF OR RELATING TO YOUR USE OF OR INABILITY TO USE THE SITE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THE SITE OR THESE TERMS WILL NOT EXCEED ONE HUNDRED U.S. DOLLARS (US $100). SOME JURISDICTIONS DO NOT ALLOW THESE LIMITATIONS, SO SOME OF THEM MAY NOT APPLY TO YOU.
			</p>
		</section>

		<section class="terms-section">
			<h2>10. Indemnification</h2>
			<p>
				You agree to indemnify and hold harmless reagent systems, its subsidiaries, and their officers, employees, and agents from any claims, damages, losses, liabilities, and expenses, including reasonable attorneys' fees, arising out of your use of the Site, your violation of these Terms, or your violation of any rights of another person or organization.
			</p>
		</section>

		<section class="terms-section">
			<h2>11. Governing Law and Disputes</h2>
			<p>
				These Terms are governed by the laws of the State of Florida and the federal laws of the United States, without regard to conflict-of-law principles. Any dispute arising out of or relating to these Terms or the Site will be brought exclusively in the state or federal courts located in Hillsborough County, Florida, and you consent to the personal jurisdiction of those courts.
			</p>
		</section>

		<section class="terms-section">
			<h2>12. Changes to These Terms</h2>
			<p>
				We may update these Terms from time to time. We will post the updated version on this page and update the “Last updated” date. Your continued use of the Site after changes are posted constitutes your acceptance of the revised Terms.
			</p>
		</section>

		<section class="terms-section">
			<h2>13. General</h2>
			<p>
				If any provision of these Terms is found unenforceable, the remaining provisions will remain in full effect. Our failure to enforce any provision is not a waiver of our right to do so later. These Terms, together with our Privacy Statement, are the entire agreement between you and us regarding the Site, and they supersede any prior agreements on that subject. You may not assign these Terms without our consent; we may assign them in connection with a merger, acquisition, or sale of assets.
			</p>
		</section>

		<section class="terms-section">
			<h2>14. Contact Us</h2>
			<p>
				If you have questions about these Terms, you may contact us at:
			</p>
			<p class="terms-contact">
				reagent systems<br />
				10523 Bermuda Isle Dr<br />
				Tampa, Florida 33647<br />
				<a href="mailto:support@reagent-systems.com">support@reagent-systems.com</a>
			</p>
		</section>
	</div>

	<PageSubnav />
</div>

<style>
	.terms-page {
		min-height: 100vh;
		padding: 4rem 4rem 4rem 8rem;
		opacity: 0;
		transition: opacity 0.4s ease;
		display: flex;
		flex-direction: column;
	}

	.terms-page.mounted {
		opacity: 1;
	}

	.terms-header {
		margin-bottom: 3rem;
	}

	.terms-title {
		font-size: 4rem;
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: -0.02em;
		margin: 0 0 0.5rem 0;
		font-family: var(--main-font);
	}

	.terms-updated {
		font-size: 1rem;
		font-weight: 300;
		color: #6b6b6b;
		margin: 0;
		font-family: var(--main-font);
	}

	.terms-content {
		max-width: 720px;
		margin-bottom: 4rem;
	}

	.terms-section {
		margin-bottom: 2.5rem;
	}

	.terms-section h2 {
		font-size: 1.5rem;
		font-weight: 300;
		color: #1a1a1a;
		text-transform: lowercase;
		margin: 0 0 1rem 0;
		font-family: var(--main-font);
	}

	.terms-section p,
	.terms-section ul {
		font-size: 1.125rem;
		font-weight: 300;
		color: #1a1a1a;
		line-height: 1.7;
		margin: 0 0 1rem 0;
		font-family: var(--main-font);
	}

	.terms-section ul {
		list-style: none;
		padding-left: 0;
	}

	.terms-section a {
		white-space: nowrap;
	}

	.terms-section li {
		margin-bottom: 0.5rem;
	}

	.terms-section a {
		color: #1a1a1a;
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 0.2s ease;
	}

	.terms-section a:hover {
		color: #6b6b6b;
	}

	.terms-contact {
		margin-top: 0.5rem;
	}

	@media (max-width: 768px) {
		.terms-page {
			padding: 2rem;
		}

		.terms-title {
			font-size: 2.5rem;
		}

		.terms-section h2 {
			font-size: 1.25rem;
		}

		.terms-section p,
		.terms-section ul {
			font-size: 1rem;
		}
	}
</style>
