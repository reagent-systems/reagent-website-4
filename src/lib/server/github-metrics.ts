/**
 * Org/user repo stats from GitHub GraphQL (server-only).
 *
 * Conventions:
 * - Projects started: non-fork, non-archived repos whose createdAt is within the lookback window (or all-time if lookback is 0).
 * - Projects released: subset of those with at least one published GitHub Release.
 * - Start → release: mean whole days from repo createdAt to first published (non-draft) release.
 * - Fastest release: minimum hours from repo createdAt to first published release (among repos with a release).
 * - GitHub stars: sum of stargazerCount on the same filtered repos.
 * - Updates shipped: per repo, max(0, release totalCount − 1), summed (post–first-release updates).
 */

export type GithubMetricsResult =
	| {
			ok: true;
			projectsStarted: number;
			projectsReleased: number;
			startReleaseGapDays: number;
			fastestReleaseGapHours: number;
			githubStars: number;
			updatesShipped: number;
	  }
	| { ok: false; message: string };

type RepoNode = {
	createdAt: string;
	isFork: boolean;
	isArchived: boolean;
	stargazerCount: number;
	releases: {
		totalCount: number;
		nodes: { publishedAt: string | null; isDraft: boolean }[];
	};
};

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

const QUERY = `
query MetricsRepos($login: String!, $cursor: String) {
  repositoryOwner(login: $login) {
    repositories(first: 100, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        createdAt
        isFork
        isArchived
        stargazerCount
        releases(first: 100, orderBy: {field: CREATED_AT, direction: ASC}) {
          totalCount
          nodes {
            publishedAt
            isDraft
          }
        }
      }
    }
  }
}
`;

function parseLookbackDays(raw: string | undefined): number {
	if (raw === undefined || raw === '') return 365;
	const n = Number.parseInt(raw, 10);
	if (Number.isNaN(n) || n < 0) return 365;
	return n;
}

function firstPublishedAt(repo: RepoNode): string | null {
	for (const r of repo.releases.nodes) {
		if (!r.isDraft && r.publishedAt) return r.publishedAt;
	}
	return null;
}

function daysBetween(isoStart: string, isoEnd: string): number {
	const a = new Date(isoStart).getTime();
	const b = new Date(isoEnd).getTime();
	return Math.round((b - a) / 86_400_000);
}

function hoursBetween(isoStart: string, isoEnd: string): number {
	const a = new Date(isoStart).getTime();
	const b = new Date(isoEnd).getTime();
	return Math.max(0, Math.round((b - a) / 3_600_000));
}

export async function fetchGithubMetrics(options: {
	token: string;
	ownerLogin: string;
	lookbackDays: number;
	includeForks: boolean;
	includeArchived: boolean;
}): Promise<GithubMetricsResult> {
	const { token, ownerLogin, lookbackDays, includeForks, includeArchived } = options;

	const cutoff =
		lookbackDays === 0
			? null
			: new Date(Date.now() - lookbackDays * 86_400_000);

	const allNodes: RepoNode[] = [];
	let cursor: string | null = null;
	let hasNext = true;

	while (hasNext) {
		const res = await fetch(GITHUB_GRAPHQL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				'User-Agent': 'reagent-metrics'
			},
			body: JSON.stringify({
				query: QUERY,
				variables: { login: ownerLogin, cursor }
			})
		});

		if (!res.ok) {
			return { ok: false, message: `GitHub HTTP ${res.status}` };
		}

		const json = (await res.json()) as {
			errors?: { message: string }[];
			data?: {
				repositoryOwner: null | {
					repositories: {
						pageInfo: { hasNextPage: boolean; endCursor: string | null };
						nodes: RepoNode[];
					};
				};
			};
		};

		if (json.errors?.length) {
			return { ok: false, message: json.errors.map((e) => e.message).join('; ') };
		}

		const owner = json.data?.repositoryOwner;
		if (!owner?.repositories) {
			return { ok: false, message: `No repository owner "${ownerLogin}" (check GITHUB_METRICS_OWNER).` };
		}

		const conn = owner.repositories;
		for (const n of conn.nodes) {
			if (n) allNodes.push(n);
		}

		hasNext = conn.pageInfo.hasNextPage;
		cursor = conn.pageInfo.endCursor;
	}

	const filtered: RepoNode[] = [];
	for (const node of allNodes) {
		if (!includeForks && node.isFork) continue;
		if (!includeArchived && node.isArchived) continue;
		if (cutoff) {
			const created = new Date(node.createdAt);
			if (created < cutoff) continue;
		}
		filtered.push(node);
	}

	const projectsStarted = filtered.length;

	let projectsReleased = 0;
	const gapsDays: number[] = [];
	const gapsHours: number[] = [];
	let updatesShipped = 0;
	let githubStars = 0;

	for (const repo of filtered) {
		githubStars += repo.stargazerCount ?? 0;

		const total = repo.releases.totalCount;
		const firstAt = firstPublishedAt(repo);

		if (total > 0 && firstAt) {
			projectsReleased += 1;
			gapsDays.push(daysBetween(repo.createdAt, firstAt));
			gapsHours.push(hoursBetween(repo.createdAt, firstAt));
			updatesShipped += Math.max(0, total - 1);
		}
	}

	const startReleaseGapDays =
		gapsDays.length > 0
			? Math.round(gapsDays.reduce((s, d) => s + d, 0) / gapsDays.length)
			: 0;

	const fastestReleaseGapHours =
		gapsHours.length > 0 ? Math.min(...gapsHours) : 0;

	return {
		ok: true,
		projectsStarted,
		projectsReleased,
		startReleaseGapDays,
		fastestReleaseGapHours,
		githubStars,
		updatesShipped
	};
}

