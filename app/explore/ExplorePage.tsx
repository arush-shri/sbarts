"use client";

import { ExploreFilterButton, ExploreSort } from "@/components/ExploreParts";
import PaintingCard from "@/components/PaintingCard";
import { SlidersHorizontal } from "lucide-react";
import { ReactElement, useEffect, useRef, useState } from "react";
import { FilterButtonRef, PaintingType } from "../_lib/customTypes";

export default function ExplorePage({
	category,
	keyword,
}: {
	category?: string;
	keyword?: string;
}): ReactElement {
	const filterRef = useRef<FilterButtonRef>(null);
	const [items, setItems] = useState<PaintingType[]>([]);
	const filtersRef = useRef<{
		search?: string;
		category?: string;
		minPrice?: number;
		maxPrice?: number;
		type?: string;
		sort?: string;
	}>({
		search: "",
		category: "",
		minPrice: undefined,
		maxPrice: undefined,
		type: undefined,
		sort: "Newest",
	});

	const loadData = async () => {
		const res = await fetch("/api/explore", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(filtersRef.current),
		});

		const data = await res.json();
		setItems(data);
	};

	const updateFilter = (key: string, value: string | string[]) => {
		if (key === "price" && !Array.isArray(value)) {
			const range: string[] = value.split(",");
			filtersRef.current.minPrice = Number(range[0]);
			filtersRef.current.maxPrice = Number(range[1]);
		} else filtersRef.current = { ...filtersRef.current, [key]: value };
		loadData();
	};

	useEffect(() => {
		loadData();
	}, []);

	return (
		<div className="px-5 md:px-20 pt-24">
			<section className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
				<div className="flex w-full items-center justify-between md:justify-end gap-4">
					{/* Mobile Filter Toggle Button */}
					<button
						onClick={() => filterRef.current?.trigger()}
						className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
					>
						<SlidersHorizontal className="w-4 h-auto text-[#0F1724]" />

						<span className="font-medium text-sm text-[#0F1724]">
							Filters
						</span>
					</button>

					<ExploreSort
						callback={(sortValue) =>
							updateFilter("sort", sortValue)
						}
					/>
				</div>
			</section>

			<section className="flex flex-col md:flex-row mb-20">
				{/* Sidebar Filter - Mobile Responsive */}
				<ExploreFilterButton
					ref={filterRef}
					onClickCallback={updateFilter}
				/>

				{/* Art Grid */}
				<main className="flex-1">
					<div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
						{items.map((art, idx) => (
							<PaintingCard
								artData={art}
								key={art.id}
								extraStyle=""
							/>
						))}
					</div>
				</main>
			</section>
		</div>
	);
}
