/** One row of Spark's leaderboard. */
export type SparkLeader = { name: string; tokens: number; requests?: number; minutes: number };

/** What the homepage needs from Spark's status feed (see /api/spark). */
export type SparkSummary =
	| {
			ok: true;
			status: 'serving' | 'training' | 'offline';
			model: string | null;
			until: number | null;
			tokens: number;
			since: string;
			requests: number;
			users: number;
			uptime: {
				/** Share of time up over the last day, week and 30 days (0 to 1). */
				day: number | null;
				week: number | null;
				month: number | null;
				/** One entry per day, oldest first. */
				daily: { start: number; up: number }[];
			};
			leaders: SparkLeader[];
			leadersToday: SparkLeader[];
	  }
	| { ok: false };
