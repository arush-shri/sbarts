"use client";

import { Context, createContext, ReactNode, useContext, useState } from "react";
import { PaintingType } from "../_lib/customTypes";

const painting: PaintingType = {
	id: "painting_001",
	title: "Neon City Dreams",
	description:
		"A futuristic digital artwork inspired by cyberpunk city lights and night life.",
	category: "Digital Art",
	keywords: ["cyberpunk", "neon", "city", "futuristic"],
	sellerId: "seller_001",

	price: 1499,
	isDigital: true,
	isPhysical: false,
	quantityDigital: 1,
	quantityPhysical: 1,

	images: "/images/digCat.jpg",

	views: 120,
	purchases: 8,
	createdAt: Date.now(),
	updatedAt: Date.now(),
	totalSales: 1,
};

const PaintingContext: Context<PaintingType[]> = createContext<PaintingType[]>(
	[],
);

export function PaintingProvider({ children }: { children: ReactNode }) {
	const [paintings, setPaintings] = useState<PaintingType[]>([
		painting,
		{ ...painting, id: "painting_002" },
		{ ...painting, id: "painting_003" },
		{ ...painting, id: "painting_004" },
		{ ...painting, id: "painting_005" },
		{ ...painting, id: "painting_006" },
		{ ...painting, id: "painting_007" },
		{ ...painting, id: "painting_008" },
		{ ...painting, id: "painting_009" },
		{ ...painting, id: "painting_010" },
		{ ...painting, id: "painting_011" },
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
