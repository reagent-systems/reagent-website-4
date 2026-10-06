<script lang="ts">
	import { homeFriends, type HomeFriend } from '$lib/home-friends';

	interface Props {
		friends?: HomeFriend[];
	}

	let { friends = homeFriends }: Props = $props();

	const trackFriends = $derived([...friends, ...friends]);
</script>

<section class="friends-strip" aria-labelledby="home-friends-heading">
	<div class="friends-veil" aria-hidden="true"></div>
	<h2 id="home-friends-heading" class="friends-heading">friends of reagent</h2>

	<div class="friends-scroll">
		<div class="friends-track" aria-hidden="true">
			<ul class="friends-row">
				{#each trackFriends as friend, index (friend.id + index)}
					<li class="friends-item">
						{#if friend.href}
							<a
								class="friend-link"
								href={friend.href}
								rel="noopener noreferrer"
								target="_blank"
								aria-label={friend.name}
							>
								<img
									class="friend-logo"
									src={friend.logoSrc}
									alt={friend.logoAlt}
									width="160"
									height="48"
									loading="lazy"
									decoding="async"
								/>
							</a>
						{:else}
							<span class="friend-logo-wrap" aria-label={friend.name}>
								<img
									class="friend-logo"
									src={friend.logoSrc}
									alt={friend.logoAlt}
									width="160"
									height="48"
									loading="lazy"
									decoding="async"
								/>
							</span>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<ul class="friends-sr-list">
		{#each friends as friend (friend.id)}
			<li>
				{#if friend.href}
					<a href={friend.href}>{friend.name}</a>
				{:else}
					{friend.name}
				{/if}
			</li>
		{/each}
	</ul>
</section>

<style>
	.friends-strip {
		--friends-veil: var(--page-background);

		position: relative;
		z-index: 2;
		width: 100%;
		margin-top: clamp(3rem, 11vh, 6.5rem);
		padding: 2.75rem 0 clamp(2.5rem, 5vw, 3.5rem);
		border: none;
		background: color-mix(in srgb, var(--friends-veil) 58%, transparent);
		backdrop-filter: blur(18px) saturate(1.08);
		-webkit-backdrop-filter: blur(18px) saturate(1.08);
		box-shadow:
			0 0 64px 32px var(--friends-veil),
			0 28px 56px 28px var(--friends-veil),
			0 -28px 56px 28px var(--friends-veil);
		isolation: isolate;
	}

	.friends-veil {
		position: absolute;
		inset: -3rem 0 0;
		pointer-events: none;
		z-index: -1;
		background: color-mix(in srgb, var(--friends-veil) 58%, transparent);
		backdrop-filter: blur(18px) saturate(1.08);
		-webkit-backdrop-filter: blur(18px) saturate(1.08);
		box-shadow: 0 -28px 56px 28px var(--friends-veil);
	}

	.friends-heading {
		position: relative;
		z-index: 1;
		margin: 0 0 1.5rem;
		padding: 0 4rem;
		font-size: 0.95rem;
		font-weight: 300;
		color: #6b6b6b;
		text-transform: lowercase;
		letter-spacing: 0.12em;
		font-family: var(--main-font);
	}

	.friends-scroll {
		position: relative;
		z-index: 1;
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
	}

	.friends-scroll::-webkit-scrollbar {
		display: none;
	}

	.friends-track {
		display: flex;
		width: max-content;
		animation: friends-marquee 52s linear infinite;
	}

	.friends-scroll:hover .friends-track {
		animation-play-state: paused;
	}

	@media (prefers-reduced-motion: reduce) {
		.friends-track {
			animation: none;
		}
	}

	.friends-row {
		display: flex;
		align-items: center;
		gap: clamp(2.5rem, 6vw, 4.5rem);
		margin: 0;
		padding: 0 4rem;
		list-style: none;
	}

	.friends-item {
		flex: 0 0 auto;
	}

	.friend-link,
	.friend-logo-wrap {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 3rem;
		min-width: 8rem;
	}

	.friend-link {
		text-decoration: none;
		transition: opacity 0.25s ease, transform 0.25s ease;
	}

	.friend-link:hover,
	.friend-link:focus-visible {
		opacity: 1;
		transform: translateY(-1px);
	}

	.friend-logo {
		display: block;
		height: clamp(1.75rem, 3vw, 2.5rem);
		width: auto;
		max-width: clamp(8rem, 18vw, 14rem);
		object-fit: contain;
		opacity: 0.88;
		filter: grayscale(1);
		transition: opacity 0.25s ease;
	}

	.friend-link:hover .friend-logo,
	.friend-link:focus-visible .friend-logo {
		opacity: 1;
	}

	.friends-sr-list {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@keyframes friends-marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@media (max-width: 768px) {
		.friends-strip {
			margin-top: clamp(1.75rem, 8vh, 3rem);
			padding: 2.25rem 0 clamp(3rem, 12vw, 4.5rem);
		}

		.friends-veil {
			inset: -3rem 0 0;
		}

		.friends-heading {
			padding: 0 2rem;
		}

		.friends-row {
			padding: 0 2rem;
		}
	}
</style>
