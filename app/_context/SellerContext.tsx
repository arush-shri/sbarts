"use client";

import { Context, createContext, ReactNode, useContext, useState } from "react";
import { SellerType } from "../_lib/customTypes";

const seller: SellerType = {
	id: "seller_001",
	name: "Arush Art Studio",
	image: "/images/icon.png",
	makeSelfPortrait: true,
	portraitPrice: 249,
	address: "Bhopal, Madhya Pradesh, India",
};

const SellerContext: Context<SellerType[]> = createContext<SellerType[]>([]);

export function SellerProvider({ children }: { children: ReactNode }) {
	const [sellers, setSellers] = useState<SellerType[]>([
		seller,
		{ ...seller, id: "seller_002", name: "Creative Minds Art" },
		{ ...seller, id: "seller_003", name: "Vibrant Visions Art" },
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
