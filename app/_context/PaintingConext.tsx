"use client";

import {
	Context,
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { PaintingType } from "../_lib/customTypes";

const PaintingContext: Context<PaintingType[]> = createContext<PaintingType[]>(
	[],
);

export function PaintingProvider({ children }: { children: ReactNode }) {
	const [paintings, setPaintings] = useState<PaintingType[]>([]);

	const loadData = async () => {
		const res = await fetch("/api/listing");
		const json: PaintingType[] = await res.json();
		setPaintings(json);
	};

	useEffect(() => {
		loadData();
	}, []);

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
