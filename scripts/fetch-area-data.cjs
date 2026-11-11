// Pulls the public figures behind the areas-served pages and writes them to
// src/lib/areas/data.json. Run by hand when you want fresher numbers:
//   NODE_USE_ENV_PROXY=1 node scripts/fetch-area-data.cjs
// States come from FRED (Census, BEA, BLS series); countries from the World Bank.
// Requests are spaced out so the sources aren't hammered.

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'src', 'lib', 'areas', 'data.json');
// Identify the script honestly to the data sources.
const UA = 'reagent-systems-area-data/1.0 (+https://reagent-systems.com)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const STATES = [
	['AL', 'alabama'], ['AK', 'alaska'], ['AZ', 'arizona'], ['AR', 'arkansas'], ['CA', 'california'],
	['CO', 'colorado'], ['CT', 'connecticut'], ['DE', 'delaware'], ['DC', 'washington, dc'],
	['FL', 'florida'], ['GA', 'georgia'], ['HI', 'hawaii'], ['ID', 'idaho'], ['IL', 'illinois'],
	['IN', 'indiana'], ['IA', 'iowa'], ['KS', 'kansas'], ['KY', 'kentucky'], ['LA', 'louisiana'],
	['ME', 'maine'], ['MD', 'maryland'], ['MA', 'massachusetts'], ['MI', 'michigan'],
	['MN', 'minnesota'], ['MS', 'mississippi'], ['MO', 'missouri'], ['MT', 'montana'],
	['NE', 'nebraska'], ['NV', 'nevada'], ['NH', 'new hampshire'], ['NJ', 'new jersey'],
	['NM', 'new mexico'], ['NY', 'new york'], ['NC', 'north carolina'], ['ND', 'north dakota'],
	['OH', 'ohio'], ['OK', 'oklahoma'], ['OR', 'oregon'], ['PA', 'pennsylvania'],
	['RI', 'rhode island'], ['SC', 'south carolina'], ['SD', 'south dakota'], ['TN', 'tennessee'],
	['TX', 'texas'], ['UT', 'utah'], ['VT', 'vermont'], ['VA', 'virginia'], ['WA', 'washington'],
	['WV', 'west virginia'], ['WI', 'wisconsin'], ['WY', 'wyoming']
];

// Region names match the footer.
const COUNTRIES = [
	['CA', 'canada', 'north america'], ['MX', 'mexico', 'north america'],
	['GB', 'united kingdom', 'europe'], ['IE', 'ireland', 'europe'], ['FR', 'france', 'europe'],
	['DE', 'germany', 'europe'], ['NL', 'netherlands', 'europe'], ['BE', 'belgium', 'europe'],
	['CH', 'switzerland', 'europe'], ['AT', 'austria', 'europe'], ['ES', 'spain', 'europe'],
	['PT', 'portugal', 'europe'], ['IT', 'italy', 'europe'], ['SE', 'sweden', 'europe'],
	['NO', 'norway', 'europe'], ['DK', 'denmark', 'europe'], ['FI', 'finland', 'europe'],
	['PL', 'poland', 'europe'],
	['JP', 'japan', 'asia'], ['KR', 'south korea', 'asia'], ['TW', 'taiwan', 'asia'],
	['SG', 'singapore', 'asia'], ['IN', 'india', 'asia'], ['ID', 'indonesia', 'asia'],
	['MY', 'malaysia', 'asia'], ['TH', 'thailand', 'asia'], ['VN', 'vietnam', 'asia'],
	['PH', 'philippines', 'asia'],
	['AE', 'united arab emirates', 'middle east'], ['SA', 'saudi arabia', 'middle east'],
	['QA', 'qatar', 'middle east'], ['BH', 'bahrain', 'middle east'], ['KW', 'kuwait', 'middle east'],
	['OM', 'oman', 'middle east'], ['JO', 'jordan', 'middle east'], ['IL', 'israel', 'middle east']
];

