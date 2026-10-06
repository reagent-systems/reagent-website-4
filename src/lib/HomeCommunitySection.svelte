<script lang="ts">
	import { teamMembers, memberAvatarUrl, type TeamMember } from '$lib/community-team';

	interface Props {
		members?: TeamMember[];
	}

	let { members = teamMembers }: Props = $props();
</script>

<section class="home-community" aria-labelledby="home-community-title">
	<header class="home-community-header">
		<h2 id="home-community-title" class="home-community-title">
			<a class="home-community-title-link" href="/community">community</a>
		</h2>
	</header>

	<ul class="home-community-grid">
		{#each members as member (member.name)}
			{@const avatar = memberAvatarUrl(member)}
			<li>
				<article class="home-community-card">
					{#if avatar}
						<div class="home-community-avatar-wrap">
							<img
								class="home-community-avatar"
								src={avatar}
								alt=""
								width="160"
								height="160"
								loading="lazy"
								decoding="async"
							/>
						</div>
					{:else}
						<div class="home-community-avatar-wrap home-community-avatar-wrap--empty"></div>
					{/if}
					<div class="home-community-body">
						<h3 class="home-community-name">{member.name}</h3>
						{#if member.alias}
							<p class="home-community-alias">{member.alias}</p>
						{/if}
						<p class="home-community-role">{member.title}</p>
						{#if member.github}
							<a
								class="home-community-github"
								href="https://github.com/{member.github}"
								target="_blank"
								rel="noopener noreferrer"
							>
								{member.github}
							</a>
						{/if}
					</div>
				</article>
			</li>
		{/each}
	</ul>
</section>

<style>
	.home-community {
		--community-veil: var(--page-background);

		position: relative;
		z-index: 1;
		width: 100%;
		padding: clamp(2.25rem, 5vw, 3.5rem) clamp(2rem, 4vw, 4rem) clamp(4rem, 9vw, 6rem);
		border: none;
		background: color-mix(in srgb, var(--community-veil) 58%, transparent);
		backdrop-filter: blur(18px) saturate(1.08);
		-webkit-backdrop-filter: blur(18px) saturate(1.08);
		box-shadow:
			0 0 64px 32px var(--community-veil),
			0 28px 56px 28px var(--community-veil),
			0 -28px 56px 28px var(--community-veil);
		isolation: isolate;
	}

	.home-community-header {
		max-width: 72rem;
		margin: 0 auto clamp(2rem, 4vw, 2.75rem);
	}

	.home-community-title {
		margin: 0;
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 100;
		line-height: 1.05;
		font-family: var(--main-font);
		text-transform: lowercase;
		letter-spacing: -0.02em;
	}

	.home-community-title-link {
		color: #1a1a1a;
		text-decoration: none;
		transition: color 0.25s ease;
	}

	.home-community-title-link:hover,
	.home-community-title-link:focus-visible {
		color: #6b6b6b;
	}

	.home-community-grid {
		list-style: none;
		margin: 0 auto;
		padding: 0;
		max-width: 72rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 13.5rem), 1fr));
		gap: clamp(1.5rem, 3vw, 2.25rem);
	}

	.home-community-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.85rem;
	}

	.home-community-avatar-wrap {
		width: clamp(5.5rem, 14vw, 7rem);
		height: clamp(5.5rem, 14vw, 7rem);
		border-radius: 999px;
		overflow: hidden;
		background: #e8e8e8;
		flex-shrink: 0;
	}

	.home-community-avatar-wrap--empty {
		background: linear-gradient(145deg, #ececec, #d8d8d8);
	}

	.home-community-avatar {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.home-community-body {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		min-width: 0;
	}

	.home-community-name {
		margin: 0;
		font-size: clamp(1.05rem, 2vw, 1.2rem);
		font-weight: 300;
		color: #1a1a1a;
		font-family: var(--main-font);
		line-height: 1.25;
	}

	.home-community-alias {
		margin: 0;
		font-size: 0.9rem;
		font-weight: 300;
		color: #9a9a9a;
		font-family: var(--main-font);
	}

	.home-community-role {
		margin: 0.15rem 0 0;
		font-size: 0.82rem;
		font-weight: 100;
		color: #888;
		text-transform: lowercase;
		letter-spacing: 0.06em;
		font-family: var(--ascii-font);
	}

	.home-community-github {
		margin-top: 0.35rem;
		font-size: 0.88rem;
		font-weight: 300;
		color: #6b6b6b;
		text-decoration: none;
		font-family: var(--main-font);
		transition: color 0.25s ease;
	}

	.home-community-github:hover,
	.home-community-github:focus-visible {
		color: #1a1a1a;
	}
</style>
