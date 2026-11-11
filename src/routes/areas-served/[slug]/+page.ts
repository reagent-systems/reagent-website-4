import { error } from '@sveltejs/kit';
import { AREAS, areaBySlug } from '$lib/areas';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => AREAS.map((a) => ({ slug: a.slug }));

export const load: PageLoad = ({ params }) => {
	const area = areaBySlug(params.slug);
	if (!area) error(404, 'not found');
	return { area };
};
