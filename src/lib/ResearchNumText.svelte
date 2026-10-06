<script lang="ts">
	import { tokenizeNums } from '$lib/research-text';

	interface Props {
		text: string;
	}

	let { text }: Props = $props();
</script>

{#each tokenizeNums(text) as part}
	{#if part.kind === 'num'}
		<span class="research-num">{part.value}</span>
	{:else}
		{part.value}
	{/if}
{/each}

<style>
	.research-num {
		font-family: var(--ascii-font);
		font-weight: 100;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.01em;
	}
</style>
