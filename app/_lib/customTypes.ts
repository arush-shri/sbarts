export type PaintingType = {
	id: string;
	title: string;
	description: string;
	category: string;
	keywords: string[];
	sellerId: string;

	price: number;
	isDigital: boolean;
	isPhysical: boolean;
	quantity: number;

	images: string; //will be image id in db

	views: number;
	purchases: number;
	createdAt: number;
	updatedAt: number;
	resolution?: string;
};

export type SellerType = {
	id: string;
	name: string;
	image: string;
	makeSelfPortrait: boolean;
	portraitPrice: number;
	address: {
		address: string;
		country: string;
		city: string;
		postalCode: string;
	};
	primaryCategories: string[];
	createdAt: number;
	artWorks: string[];
	email: string;
	totalSale: number;
	itemSold: number;
	orderIds: string[];
	stripeConnect?: string;
};

export type FilterButtonRef = {
	trigger: () => void;
};

export type ExploreButtonProps = {
	onClickCallback?: (key: string, value: string | string[]) => void;
	filterData: {
		search?: string;
		category?: string[];
		minPrice?: number;
		maxPrice?: number;
		type?: "digital" | "physical" | "all";
		sort?: string;
	};
};

export type ExploreRequest = {
	search?: string;
	category?: string[];
	type?: "digital" | "physical" | "all";

	minPrice?: number;
	maxPrice?: number;

	sort?:
		| "Relevance"
		| "Price: Low to High"
		| "Price: High to Low"
		| "Newest"
		| "Most Popular";
};

export type UpdateBody = {
	id?: string;
	title?: string;
	category?: string;
	description?: string;
	price?: number;
	quantity?: number;
};

export type CompetitionEntry = {
	id: string;
	title: string;
	entriesOpen: string;
	finalDeadline: string;
	winnersAnnouncement: string;
	exhibitionOpen: string;
	status: string;
	createdAt: number;
	updatedAt: number;
};
