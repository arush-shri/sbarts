"use client";

import { ExploreFilterButton, ExploreSort } from "@/components/ExploreParts";
import PaintingCard from "@/components/PaintingCard";
import { SlidersHorizontal } from "lucide-react";
import { useRef } from "react";
import { FilterButtonRef } from "../_lib/customTypes";

// assume this exists
// import PaintingCard from "./PaintingCard";

export default function Explore() {
	const filterRef = useRef<FilterButtonRef>(null);

	// Mock data for rendering components
	const items = Array.from({ length: 6 });

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
							console.log("Sort value:", sortValue)
						}
					/>
				</div>
			</section>

			<section className="flex flex-col md:flex-row mb-20">
				{/* Sidebar Filter - Mobile Responsive */}
				<ExploreFilterButton ref={filterRef} />

				{/* Art Grid */}
				<main className="flex-1">
					<div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
						{items.map((_, idx) => (
							<PaintingCard index={idx} key={idx} extraStyle="" />
						))}
					</div>
				</main>
			</section>
		</div>
	);
}
