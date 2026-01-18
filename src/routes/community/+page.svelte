<script lang="ts">
	import { onMount } from 'svelte';
	
	let mounted = $state(false);
	let animationId: number | null = null;
	let startTime = Date.now();
	let isDesktop = $state(false);
	const avatarOffsets = new Map<HTMLElement, number>();
	let expandedTitles = $state(new Set<number>());

	// Title abbreviations mapping
	const titleAbbreviations: Record<string, string> = {
		'chief of execution': 'CEO',
		'chief of technology': 'CTO',
		'chief of information': 'CIO',
		'chief of science': 'CSO',
		'chief of finance': 'CFO'
	};

	function toggleTitle(index: number) {
		const newSet = new Set(expandedTitles);
		if (newSet.has(index)) {
			newSet.delete(index);
		} else {
			newSet.add(index);
		}
		expandedTitles = newSet;
	}

	function getDisplayTitle(title: string, index: number): string {
		// Try exact match first, then case-insensitive match
		let abbreviation = titleAbbreviations[title];
		if (!abbreviation) {
			// Try case-insensitive lookup
			const lowerTitle = title.toLowerCase();
			for (const [key, value] of Object.entries(titleAbbreviations)) {
				if (key.toLowerCase() === lowerTitle) {
					abbreviation = value;
					break;
				}
			}
		}
		if (!abbreviation) return title;
		return expandedTitles.has(index) ? title : abbreviation;
	}

	// Animation parameters
	const maxRotation = 15; // Maximum rotation in degrees
	const animationSpeed = 0.0003; // Speed of rotation (adjust for faster/slower)
	const breathingSpeed = 0.0005; // Speed of breathing effect (slower than rotation)
	const breathingAmount = 0.05; // Amount of scale change (5% zoom in/out)
	const translationRadius = 10; // Radius of circular translation in pixels

	function initializeAvatarOffsets() {
		const avatars = document.querySelectorAll('.member-avatar');
		avatars.forEach((avatar) => {
			const htmlAvatar = avatar as HTMLElement;
			// Generate random offset between 0 and 1 for each avatar
			if (!avatarOffsets.has(htmlAvatar)) {
				avatarOffsets.set(htmlAvatar, Math.random());
			}
		});
	}

	function animate() {
		if (!isDesktop || !mounted) {
			animationId = requestAnimationFrame(animate);
			return;
		}

		const baseElapsed = (Date.now() - startTime) * animationSpeed;
		const baseBreathingElapsed = (Date.now() - startTime) * breathingSpeed;
		
		// Apply transform to all avatars with their individual offsets
		const avatars = document.querySelectorAll('.member-avatar');
		if (avatars.length > 0) {
			avatars.forEach((avatar) => {
				const htmlAvatar = avatar as HTMLElement;
				const offset = avatarOffsets.get(htmlAvatar) || 0;
				
				// Apply offset to elapsed time (multiply by 2π to get full cycle)
				const elapsed = baseElapsed + (offset * Math.PI * 2);
				const breathingElapsed = baseBreathingElapsed + (offset * Math.PI * 2);
				
				// Use sine and cosine for smooth circular motion (clockwise)
				const rotateX = Math.sin(-elapsed) * maxRotation;
				const rotateY = Math.cos(-elapsed) * maxRotation;
				
				// Breathing effect - slow zoom in and out
				const scale = 1 + Math.sin(breathingElapsed) * breathingAmount;
				
				// Circular translation
				const translateX = Math.cos(-elapsed) * translationRadius;
				const translateY = Math.sin(-elapsed) * translationRadius;
				
				htmlAvatar.style.transform = 
					`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale}) translate(${translateX}px, ${translateY}px)`;
				htmlAvatar.style.transition = 'opacity 0.6s ease';
			});
		}
		
		animationId = requestAnimationFrame(animate);
	}

	function checkDesktop() {
		const wasDesktop = isDesktop;
		isDesktop = window.innerWidth > 1051;
		// Restart animation if desktop status changed
		if (wasDesktop !== isDesktop && mounted) {
			startTime = Date.now();
		}
	}

	const teamMembers = [
		{
			name: 'Kyle Steel',
			alias: 'ThyFriendlyFox',
			title: 'chief of execution',
			age: 27,
			location: 'Florida',
			bio: 'I graduated from Florida Polytechnic University with a Masters of Engineering in 2022 with a thesis focused on using Fourier-based machine learning techniques to calculate nonlinear physics systems with greater precision and speed on an Arduino running a custom algorithm than the available university supercomputer running Ansys Mechanical. My passion has always been in Artificial Intelligence, and I even led the research and development team for AutoGPT for a short period of time, unlocking the possibility of truly multi-agent systems. Since graduating, I\'ve been an ITAR and CMMC compliance system administrator. Most of my work has been developing a CMMC compliant ERP system for the manufacturing industry. I\'m a self-taught software developer and system admin with experience running businesses for a number of years now.',
			github: 'thyfriendlyfox'
		},
		{
			name: 'Ethan Shelton',
			alias: 'Spike',
			title: 'chief of information',
			age: 25,
			location: 'Florida',
			bio: 'Hello, I\'m Spike! I\'ve been coding since I was 13, diving into mods, mobile games, VR experiences, websites, AWS, and software development. I thrive on the challenge, the puzzles, and the fun of piecing it all together. Currently, I\'m focusing on my vlogging and VR YouTube channels and crafting my own AI assistant named KIT. This is only the beginning to my story of relentless creation.',
			github: 'IronLeprechaun'
		},
		{
			name: 'BentlyBro',
			alias: 'bently',
			title: 'chief of technology',
			bio: 'Hey, I\'m Bently — a self-taught developer, systems tinkerer, and all-around builder with a love for pushing boundaries. Whether it\'s designing encrypted chat platforms, wiring up brain-computer interfaces, or spinning up AI agents that talk to each other, I\'m always crafting something weird, useful, or both. My portfolio (which totally needs an update) showcases a mix of tools like Promptly—a live website builder powered by natural language—and NoteNavigator, an AI music recommender that ran a little too close to Spotify\'s sun. As the community lead and developer behind AutoGPT, I balance hands-on coding with leading a vibrant Discord full of chaotic brilliance. Most days you\'ll find me deep in Python, JavaScript, or building cross-device systems that just sync. Other days, I\'m designing VR worlds, experimenting with EEG data, or mapping out new ways to bring decentralized, real-time tech to life. Welcome to my world—it\'s a bit experimental, often chaotic, but always driven by curiosity.',
			github: 'Bentlybro'
		},
		{
			name: 'Colton Frear',
			alias: 'COWTEAH',
			title: 'chief of finance',
			location: 'Florida',
			bio: 'My name is Colton Frear, I graduated from Florida Polytechnic University with a Masters in Mechanical Engineering. My first job out of college was as a Liaison Engineer for General Dynamics Electric Boat In Newport News Virginia. While at Electric Boat I provided engineering support on the Virginia Class Nuclear Submarine program for NAVSEA. After a short time there, I moved to Palmdale California to work for Northrop Grumman Aeronautics Systems. During my time with these prime contractors I have become intimately familiar with DoD program requirements and expectations as well as improving my general technical and engineering knowledge.',
			customAvatar: '/profile-pictures/cowteah.png'
		},
		{
			name: 'Alexey Kuznetsov',
			alias: 'what',
			title: 'chief of science',
			age: 25,
			location: 'Lakeland, Florida',
			bio: 'I graduated from Florida Polytechnic University with a Bachelor\'s in Computer Science focused on cybersecurity in 2022, followed by my Master\'s in 2024, with plans to complete a Master\'s in Data Science by 2028. My biggest achievement has been co-developing Dynamo, a comprehensive all-in-one system built from scratch to run machine shops of any size, using JavaScript, HTML, Python, and PowerShell scripts. What started as a challenge to modernize manufacturing operations has grown into a full-scale platform that I continue to maintain today. My mix of formal education and self-taught skills has shaped me into a versatile problem-solver who thrives on building practical solutions. I bring my cybersecurity background and hands-on development experience to tackle whatever unconventional challenges come my way. Whether it\'s maintaining enterprise systems or exploring new technologies, I\'m driven by the satisfaction of creating tools that actually make a difference.',
			github: 'AlexeyAKuznetsov'
		}
	];

	onMount(() => {
		mounted = true;
		checkDesktop();
		startTime = Date.now();
		// Start animation after a small delay to ensure DOM is ready
		setTimeout(() => {
			initializeAvatarOffsets();
			animate();
		}, 100);
		window.addEventListener('resize', checkDesktop);
		
		return () => {
			if (animationId !== null) {
				cancelAnimationFrame(animationId);
			}
			window.removeEventListener('resize', checkDesktop);
			avatarOffsets.clear();
		};
	});
