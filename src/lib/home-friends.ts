export type HomeFriend = {
	/** Matches filename in /static/friends-of-reagent/ (without extension). */
	id: string;
	name: string;
	href?: string;
	logoSrc: string;
	logoAlt: string;
};

/**
 * Drop logo files into `static/friends-of-reagent/` and point `logoSrc` at them.
 * SVG or PNG recommended (~320×96px, transparent background).
 */
export const homeFriends: HomeFriend[] = [
	{
		id: 'friend-01',
		name: 'Friend 01',
		logoSrc: '/friends-of-reagent/friend-01.svg',
		logoAlt: 'Friend 01'
	},
	{
		id: 'friend-02',
		name: 'Friend 02',
		logoSrc: '/friends-of-reagent/friend-02.svg',
		logoAlt: 'Friend 02'
	},
	{
		id: 'friend-03',
		name: 'Friend 03',
		logoSrc: '/friends-of-reagent/friend-03.svg',
		logoAlt: 'Friend 03'
	},
	{
		id: 'friend-04',
		name: 'Friend 04',
		logoSrc: '/friends-of-reagent/friend-04.svg',
		logoAlt: 'Friend 04'
	},
	{
		id: 'friend-05',
		name: 'Friend 05',
		logoSrc: '/friends-of-reagent/friend-05.svg',
		logoAlt: 'Friend 05'
	},
	{
		id: 'friend-06',
		name: 'Friend 06',
		logoSrc: '/friends-of-reagent/friend-06.svg',
		logoAlt: 'Friend 06'
	},
	{
		id: 'friend-07',
		name: 'Friend 07',
		logoSrc: '/friends-of-reagent/friend-07.svg',
		logoAlt: 'Friend 07'
	},
	{
		id: 'friend-08',
		name: 'Friend 08',
		logoSrc: '/friends-of-reagent/friend-08.svg',
		logoAlt: 'Friend 08'
	}
];