export function githubMetricsFromEnv(
	env: Record<string, string | undefined>
): Promise<GithubMetricsResult | null> {
	const token = env.GITHUB_TOKEN?.trim();
	const ownerLogin = env.GITHUB_METRICS_OWNER?.trim();

	if (!token || !ownerLogin) {
		return Promise.resolve(null);
	}

	const lookbackDays = parseLookbackDays(env.GITHUB_METRICS_LOOKBACK_DAYS);
	const includeForks = env.GITHUB_METRICS_INCLUDE_FORKS === '1' || env.GITHUB_METRICS_INCLUDE_FORKS === 'true';
	const includeArchived =
		env.GITHUB_METRICS_INCLUDE_ARCHIVED === '1' || env.GITHUB_METRICS_INCLUDE_ARCHIVED === 'true';

	return fetchGithubMetrics({
		token,
		ownerLogin,
		lookbackDays,
		includeForks,
		includeArchived
	});
}

/**
 * Commit search (max 1000 results): trimmed message length ≤ threshold → human; longer → automated.
 * Automation % = automated / total × 100.
 */
export type AutomationCommitSearchResult =
	| { ok: true; percent: number; commitCount: number; humanCount: number; automatedCount: number }
	| { ok: false; message: string };

const COMMIT_SEARCH_API = 'https://api.github.com/search/commits';

/** Comma-separated logins; default thyfriendlyfox if empty after parse. */
export function parseAutomationAuthors(raw: string | undefined): string[] {
	const list = (raw ?? '')
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
	const unique = [...new Set(list)];
	return unique.length > 0 ? unique : ['thyfriendlyfox'];
}

/**
 * One paginated search (max 1000). GitHub’s REST commit search does not reliably support
 * multi-author OR queries; callers run this once per author and merge by SHA.
 */
async function fetchCommitSearchPages(
	token: string,
	q: string
): Promise<{ ok: true; items: { sha: string; message: string }[] } | { ok: false; message: string }> {
	const collected: { sha: string; message: string }[] = [];
	let page = 1;

	while (page <= 10) {
		const url = new URL(COMMIT_SEARCH_API);
		url.searchParams.set('q', q);
		url.searchParams.set('per_page', '100');
		url.searchParams.set('page', String(page));

		const res = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/vnd.github+json',
				'User-Agent': 'reagent-metrics'
			}
		});

		if (!res.ok) {
			return { ok: false, message: `Commit search HTTP ${res.status}` };
		}

		const data = (await res.json()) as {
			items?: { sha?: string; commit?: { message?: string } }[];
		};

		const items = data.items ?? [];
		for (const item of items) {
			const sha = item.sha;
			if (!sha) continue;
			collected.push({ sha, message: item.commit?.message ?? '' });
		}

		if (items.length < 100) break;
		page += 1;
	}

	return { ok: true, items: collected };
}

export async function fetchCommitAutomationPercent(options: {
	token: string;
	authors: string[];
	org: string;
	/** Messages with trimmed length ≤ this value are treated as human; longer = automated. */
	threshold: number;
}): Promise<AutomationCommitSearchResult> {
	const orgPart = `org:${options.org}`;
	const bySha = new Map<string, string>();

	for (const author of options.authors) {
		const q = `author:${author} ${orgPart}`;
		const pageResult = await fetchCommitSearchPages(options.token, q);
		if (!pageResult.ok) {
			return pageResult;
		}
		for (const { sha, message } of pageResult.items) {
			if (!bySha.has(sha)) {
				bySha.set(sha, message);
			}
		}
	}

	let humanCount = 0;
	let automatedCount = 0;

	for (const message of bySha.values()) {
		const len = message.trim().length;
		if (len <= options.threshold) humanCount += 1;
		else automatedCount += 1;
	}

	const commitCount = humanCount + automatedCount;
	const percent =
		commitCount === 0 ? 0 : Math.round((automatedCount / commitCount) * 100);

	return { ok: true, percent, commitCount, humanCount, automatedCount };
}

export function automationCommitSearchFromEnv(
	env: Record<string, string | undefined>
): Promise<AutomationCommitSearchResult | null> {
	const token = env.GITHUB_TOKEN?.trim();
	if (!token) return Promise.resolve(null);

	if (env.GITHUB_AUTOMATION_DISABLED === '1' || env.GITHUB_AUTOMATION_DISABLED === 'true') {
		return Promise.resolve(null);
	}

	const authors = parseAutomationAuthors(env.GITHUB_AUTOMATION_AUTHOR);
	const org = env.GITHUB_AUTOMATION_ORG?.trim() || 'reagent-systems';
	const raw = env.GITHUB_AUTOMATION_CHAR_THRESHOLD;
	const parsed = raw !== undefined && raw !== '' ? Number.parseInt(raw, 10) : 25;
	const threshold = Number.isNaN(parsed) ? 25 : Math.max(0, parsed);

	return fetchCommitAutomationPercent({ token, authors, org, threshold });
}
