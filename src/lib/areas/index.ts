// Places we serve, with the public figures behind each place's page.
// The figures come from scripts/fetch-area-data.cjs (see data.json).
import data from './data.json';

type Point = { date: string; value: number };
type Yearly = { year: string; value: number; source?: 'imf' };

export type StateArea = {
	kind: 'state';
	code: string;
	name: string;
	region: 'united states';
	business: {
		monthly: Point[];
		latest: Point;
		last12: number;
		prev12: number | null;
		highPropensity12: number | null;
	} | null;
	gdp: { year: string; value: number; prior: number | null } | null;
	population: Yearly | null;
	manufacturing: Point | null;
};

export type CountryArea = {
	kind: 'country';
	code: string;
	name: string;
	region: 'north america' | 'europe' | 'asia' | 'middle east';
	gdp: Yearly | null;
	growth: Yearly | null;
	population: Yearly | null;
	newBusinesses: Yearly | null;
	patents: Yearly | null;
	research: Yearly | null;
};

export type Area = (StateArea | CountryArea) & { slug: string };

export const FETCHED: string = data.fetched;

export const slugOf = (name: string) => name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();

const withSlug = <T extends { name: string }>(a: T) => ({ ...a, slug: slugOf(a.name) });

export const STATES = (data.states as StateArea[]).map(withSlug).sort((a, b) => a.name.localeCompare(b.name));
export const COUNTRIES = (data.countries as CountryArea[]).map(withSlug);
export const AREAS: Area[] = [...STATES, ...COUNTRIES];

export const areaBySlug = (slug: string) => AREAS.find((a) => a.slug === slug);

/** Footer and index groupings, in the order they are listed. */
export const REGIONS: { name: string; areas: Area[] }[] = [
	{ name: 'north america', areas: COUNTRIES.filter((c) => c.region === 'north america') },
	{ name: 'united states', areas: STATES },
	{ name: 'europe', areas: COUNTRIES.filter((c) => c.region === 'europe') },
	{ name: 'asia', areas: COUNTRIES.filter((c) => c.region === 'asia') },
	{ name: 'middle east', areas: COUNTRIES.filter((c) => c.region === 'middle east') }
];

/** Display name with proper capitals for headings that need them (e.g. "DC"). */
export const displayName = (name: string) => name.replace(/\bdc\b/, 'DC');

/** Where each figure comes from, linked to the series itself. */
export const stateSources = (code: string) => [
	{
		label: 'business applications, U.S. Census Bureau Business Formation Statistics',
		url: `https://fred.stlouisfed.org/series/BABATOTALSA${code}`
	},
	{
		label: 'high-propensity business applications, U.S. Census Bureau',
		url: `https://fred.stlouisfed.org/series/BAHBATOTALSA${code}`
	},
	{ label: 'gross domestic product, U.S. Bureau of Economic Analysis', url: `https://fred.stlouisfed.org/series/${code}NGSP` },
	{ label: 'resident population, U.S. Census Bureau', url: `https://fred.stlouisfed.org/series/${code}POP` },
	{ label: 'manufacturing employees, U.S. Bureau of Labor Statistics', url: `https://fred.stlouisfed.org/series/${code}MFG` }
];

export const countrySources = (area: CountryArea) => {
	const code = area.code;
	if (area.gdp?.source === 'imf') {
		const iso3 = { TW: 'TWN' }[code] ?? code;
		return [
			{ label: 'GDP (current US$), IMF World Economic Outlook', url: `https://www.imf.org/external/datamapper/NGDPD@WEO/${iso3}` },
			{ label: 'real GDP growth, IMF World Economic Outlook', url: `https://www.imf.org/external/datamapper/NGDP_RPCH@WEO/${iso3}` },
			{ label: 'population, IMF World Economic Outlook', url: `https://www.imf.org/external/datamapper/LP@WEO/${iso3}` }
		];
	}
	return worldBankSources(code);
};

const worldBankSources = (code: string) => [
	{ label: 'GDP (current US$), World Bank', url: `https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=${code}` },
	{ label: 'GDP growth, World Bank', url: `https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG?locations=${code}` },
	{ label: 'population, World Bank', url: `https://data.worldbank.org/indicator/SP.POP.TOTL?locations=${code}` },
	{ label: 'new businesses registered, World Bank', url: `https://data.worldbank.org/indicator/IC.BUS.NREG?locations=${code}` },
	{ label: 'patent applications by residents, World Bank', url: `https://data.worldbank.org/indicator/IP.PAT.RESD?locations=${code}` },
	{ label: 'research and development spending, World Bank', url: `https://data.worldbank.org/indicator/GB.XPD.RSDV.GD.ZS?locations=${code}` }
];

// Number formatting shared by the pages.
export function money(n: number) {
	if (n >= 1e12) return `$${(n / 1e12).toFixed(2)} trillion`;
	if (n >= 1e9) return `$${(n / 1e9).toFixed(1)} billion`;
	if (n >= 1e6) return `$${(n / 1e6).toFixed(0)} million`;
	return `$${Math.round(n).toLocaleString('en-US')}`;
}

export function count(n: number) {
	if (n >= 1e9) return `${(n / 1e9).toFixed(2)} billion`;
	if (n >= 1e6) return `${(n / 1e6).toFixed(1)} million`;
	return Math.round(n).toLocaleString('en-US');
}

export function change(now: number, before: number) {
	const p = ((now - before) / before) * 100;
	return `${p >= 0 ? 'up' : 'down'} ${Math.abs(p).toFixed(1)}%`;
}

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
export const monthText = (iso: string) => {
	const [y, m] = iso.split('-').map(Number);
	return `${MONTHS[m - 1]} ${y}`;
};
