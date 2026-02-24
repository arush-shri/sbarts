"use client";

import { Context, createContext, ReactNode, useContext, useState } from "react";
import { PaintingType } from "../_lib/customTypes";

const PaintingContext: Context<PaintingType[]> = createContext<PaintingType[]>(
	[],
);

export function PaintingProvider({ children }: { children: ReactNode }) {
	const [paintings, setPaintings] = useState<PaintingType[]>([
		{
			id: "painting_001",
			title: "Neon City Dreams",
			description:
				"A futuristic digital artwork inspired by cyberpunk city lights and night life.",
			category: "Digital Art",
			keywords: ["cyberpunk", "neon", "city", "futuristic"],
			seller: {
				id: "seller_001",
				name: "Arush Art Studio",
			},

			price: 1499,
			isDigital: true,
			isPhysical: false,
			quantity: 1,

			images: "/images/digCat.jpg",

			pickupAddress: {
				country: "India",
				city: "Lucknow",
				postalCode: "226001",
			},

			views: 120,
			purchases: 8,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		},
	]);

	return (
		<PaintingContext.Provider value={paintings}>
			{children}
		</PaintingContext.Provider>
	);
}

export function usePaintingContext() {
	const context = useContext(PaintingContext);
	if (!context) {
		throw new Error(
			"usePaintingContext must be used within a PaintingProvider",
		);
	}
	return context;
}
