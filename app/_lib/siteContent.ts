export type SitePageKey =
	| "home"
	| "gallery"
	| "marketplace"
	| "competition"
	| "about"
	| "contact";

export type SitePageContent = {
	title: string;
	subtitle: string;
	subtext: string;
	fields?: Record<string, string>;
};

export type SiteContentMap = Record<SitePageKey, SitePageContent>;

export type SiteContentPayload = {
	version: string;
	updatedAt: number;
	pages: SiteContentMap;
};

export const SITE_CONTENT_COLLECTION = "siteContent";
export const SITE_CONTENT_DOCUMENT = "pages";

export const DEFAULT_SITE_CONTENT: SiteContentMap = {
	home: {
		title: "SB Arts",
		subtitle: "Art for Hope, Dignity & Freedom",
		subtext:
			"Creating artwork that invites reflection, celebrates humanity, and inspires hope through observation, craftsmanship, and imagination.",
		fields: {},
	},
	gallery: {
		title: "Gallery",
		subtitle: "Five collections. One mission.",
		subtext:
			"Explore work centered on humanity, portraiture, nature, aerospace, and design.",
		fields: {},
	},
	marketplace: {
		title: "Marketplace",
		subtitle:
			"Original artwork, limited-edition prints, and selected design pieces presented in a gallery-style catalogue.",
		subtext: "",
		fields: {},
	},
	competition: {
		title: "SB Arts International Juried Competition",
		subtitle: "Arts for Hope, Dignity & Freedom",
		subtext:
			"An international juried art competition for high school students worldwide.",
		fields: {
			card1Title: "International",
			card1Subtitle: "Open to high school students worldwide.",
			card2Title: "Juried",
			card2Subtitle:
				"Reviewed by distinguished artists and arts professionals.",
			card3Title: "Theme",
			card3Subtitle:
				"Hope, dignity, freedom, resilience, identity, and humanity.",
		},
	},
	about: {
		title: "About SB Arts",
		subtitle: "",
		subtext:
			"Art rooted in careful observation, empathy, craftsmanship, and imagination.",
		fields: {
			missionLabel: "Mission",
			missionTitle: "Observation can become empathy.",
			missionSubtitle:
				"SB Arts explores hope, dignity, freedom, nature, and the human experience through drawing, design, and visual storytelling.",
			missionSubtext:
				"Every piece is created with the belief that art has the power to connect, inspire, and create meaningful change.",
		},
	},
	contact: {
		title: "Get in Touch",
		subtitle:
			"For commissions, media, partnerships, marketplace inquiries, or competition questions.",
		subtext: "",
		fields: {
			contactEmail: "info@msbart.com",
			websiteText: "msbart.com",
			websiteUrl: "https://msbart.com",
			instagramUrl: "#",
			xUrl: "#",
		},
	},
};

export type SiteContentFieldConfig = {
	key: string;
	label: string;
	type?: "text" | "textarea" | "email" | "url";
	rows?: number;
};

export const SITE_CONTENT_EXTRA_FIELDS: Partial<
	Record<SitePageKey, SiteContentFieldConfig[]>
> = {
	about: [
		{ key: "missionLabel", label: "Mission label" },
		{ key: "missionTitle", label: "Mission title" },
		{
			key: "missionSubtitle",
			label: "Mission subtitle",
			type: "textarea",
			rows: 3,
		},
		{
			key: "missionSubtext",
			label: "Mission subtext",
			type: "textarea",
			rows: 3,
		},
	],
	competition: [
		{ key: "card1Title", label: "First card title" },
		{
			key: "card1Subtitle",
			label: "First card subtitle",
			type: "textarea",
			rows: 2,
		},
		{ key: "card2Title", label: "Second card title" },
		{
			key: "card2Subtitle",
			label: "Second card subtitle",
			type: "textarea",
			rows: 2,
		},
		{ key: "card3Title", label: "Third card title" },
		{
			key: "card3Subtitle",
			label: "Third card subtitle",
			type: "textarea",
			rows: 2,
		},
	],
	contact: [
		{ key: "contactEmail", label: "Email", type: "email" },
		{ key: "websiteText", label: "Website display text" },
		{ key: "websiteUrl", label: "Website link", type: "url" },
		{ key: "instagramUrl", label: "Instagram link", type: "url" },
		{ key: "xUrl", label: "X link", type: "url" },
	],
};

export const EDITABLE_SITE_ROUTES: Record<string, SitePageKey> = {
	"/": "home",
	"/gallery": "gallery",
	"/marketplace": "marketplace",
	"/competition": "competition",
	"/about": "about",
	"/contact": "contact",
};

export const SITE_CONTENT_CACHE_KEY = "sbarts.siteContent.v1";

export function isSitePageKey(value: string): value is SitePageKey {
	return Object.prototype.hasOwnProperty.call(DEFAULT_SITE_CONTENT, value);
}

export function mergeSiteContent(
	content?: Partial<Record<SitePageKey, Partial<SitePageContent>>>,
): SiteContentMap {
	const pages = { ...DEFAULT_SITE_CONTENT } as SiteContentMap;

	for (const key of Object.keys(DEFAULT_SITE_CONTENT) as SitePageKey[]) {
		pages[key] = {
			...DEFAULT_SITE_CONTENT[key],
			...(content?.[key] || {}),
			fields: {
				...(DEFAULT_SITE_CONTENT[key].fields || {}),
				...(content?.[key]?.fields || {}),
			},
		};
	}

	return pages;
}
