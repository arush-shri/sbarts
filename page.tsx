"use client";

import PaintingCard from "@/components/PaintingCard";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

// assume this exists
// import PaintingCard from "./PaintingCard";

export default function Explore() {
	const [showFilters, setShowFilters] = useState(false);
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState("Relevance");

	const items = Array.from({ length: 6 });
	const options = [
		"Relevance",
		"Price: Low to High",
		"Price: High to Low",
		"Newest",
		"Most Popular",
	];

	return (
		<div className="w-full bg-gray-100 min-h-screen">
			<div className="max-w-7xl mx-auto px-6 md:px-20 py-6 pt-30">
				<section className="flex items-center justify-between mb-6">
					{/* Left side */}
					<div className="flex items-center gap-3">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg bg-white border text-sm font-medium"
						>
							{showFilters ? (
								<>
									<X className="w-4 h-4" />
									Close
								</>
							) : (
								<>
									<SlidersHorizontal className="w-4 h-4" />
									Filters
								</>
							)}
						</button>

						<p className="text-sm font-semibold text-[#98A0AB]">
							Showing 124 results for "Abstract"
						</p>
					</div>

					{/* Sort */}
					<div className="relative inline-block text-left">
						<button
							onClick={() => setOpen(!open)}
							className="flex items-center gap-2 text-sm font-medium bg-white border rounded-lg px-3 py-2 hover:bg-gray-50"
						>
							Sort by:{" "}
							<span className="text-gray-600">{selected}</span>
							<ChevronDown className="w-4 h-4" />
						</button>

						{open && (
							<div className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-md z-50">
								{options.map((option) => (
									<button
										key={option}
										onClick={() => {
											setSelected(option);
											setOpen(false);
										}}
										className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
									>
										{option}
									</button>
								))}
							</div>
						)}
					</div>
				</section>

				{/* MAIN CONTENT */}
				<section className="flex gap-6">
					{/* FILTER SIDEBAR */}
					<div
						className={`
							bg-white rounded-lg p-4 w-64 shrink-0
							md:block
							${showFilters ? "block" : "hidden"}
						`}
					>
						<SlidersHorizontal className="w-4 h-4" />
						<span className="font-semibold mb-4 ">Filters</span>

						{/* Category */}
						<div className="mb-6">
							<h4 className="font-medium mb-2">Category</h4>
							<div className="space-y-2 text-sm text-gray-600">
								<label className="flex gap-2">
									<input type="checkbox" />
									Digital Art
								</label>
								<label className="flex gap-2">
									<input type="checkbox" />
									Paintings
								</label>
								<label className="flex gap-2">
									<input type="checkbox" />
									Photography
								</label>
								<label className="flex gap-2">
									<input type="checkbox" />
									Self Portrait
								</label>
							</div>
						</div>

						{/* Type */}
						<div className="mb-6">
							<h4 className="font-medium mb-2">Type</h4>
							<div className="space-y-2 text-sm text-gray-600">
								<label className="flex gap-2">
									<input type="checkbox" />
									Digital Download
								</label>
								<label className="flex gap-2">
									<input type="checkbox" />
									Physical Item
								</label>
							</div>
						</div>

						{/* Price */}
						<div>
							<h4 className="font-medium mb-2">Price Range</h4>
							<div className="flex items-center gap-2 mb-3">
								<input
									type="number"
									placeholder="0"
									className="w-full border rounded px-2 py-1 text-sm"
								/>
								<span>-</span>
								<input
									type="number"
									placeholder="1000"
									className="w-full border rounded px-2 py-1 text-sm"
								/>
							</div>
							<button className="w-full bg-gray-100 hover:bg-gray-200 rounded py-2 text-sm font-medium">
								Apply
							</button>
						</div>
					</div>

					{/* PAINTINGS AREA */}
					<div className="flex">
						{/* BELOW sm → column | sm+ → wrap */}
						<div className="flex flex-col sm:flex-row sm:flex-wrap gap-y-8">
							{items.map((_, i) => (
								<div key={i} className="sm:w-[260px]">
									<PaintingCard index={i} />
								</div>
							))}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
