import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SparkSummary } from '$lib/home/spark';

// Spark's public status feed. It sends no CORS headers, so the browser can't
// read it directly; this route fetches it server-side and passes on a summary.
const SOURCE = 'https://spark.reagent-systems.com/api/public';

type Upstream = {
	model?: string;
	setups?: { label: string; model: string; running: boolean }[];
	model_board?: { model: string; label: string; live: boolean }[];
	lab?: { active: boolean; until: number | null };
	swap?: { profile: string; label: string };
	engine?: { up: boolean };
	totals?: { tokens: number; since: string };
};

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=300' });

	try {
		const res = await fetch(SOURCE, { signal: AbortSignal.timeout(4000) });
		if (!res.ok) return json({ ok: false } satisfies SparkSummary);
		const d = (await res.json()) as Upstream;

		const running = d.setups?.find((s) => s.running);
		const live = d.model_board?.find((m) => m.live);
		const model = running?.label ?? live?.label ?? null;

		let status: 'serving' | 'training' | 'offline' = 'offline';
		if (d.lab?.active || d.swap?.profile === 'training') status = 'training';
		else if (d.engine?.up) status = 'serving';

		return json({
			ok: true,
			status,
			model,
			until: d.lab?.active ? (d.lab.until ?? null) : null,
			tokens: d.totals?.tokens ?? 0,
			since: d.totals?.since ?? ''
		} satisfies SparkSummary);
	} catch {
		return json({ ok: false } satisfies SparkSummary);
	}
};
