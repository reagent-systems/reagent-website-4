/** What the homepage needs from Spark's status feed (see /api/spark). */
export type SparkSummary =
	| {
			ok: true;
			status: 'serving' | 'training' | 'offline';
			model: string | null;
			until: number | null;
			tokens: number;
			since: string;
	  }
	| { ok: false };
