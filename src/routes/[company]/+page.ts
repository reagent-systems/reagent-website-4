import { error } from '@sveltejs/kit';
import { COMPANIES } from '$lib/home/companies';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

// Research has its own page at /research, so it isn't built from this template.
const OWN_PAGES = ['research'];

export const entries: EntryGenerator = () =>
	COMPANIES.filter((c) => !OWN_PAGES.includes(c.slug)).map((c) => ({ company: c.slug }));

export const load: PageLoad = ({ params }) => {
	const company = COMPANIES.find((c) => c.slug === params.company);
	if (!company) error(404, 'not found');
	return { slug: company.slug };
};
