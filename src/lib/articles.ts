// News articles. Each one draws on what comes up again and again in our calls
// with founders; no founder, company or figure from those calls is named.

export type Article = {
	slug: string;
	title: string;
	excerpt: string;
	date: string; // yyyy-mm-dd
	body: string[];
};

export const ARTICLES: Article[] = [
	{
		slug: 'where-are-you-really',
		title: 'where are you, really?',
		excerpt: 'technology and manufacturing readiness, and why the honest answer helps you raise.',
		date: '2026-11-07',
		body: [
			'most of our first calls with founders start the same way. we ask a set of questions about the product, the market and how the thing gets built, and from the answers we place the company on two scales: technology readiness and manufacturing readiness.',
			'technology readiness runs from an idea on paper to a system proven in real use. manufacturing readiness asks a different question: can you make it again, at a known cost, with parts you can actually get? a working prototype on a bench can sit high on the first scale and near the bottom of the second.',
			'founders often overestimate where they are, and that is not a criticism. when you have lived with a design for months, it feels further along than it looks to someone seeing it for the first time. an investor is that someone.',
			'the gap between the two scales is where most of the hidden work lives: suppliers, tolerances, compliance, test plans, the second and third unit. naming it early turns a vague feeling of being almost there into a list of things to do.',
			'our aim with every company is a technology readiness level of five and a manufacturing readiness level of six. at that point a prototype works in a relevant environment, the path to production is mapped, and a pre-seed conversation has something solid to stand on.'
		]
	},
	{
		slug: 'what-goes-in-a-data-room',
		title: 'what goes in a data room',
		excerpt: 'the packet investors ask for before they will take a second meeting.',
		date: '2026-11-05',
		body: [
			'a recurring moment in our calls: an investor is interested, and asks for the data room. many early founders have never assembled one, and the request can stall a promising conversation for weeks.',
			'a data room is one organised place that answers the questions an investor would otherwise ask one at a time. what is the product. what makes it defensible. where is it on the roadmap. how much capital does it need, and what does that capital buy.',
			'alongside it sit the basics: a pitch deck, a cap table that shows who owns what, a website that matches the story, and the research behind your decisions. for hardware, add the numbers behind your cost estimates and where those numbers came from, and an early read on permits, certifications or licensing.',
			'investors expect confident decisions backed by research. a data room is where that research becomes visible. it also helps the founder: putting it together tends to surface the open questions before someone else does.',
			'we work through the list with founders before any introduction, so that the first meeting can be about the company rather than about missing paperwork.'
		]
	},
	{
		slug: 'pick-the-market-before-the-factory',
		title: 'pick the market before the factory',
		excerpt: 'hardware decisions made early are expensive to unmake later.',
		date: '2026-11-03',
		body: [
			'hardware teams often plan to choose a market once the design is done and the money is in. we suggest the opposite order.',
			'where you manufacture, which suppliers you use and which components you trust all shape who can buy from you. defense and government customers in particular can require specific supply chains, and sometimes country-specific versions of a product. a choice made for convenience in the first prototype can close a market later, or make changing direction costly.',
			'the same applies to crowded markets. when many teams are building the same complete product, it can be worth looking one layer down, at a component or subsystem that all of them need and few of them make well.',
			'none of this needs a final answer on day one. it needs a decision with reasons behind it, written down, so that the design, the sourcing and the pitch all point the same way.'
		]
	},
	{
		slug: 'say-it-plainly',
		title: 'say it plainly',
		excerpt: 'deep technology still has to be explained in the buyer’s terms.',
		date: '2026-10-30',
		body: [
			'some of the strongest technology we see is the hardest to explain. founders who have spent years on a problem naturally describe it the way they think about it: in mechanisms, proofs and edge cases.',
			'buyers and investors listen for something else. what does it prevent, what does it save, and what changes on the day they adopt it. lead with that, in plain language, and keep the technical depth ready for the person who asks for it.',
			'for regulated customers, plain language is only half of it. they will want compliance documentation and a sound business setup before they can say yes, and those take time to put in place.',
			'it is usually better to align with an established standard than to invent a new one. a product that applies controls customers already recognise is easier to buy than one that asks them to trust a new certification.'
		]
	},
	{
		slug: 'first-steps-toward-government-work',
		title: 'first steps toward government work',
		excerpt: 'registration, grants and habits that keep the door open.',
		date: '2026-10-26',
		body: [
			'defense and public-sector founders tend to ask the same opening questions, and the first answers are mostly administrative.',
			'register on SAM.gov and get a CAGE code early. both take time, and both are needed before a contract or grant can be awarded. if research grants fit the work, SBIR and STTR programs are a common starting point, and the application is worth preparing carefully.',
			'expect customers in this space to care about where and how the product is made. supply chains, component sources and the ability to adapt a product for a particular country can matter as much as performance.',
			'habits matter too. sound information security from the start, and care about what is said in public about sensitive capabilities, protect a team’s chances with the agencies it hopes to work with.',
			'none of this is difficult. it is paperwork, and paperwork is easier done early than in a rush when an opportunity appears.'
		]
	}
];

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
export const articleDate = (iso: string) => {
	const [y, m, d] = iso.split('-').map(Number);
	return `${MONTHS[m - 1]} ${d}, ${y}`;
};
