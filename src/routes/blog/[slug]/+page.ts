import { error } from '@sveltejs/kit';
import { ARTICLES, articleBySlug } from '$lib/articles';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => ARTICLES.map((a) => ({ slug: a.slug }));

export const load: PageLoad = ({ params }) => {
	const article = articleBySlug(params.slug);
	if (!article) error(404, 'not found');
	return { slug: article.slug };
};
