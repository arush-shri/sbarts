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
	quantity?: number;

	images: string; //will be image id in db
	pickupAddress: {
		country: string;
		city: string;
		postalCode: string;
	};

	views: number;
	purchases: number;
	createdAt: number;
	updatedAt: number;
};

export type SellerType = {
	id: string;
	name: string;
	image: string;
	makeSelfPortrait?: boolean;
	portraitPrice?: number;
	address?: string;
};

export type FilterButtonRef = {
	trigger: () => void;
};
