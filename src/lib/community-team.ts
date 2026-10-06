export type TeamMember = {
	name: string;
	alias?: string;
	title: string;
	bio: string;
	github?: string;
	customAvatar?: string;
};

export const teamMembers: TeamMember[] = [
	{
		name: 'Kyle Steel',
		alias: 'ThyFriendlyFox',
		title: 'chief of execution',
		bio: 'I graduated from Florida Polytechnic University with a Masters of Engineering in 2022 with a thesis focused on using Fourier-based machine learning techniques to calculate nonlinear physics systems with greater precision and speed on an Arduino running a custom algorithm than the available university supercomputer running Ansys Mechanical. My passion has always been in Artificial Intelligence, and I even led the research and development team for AutoGPT for a short period of time, unlocking the possibility of truly multi-agent systems. Since graduating, I\'ve been an ITAR and CMMC compliance system administrator. Most of my work has been developing a CMMC compliant ERP system for the manufacturing industry. I\'m a self-taught software developer and system admin with experience running businesses for a number of years now.',
		github: 'thyfriendlyfox'
	},
	{
		name: 'Ethan Shelton',
		alias: 'Spike',
		title: 'chief of information',
		bio: 'Hello, I\'m Spike! I\'ve been coding since I was 13, diving into mods, mobile games, VR experiences, websites, AWS, and software development. I thrive on the challenge, the puzzles, and the fun of piecing it all together. Currently, I\'m focusing on my vlogging and VR YouTube channels and crafting my own AI assistant named KIT. This is only the beginning to my story of relentless creation.',
		github: 'IronLeprechaun'
	},
	{
		name: 'BentlyBro',
		alias: 'bently',
		title: 'chief of technology',
		bio: 'Hey, I\'m Bently — a self-taught developer, systems tinkerer, and all-around builder with a love for pushing boundaries. Whether it\'s designing encrypted chat platforms, wiring up brain-computer interfaces, or spinning up AI agents that talk to each other, I\'m always crafting something weird, useful, or both. My portfolio (which totally needs an update) showcases a mix of tools like Promptly—a live website builder powered by natural language—and NoteNavigator, an AI music recommender that ran a little too close to Spotify\'s sun. As the community lead and developer behind AutoGPT, I balance hands-on coding with leading a vibrant Discord full of chaotic brilliance. Most days you\'ll find me deep in Python, JavaScript, or building cross-device systems that just sync. Other days, I\'m designing VR worlds, experimenting with EEG data, or mapping out new ways to bring decentralized, real-time tech to life. Welcome to my world—it\'s a bit experimental, often chaotic, but always driven by curiosity.',
		github: 'Bentlybro'
	},
	{
		name: 'Colton Frear',
		alias: 'COWTEAH',
		title: 'chief of finance',
		bio: 'My name is Colton Frear, I graduated from Florida Polytechnic University with a Masters in Mechanical Engineering. My first job out of college was as a Liaison Engineer for General Dynamics Electric Boat In Newport News Virginia. While at Electric Boat I provided engineering support on the Virginia Class Nuclear Submarine program for NAVSEA. After a short time there, I moved to Palmdale California to work for Northrop Grumman Aeronautics Systems. During my time with these prime contractors I have become intimately familiar with DoD program requirements and expectations as well as improving my general technical and engineering knowledge.',
		customAvatar: '/profile-pictures/cowteah.png'
	},
	{
		name: 'Alexey Kuznetsov',
		alias: 'what',
		title: 'chief of science',
		bio: 'I graduated from Florida Polytechnic University with a Bachelor\'s in Computer Science focused on cybersecurity in 2022, followed by my Master\'s in 2024, with plans to complete a Master\'s in Data Science by 2028. My biggest achievement has been co-developing Dynamo, a comprehensive all-in-one system built from scratch to run machine shops of any size, using JavaScript, HTML, Python, and PowerShell scripts. What started as a challenge to modernize manufacturing operations has grown into a full-scale platform that I continue to maintain today. My mix of formal education and self-taught skills has shaped me into a versatile problem-solver who thrives on building practical solutions. I bring my cybersecurity background and hands-on development experience to tackle whatever unconventional challenges come my way. Whether it\'s maintaining enterprise systems or exploring new technologies, I\'m driven by the satisfaction of creating tools that actually make a difference.',
		github: 'AlexeyAKuznetsov'
	}
];

export function memberAvatarUrl(member: TeamMember): string | null {
	if (member.customAvatar) return member.customAvatar;
	if (member.github) return `https://github.com/${member.github}.png`;
	return null;
}
