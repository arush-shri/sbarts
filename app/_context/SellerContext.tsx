"use client";

import { Context, createContext, ReactNode, useContext, useState } from "react";
import { SellerType } from "../_lib/customTypes";

const seller: SellerType = {
	id: "seller_001",
	name: "Arush Art Studio",
	image: "/images/icon.png",
	makeSelfPortrait: true,
	portraitPrice: 249,

	address: {
		address: "Shahpura",
		country: "India",
		city: "Bhopal",
		postalCode: "462016",
	},

	primaryCategories: ["Abstract", "Portrait", "Modern Art"],

	createdAt: Date.now(),

	artWorks: ["painting_001", "painting_002", "painting_003"],
	email: "a@example.com",
	totalSale: 100,
	itemSold: 10,
};

const SellerContext: Context<SellerType[]> = createContext<SellerType[]>([]);

export function SellerProvider({ children }: { children: ReactNode }) {
	const [sellers, setSellers] = useState<SellerType[]>([
		seller,
		{ ...seller, id: "seller_002", name: "Creative Minds Art" },
		{
			...seller,
			id: "seller_003",
			name: "Vibrant Visions Art",
			portraitPrice: 199,
		},
		{ ...seller, id: "seller_004", name: "Colorful Canvas Art" },
		{ ...seller, id: "seller_005", name: "Artistic Expressions" },
	]);

	return (
		<SellerContext.Provider value={sellers}>
			{children}
		</SellerContext.Provider>
	);
}

export function useSellerContext() {
	const context = useContext(SellerContext);
	if (!context) {
		throw new Error(
			"useSellerContext must be used within a SellerProvider",
		);
	}
	return context;
}