async function fred(id) {
	for (let attempt = 0; attempt < 4; attempt++) {
		const res = await fetch(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}`);
		const text = await res.text();
		if (res.ok && text.startsWith('observation_date')) {
			return text
				.trim()
				.split('\n')
				.slice(1)
				.map((l) => l.split(','))
				.filter(([, v]) => v !== '' && v !== '.')
				.map(([d, v]) => ({ date: d, value: Number(v) }));
		}
		// Busy or not found: back off and try again, then give up on this series.
		await sleep(5000 * (attempt + 1));
	}
	console.warn('  no data for', id);
	return [];
}

const sum = (xs) => xs.reduce((a, b) => a + b, 0);

async function states() {
	const out = [];
	for (const [code, name] of STATES) {
		console.log('state', name);
		const apps = await fred(`BABATOTALSA${code}`);
		await sleep(1500);
		const hpa = await fred(`BAHBATOTALSA${code}`);
		await sleep(1500);
		const gdp = await fred(`${code}NGSP`);
		await sleep(1500);
		const pop = await fred(`${code}POP`);
		await sleep(1500);
		const mfg = await fred(`${code}MFG`);
		await sleep(1500);

		const last12 = apps.slice(-12);
		const prev12 = apps.slice(-24, -12);
		const hpa12 = hpa.slice(-12);
		const g = gdp.slice(-2);
		out.push({
			kind: 'state',
			code,
			name,
			region: 'united states',
			business: last12.length
				? {
						monthly: apps.slice(-24).map((p) => ({ date: p.date, value: p.value })),
						latest: apps.at(-1),
						last12: sum(last12.map((p) => p.value)),
						prev12: prev12.length === 12 ? sum(prev12.map((p) => p.value)) : null,
						highPropensity12: hpa12.length === 12 ? sum(hpa12.map((p) => p.value)) : null
					}
				: null,
			// FRED reports state GDP in millions of dollars.
			gdp: g.length ? { year: g.at(-1).date.slice(0, 4), value: g.at(-1).value * 1e6, prior: g.length > 1 ? g[0].value * 1e6 : null } : null,
			// Population in thousands.
			population: pop.length ? { year: pop.at(-1).date.slice(0, 4), value: pop.at(-1).value * 1e3 } : null,
			// Manufacturing employees in thousands.
			manufacturing: mfg.length ? { date: mfg.at(-1).date, value: mfg.at(-1).value * 1e3 } : null
		});
	}
	return out;
}

const WB = {
	gdp: 'NY.GDP.MKTP.CD',
	growth: 'NY.GDP.MKTP.KD.ZG',
	population: 'SP.POP.TOTL',
	newBusinesses: 'IC.BUS.NREG',
	patents: 'IP.PAT.RESD',
	research: 'GB.XPD.RSDV.GD.ZS'
};

async function worldBank(indicator, codes) {
	const url = `https://api.worldbank.org/v2/country/${codes.join(';')}/indicator/${indicator}?format=json&date=2010:2026&per_page=5000`;
	for (let attempt = 0; attempt < 4; attempt++) {
		const res = await fetch(url);
		if (res.ok) {
			const json = await res.json();
			const rows = Array.isArray(json) ? json[1] ?? [] : [];
			const latest = {};
			for (const r of rows) {
				if (r.value == null) continue;
				const k = r.country.id;
				if (!latest[k] || r.date > latest[k].year) latest[k] = { year: r.date, value: r.value };
			}
			return latest;
		}
		await sleep(5000 * (attempt + 1));
	}
	return {};
}

// The World Bank doesn't list some places (Taiwan among them). The IMF's
// World Economic Outlook does, so it fills in GDP, growth and population.
// Its series run into projections, so only years before this one are used.
const IMF = { gdp: ['NGDPD', 1e9], growth: ['NGDP_RPCH', 1], population: ['LP', 1e6] };
const ISO3 = { TW: 'TWN' };

async function imf(code) {
	const iso3 = ISO3[code];
	if (!iso3) return {};
	const thisYear = new Date().getFullYear();
	const out = {};
	for (const [key, [indicator, scale]] of Object.entries(IMF)) {
		const res = await fetch(`https://www.imf.org/external/datamapper/api/v1/${indicator}/${iso3}`, {
			headers: { 'user-agent': UA }
		});
		if (!res.ok) continue;
		const json = await res.json();
		const series = json.values?.[indicator]?.[iso3] ?? {};
		const years = Object.keys(series).filter((y) => Number(y) < thisYear && series[y] != null).sort();
		const y = years.at(-1);
		if (y) out[key] = { year: y, value: series[y] * scale, source: 'imf' };
		await sleep(1000);
	}
	return out;
}

async function countries() {
	const codes = COUNTRIES.map(([c]) => c);
	const data = {};
	for (const [key, indicator] of Object.entries(WB)) {
		console.log('world bank', indicator);
		data[key] = await worldBank(indicator, codes);
		await sleep(1000);
	}
	const out = [];
	for (const [code, name, region] of COUNTRIES) {
		const fallback = data.gdp[code] ? {} : await imf(code);
		out.push({
			kind: 'country',
			code,
			name,
			region,
			gdp: data.gdp[code] ?? fallback.gdp ?? null,
			growth: data.growth[code] ?? fallback.growth ?? null,
			population: data.population[code] ?? fallback.population ?? null,
			newBusinesses: data.newBusinesses[code] ?? null,
			patents: data.patents[code] ?? null,
			research: data.research[code] ?? null
		});
	}
	return out;
}

(async () => {
	// `--countries` refreshes only the countries and keeps the saved states.
	const onlyCountries = process.argv.includes('--countries');
	const c = await countries();
	const s = onlyCountries ? JSON.parse(fs.readFileSync(OUT, 'utf8')).states : await states();
	fs.mkdirSync(path.dirname(OUT), { recursive: true });
	fs.writeFileSync(OUT, JSON.stringify({ fetched: new Date().toISOString().slice(0, 10), states: s, countries: c }, null, '\t') + '\n');
	console.log('wrote', OUT);
})();
