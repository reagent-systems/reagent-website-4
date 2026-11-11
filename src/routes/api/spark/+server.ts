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
	totals?: { tokens: number; since: string; requests?: number; users?: number };
	uptime?: {
		windows?: Record<string, number>;
		daily?: { start: number; up: number }[];
	};
	leaderboard?: { name: string; tokens: number; requests?: number; minutes: number }[];
	leaderboard_today?: { name: string; tokens: number; requests?: number; minutes: number }[];
};

const leaders = (rows: Upstream['leaderboard']) =>
	(rows ?? []).slice(0, 10).map((r) => ({
		name: String(r.name),
		tokens: Number(r.tokens) || 0,
		requests: r.requests == null ? undefined : Number(r.requests),
		minutes: Number(r.minutes) || 0
	}));

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
			since: d.totals?.since ?? '',
			requests: d.totals?.requests ?? 0,
			users: d.totals?.users ?? 0,
			uptime: {
				day: d.uptime?.windows?.['86400'] ?? null,
				week: d.uptime?.windows?.['604800'] ?? null,
				month: d.uptime?.windows?.['2592000'] ?? null,
				daily: (d.uptime?.daily ?? []).slice(-60).map((x) => ({ start: x.start, up: x.up }))
			},
			leaders: leaders(d.leaderboard),
			leadersToday: leaders(d.leaderboard_today)
		} satisfies SparkSummary);
	} catch {
		return json({ ok: false } satisfies SparkSummary);
	}
};
