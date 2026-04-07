<script lang="ts">
	import { page } from '$app/stores';

	const allLinks = [
		{ href: '/', label: 'home' },
		{ href: '/research', label: 'research' },
		{ href: '/portal', label: 'portal' },
		{ href: '/plan', label: 'plan' },
		{ href: '/projects', label: 'projects' },
		{ href: '/community', label: 'community' },
		{ href: '/careers', label: 'careers' }
	] as const;

	function currentPath(): string {
		let path = String($page.url.pathname);
		if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
		return path;
	}

	let links = $derived(allLinks.filter((l) => currentPath() !== l.href));
</script>

<nav class="page-subnav" aria-label="site sections">
	{#each links as link}
		<a href={link.href}>{link.label}</a>
	{/each}
</nav>

<style>
	.page-subnav {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		grid-template-rows: repeat(2, auto);
		gap: 1.25rem 2.5rem;
		margin-top: auto;
		max-width: 32rem;
	}

	.page-subnav a {
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
		justify-self: start;
	}

	.page-subnav a::after {
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

	.page-subnav a:hover {
		color: #000000;
	}

	.page-subnav a:hover::after {
		width: 100%;
	}

	@media (max-width: 768px) {
		.page-subnav {
			grid-template-columns: 1fr;
			grid-template-rows: none;
			gap: 1.25rem;
			max-width: none;
		}
	}
</style>
