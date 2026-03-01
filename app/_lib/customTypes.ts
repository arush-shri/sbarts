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
	quantityDigital: number;
	quantityPhysical: number;

	images: string; //will be image id in db

	views: number;
	purchases: number;
	createdAt: number;
	updatedAt: number;
	totalSales: number;
};

export type SellerType = {
	id: string;
	name: string;
	image: string; //To be removed
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
};

export type FilterButtonRef = {
	trigger: () => void;
};