</script>

<svelte:head>
	<title>community - reagent systems</title>
</svelte:head>

<div class="community-page" class:mounted>
	<div class="community-header">
		<h1 class="community-title">community</h1>
	</div>
	
	<!-- Desktop Layout -->
	<div class="team-container team-container-desktop">
		{#each teamMembers as member, index}
			<div class="member-content">
				<div class="member-name-row">
					<h2 class="member-name">{member.name}</h2>
					{#if member.alias}
						<p class="member-alias">{member.alias}</p>
					{/if}
				</div>
				<p class="member-title">{member.title}</p>
				{#if member.github}
					<a href="https://github.com/{member.github}" target="_blank" rel="noopener noreferrer" class="member-github">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
						</svg>
						{member.github}
					</a>
				{/if}
				<p class="member-bio">{member.bio}</p>
			</div>
			{#if member.customAvatar}
				<div class="member-avatar">
					<img 
						src={member.customAvatar} 
						alt="{member.name} profile picture"
						loading="lazy"
					/>
				</div>
			{:else if member.github}
				<div class="member-avatar">
					<img 
						src="https://github.com/{member.github}.png" 
						alt="{member.name} profile picture"
						loading="lazy"
					/>
				</div>
			{:else}
				<div class="member-avatar-placeholder"></div>
			{/if}
		{/each}
	</div>

	<!-- Mobile Layout -->
	<div class="team-container team-container-mobile">
		{#each teamMembers as member, index}
			<!-- Odd rows: Avatar in col 1, Header in col 2 -->
			{#if member.customAvatar}
				<div class="mobile-member-avatar mobile-avatar-{index}">
					<img 
						src={member.customAvatar} 
						alt="{member.name} profile picture"
						loading="lazy"
					/>
				</div>
			{:else if member.github}
				<div class="mobile-member-avatar mobile-avatar-{index}">
					<img 
						src="https://github.com/{member.github}.png" 
						alt="{member.name} profile picture"
						loading="lazy"
					/>
				</div>
			{:else}
				<div class="mobile-member-avatar-placeholder mobile-avatar-{index}"></div>
			{/if}
			<div class="mobile-member-header mobile-header-{index}">
				<div class="member-name-row">
					<h2 class="member-name">{member.name}</h2>
					{#if member.alias}
						<p class="member-alias">{member.alias}</p>
					{/if}
				</div>
				<span 
					class="member-title mobile-title-clickable" 
					onclick={() => toggleTitle(index)}
					onkeydown={(e) => e.key === 'Enter' && toggleTitle(index)}
					role="button"
					tabindex="0"
				>{getDisplayTitle(member.title, index)}</span>
			</div>
			<!-- Even rows: Bio spans both columns -->
			<div class="mobile-member-bio mobile-bio-{index}">
				{#if member.github}
					<a href="https://github.com/{member.github}" target="_blank" rel="noopener noreferrer" class="member-github">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
						</svg>
						{member.github}
					</a>
				{/if}
				<p class="member-bio">{member.bio}</p>
			</div>
		{/each}
	</div>

	<div class="social-section">
		<div class="social-icons">
			<a href="https://x.com/Reagent_Systems" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="x">
				<img src="/social-icons/x_logo.svg" alt="X" width="24" height="24" />
			</a>
			<a href="https://discord.gg/reagent" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="discord">
				<img src="/social-icons/Discord-Symbol-White.svg" alt="Discord" width="24" height="24" />
			</a>
		</div>
	</div>

	<nav class="community-nav">
		<a href="/" class="nav-link">home</a>
		<a href="/research" class="nav-link">research</a>
		<a href="/products" class="nav-link">products</a>
	</nav>
</div>

<style>
	.community-page {
		min-height: 100vh;
		padding: 4rem 4rem 4rem 8rem;
		opacity: 0;
		transition: opacity 0.4s ease;
		display: flex;
		flex-direction: column;
	}

	.community-page.mounted {
		opacity: 1;
	}

	.community-header {
		margin-bottom: 6rem;
	}

	.community-title {
		font-size: 6rem;
		font-weight: 100;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: -0.02em;
		margin: 0;
		font-family: var(--main-font);
	}

	.team-container-desktop {
		display: grid;
		grid-template-columns: 50vw 1fr;
		gap: 2rem 4rem;
		margin-bottom: 6rem;
		max-width: 100%;
		width: 100%;
	}

	.team-container-mobile {
		display: none;
	}

	.community-page.mounted .member-content:nth-child(1) {
		transition-delay: 0.1s;
		opacity: 1;
		transform: translateX(0);
	}

	.community-page.mounted .member-avatar:nth-child(2),
	.community-page.mounted .member-avatar-placeholder:nth-child(2) {
		transition-delay: 0.1s;
		opacity: 1;
	}

	.community-page.mounted .member-content:nth-child(3) {
		transition-delay: 0.2s;
		opacity: 1;
		transform: translateX(0);
	}

	.community-page.mounted .member-avatar:nth-child(4),
	.community-page.mounted .member-avatar-placeholder:nth-child(4) {
		transition-delay: 0.2s;
		opacity: 1;
	}

	.community-page.mounted .member-content:nth-child(5) {
		transition-delay: 0.3s;
		opacity: 1;
		transform: translateX(0);
	}

	.community-page.mounted .member-avatar:nth-child(6),
	.community-page.mounted .member-avatar-placeholder:nth-child(6) {
		transition-delay: 0.3s;
		opacity: 1;
	}

	.community-page.mounted .member-content:nth-child(7) {
		transition-delay: 0.4s;
		opacity: 1;
		transform: translateX(0);
	}

	.community-page.mounted .member-avatar:nth-child(8),
	.community-page.mounted .member-avatar-placeholder:nth-child(8) {
		transition-delay: 0.4s;
		opacity: 1;
	}

	.community-page.mounted .member-content:nth-child(9) {
		transition-delay: 0.5s;
		opacity: 1;
		transform: translateX(0);
	}

	.community-page.mounted .member-avatar:nth-child(10),
	.community-page.mounted .member-avatar-placeholder:nth-child(10) {
		transition-delay: 0.5s;
		opacity: 1;
	}

	.member-content {
		max-width: 100%;
	}

	.member-avatar {
		width: 300px;
		height: 300px;
		border-radius: 50%;
		overflow: hidden;
		align-self: center;
		justify-self: center;
		transform-style: preserve-3d;
		will-change: transform;
		transition: opacity 0.6s ease;
		opacity: 0;
	}

	@media (min-width: 769px) {
		.member-avatar {
			transition: opacity 0.6s ease;
		}
	}

	.member-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.member-avatar-placeholder {
		width: 300px;
		height: 300px;
		align-self: center;
		justify-self: center;
	}

	.member-name-row {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		margin-bottom: 0.25rem;
	}

	.member-name {
		font-size: 2.5rem;
		font-weight: 300;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: 0.02em;
		margin: 0;
		font-family: var(--main-font);
	}

	.member-alias {
		font-size: 2rem;
		font-weight: 300;
		color: #6b6b6b;
		text-transform: lowercase;
		letter-spacing: 0.02em;
		margin: 0;
		font-family: var(--main-font);
		font-style: italic;
	}

	.member-title {
		font-size: 2rem;
		font-weight: 300;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: 0.02em;
		margin: 0 0 0.25rem 0;
		font-family: var(--main-font);
	}

	.member-bio {
		font-size: 1.5rem;
		font-weight: 400;
		color: #4a4a4a;
		line-height: 1.8;
		margin: 1rem 0 0 0;
		font-family: var(--main-font);
		text-align: justify;
	}

	.member-github {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		font-size: 2rem;
		font-weight: 300;
		color: #6b6b6b;
		text-decoration: none;
		transition: color 0.3s ease;
		font-family: var(--main-font);
		margin: 0 0 2rem 0;
	}

	.member-github:hover {
		color: #1a1a1a;
	}

	.member-github svg {
		width: 24px;
		height: 24px;
	}

	.social-section {
		margin-bottom: 6rem;
		display: flex;
		justify-content: center;
	}

	.social-icons {
		display: flex;
		gap: 2rem;
		align-items: center;
		justify-content: center;
	}

	.social-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 160px;
		height: 160px;
		border-radius: 50%;
		background-color: #6b6b6b;
		transition: background-color 0.3s ease, transform 0.3s ease;
		text-decoration: none;
	}

	.social-icon img {
		width: 80px;
		height: 80px;
		object-fit: contain;
		filter: brightness(0) invert(1);
	}

	.social-icon:hover {
		background-color: #1a1a1a;
		transform: scale(1.1);
	}

	.community-nav {
		display: flex;
		gap: 3rem;
		margin-top: auto;
	}

	.community-nav .nav-link {
		font-size: 1.5rem;
		font-weight: 300;
		color: #6b6b6b;
		background: none;
		text-decoration: none;
		text-transform: lowercase;
		letter-spacing: 0.05em;
		transition: color 0.3s ease;
		font-family: 'Raleway Variable', var(--main-font);
		-webkit-background-clip: initial;
		background-clip: initial;
		position: relative;
	}

	.community-nav .nav-link::after {
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

	.community-nav .nav-link:hover {
		color: #000000;
	}

	.community-nav .nav-link:hover::after {
		width: 100%;
	}

	@media (max-width: 1051px) {
		.community-page {
			padding: 2rem;
		}

		.community-title {
			font-size: 4rem;
		}

		.team-container-desktop {
			display: none;
		}

		.team-container-mobile {
			display: grid;
			grid-template-columns: 150px 1fr;
			grid-template-rows: auto auto auto auto auto auto auto auto auto auto;
			grid-column-gap: 0px;
			grid-row-gap: 0px;
			margin-bottom: 6rem;
		}

		/* Odd rows: Avatar in col 1, Header in col 2 */
		.mobile-avatar-0 {
			grid-column: 1;
			grid-row: 1;
		}

		.mobile-header-0 {
			grid-column: 2;
			grid-row: 1;
		}

		.mobile-bio-0 {
			grid-column: 1 / -1;
			grid-row: 2;
		}

		.mobile-avatar-1 {
			grid-column: 1;
			grid-row: 3;
		}

		.mobile-header-1 {
			grid-column: 2;
			grid-row: 3;
		}

		.mobile-bio-1 {
			grid-column: 1 / -1;
			grid-row: 4;
		}

		.mobile-avatar-2 {
			grid-column: 1;
			grid-row: 5;
		}

		.mobile-header-2 {
			grid-column: 2;
			grid-row: 5;
		}

		.mobile-bio-2 {
			grid-column: 1 / -1;
			grid-row: 6;
		}

		.mobile-avatar-3 {
			grid-column: 1;
			grid-row: 7;
		}

		.mobile-header-3 {
			grid-column: 2;
			grid-row: 7;
		}

		.mobile-bio-3 {
			grid-column: 1 / -1;
			grid-row: 8;
		}

		.mobile-avatar-4 {
			grid-column: 1;
			grid-row: 9;
		}

		.mobile-header-4 {
			grid-column: 2;
			grid-row: 9;
		}

		.mobile-bio-4 {
			grid-column: 1 / -1;
			grid-row: 10;
		}

		.mobile-member-avatar,
		.mobile-member-avatar-placeholder {
			width: 120px;
			height: 120px;
			border-radius: 50%;
			overflow: hidden;
			justify-self: start;
			align-self: start;
		}

		.mobile-member-avatar img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.mobile-member-header {
			text-align: left;
		}

		.mobile-member-bio {
			text-align: justify;
			margin-bottom: 2rem;
		}

		.mobile-member-bio .member-github {
			margin-top: 2rem;
			display: flex;
			justify-content: center;
			width: 100%;
		}

		.member-name-row {
			flex-direction: column;
			gap: 0.25rem;
		}

		.member-name {
			font-size: 2rem;
		}

		.member-alias {
			font-size: 1.75rem;
		}

		.member-title {
			font-size: 1.75rem;
		}

		.mobile-title-clickable {
			cursor: pointer;
			user-select: none;
		}

		.member-bio {
			font-size: 1.5rem;
		}

		.member-github {
			font-size: 2rem;
		}

		.social-icons {
			gap: 1.5rem;
		}

		.social-icon {
			width: 128px;
			height: 128px;
		}

		.social-icon img {
			width: 64px;
			height: 64px;
		}

		.community-nav {
			flex-direction: column;
			gap: 1.5rem;
			align-items: flex-start;
		}
	}
</style>
