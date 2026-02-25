"use client";

import { FilterButtonRef } from "@/app/_lib/customTypes";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { forwardRef, ReactElement, useImperativeHandle, useState } from "react";

export function ExploreCategories({
	callback,
}: {
	callback: (selectedCategories: string[]) => void;
}): ReactElement {
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	const categories: string[] = [
		"Digital Art",
		"Paintings",
		"Photography",
		"Self Portrait",
	];

	const toggleCategory = (cat: string) => {
		setSelectedCategories((prev) => {
			const newCategories = prev.includes(cat)
				? prev.filter((c) => c !== cat) // uncheck
				: [...prev, cat]; // check

			callback(newCategories);
			return newCategories;
		});
	};

	return (
		<div className="flex flex-col gap-3 text-[#98A0AB]">
			{categories.map((cat) => (
				<label
					key={cat}
					className="flex items-center gap-3 cursor-pointer group"
				>
					<input
						type="checkbox"
						checked={selectedCategories.includes(cat)}
						onChange={() => toggleCategory(cat)}
						className="w-4 h-4 rounded accent-blue-600"
					/>

					<span className="text-sm group-hover:text-[#0F1724]">
						{cat}
					</span>
				</label>
			))}
		</div>
	);
}

export function ExploreTypes({
	callback,
}: {
	callback: (selectedTypes: string[]) => void;
}): ReactElement {
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

	const types = ["Digital Download", "Physical Item"];

	const toggleType = (type: string) => {
		setSelectedTypes((prev) => {
			const newTypes = prev.includes(type)
				? prev.filter((t) => t !== type) // uncheck
				: [...prev, type];
			callback(newTypes);
			return newTypes;
		});
	};

	return (
		<div className="flex flex-col gap-3">
			{types.map((type) => (
				<label
					key={type}
					className="flex items-center gap-3 cursor-pointer group"
				>
					<input
						type="checkbox"
						checked={selectedTypes.includes(type)}
						onChange={() => toggleType(type)}
						className="w-4 h-4 rounded accent-blue-600"
					/>

					<span className="text-sm text-[#98A0AB] group-hover:text-[#0F1724]">
						{type}
					</span>
				</label>
			))}
		</div>
	);
}

export function ExplorePriceRange({
	callback,
}: {
	callback: (minPrice: number, maxPrice: number) => void;
}): ReactElement {
	const [minPrice, setMinPrice] = useState<string>("");
	const [maxPrice, setMaxPrice] = useState<string>("");

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-2">
				<input
					type="number"
					placeholder="0"
					min={0}
					value={minPrice}
					onChange={(e) => setMinPrice(e.target.value)}
					className="w-full p-2 border border-[#98A0AB] rounded-md text-sm outline-none focus:ring-1 focus:ring-[#0F1724] text-[#0F1724]"
				/>

				<span className="text-[#98A0AB]">-</span>

				<input
					type="number"
					placeholder="1000"
					value={maxPrice}
					onChange={(e) => setMaxPrice(e.target.value)}
					min={1}
					className="w-full p-2 border border-[#98A0AB] rounded-md text-sm outline-none focus:ring-1 focus:ring-[#0F1724] text-[#0F1724]"
				/>
			</div>

			<button
				onClick={() => callback(Number(minPrice), Number(maxPrice))}
				className="w-full py-2 border border-[#98A0AB] rounded-lg text-sm font-medium hover:bg-gray-50 transition text-[#0F1724]"
			>
				Apply
			</button>
		</div>
	);
}

export const ExploreFilterButton = forwardRef<FilterButtonRef, {}>(
	(props, ref) => {
		const [isFilterOpen, setIsFilterOpen] = useState(false);
		const handleTrigger = () => {
			setIsFilterOpen((prev) => !prev);
		};

		useImperativeHandle(ref, () => ({
			trigger() {
				handleTrigger();
			},
		}));

		return (
			<aside
				className={`
                        fixed md:static top-0 left-0 z-50 md:z-auto
                        h-screen md:h-auto
                        bg-white md:bg-transparent
                        transition-transform duration-300 ease-in-out
                        ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
                        md:translate-x-0
                        w-60 md:w-50 lg:w-60
                        space-y-8
                        shadow-lg md:shadow-none
                        p-0 md:pr-8 p-6 md:p-0
                    `}
			>
				<div>
					<div className="flex items-center gap-2 mb-6">
						<SlidersHorizontal className="w-5 h-auto hidden md:block text-[#0F1724]" />
						<button
							onClick={() => setIsFilterOpen(false)}
							className="block md:hidden"
						>
							<X className="w-5 h-auto text-[#0F1724]" />
						</button>
						<span className="text-lg font-bold text-[#0F1724]">
							Filters
						</span>
					</div>

					{/* Category */}
					<div className="space-y-4 mb-8">
						<h3 className="text-[#0F1724] font-semibold text-sm">
							Category
						</h3>
						<ExploreCategories
							callback={(selectedCategories: string[]) =>
								console.log(
									"Selected Categories:",
									selectedCategories,
								)
							}
						/>
					</div>

					<hr className="border-[#0000001A]" />

					{/* Type */}
					<div className="space-y-4 my-8">
						<h3 className="text-[#0F1724] font-semibold text-sm">
							Type
						</h3>
						<ExploreTypes
							callback={(selectedTypes: string[]) =>
								console.log("Selected Types:", selectedTypes)
							}
						/>
					</div>

					<hr className="border-[#0000001A]" />

					{/* Price Range */}
					<div className="space-y-4 mt-8">
						<h3 className="text-[#0F1724] font-semibold text-sm">
							Price Range
						</h3>
						<ExplorePriceRange
							callback={(minPrice, maxPrice) =>
								console.log(
									`Selected price range: $${minPrice} - $${maxPrice}`,
								)
							}
						/>
					</div>
				</div>
			</aside>
		);
	},
);

export function ExploreSort({
	callback,
}: {
	callback: (sortValue: string) => void;
}): ReactElement {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState("Relevance");

	const options = [
		"Relevance",
		"Price: Low to High",
		"Price: High to Low",
		"Newest",
		"Most Popular",
	];

	return (
		<div className="relative inline-block text-left">
			<div className="flex items-center gap-2 text-sm border border-[#0000001A] rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition">
				<span className="text-[#98A0AB]">Sort by:</span>
				<button
					onClick={() => setOpen(!open)}
					className="flex items-center font-semibold gap-1 text-[#0F1724]"
				>
					Relevance <ChevronDown size={16} />
				</button>
			</div>

			{open && (
				<div className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-md z-50">
					{options.map((option) => (
						<button
							key={option}
							onClick={() => {
								setSelected(option);
								setOpen(false);
							}}
							className="w-full text-left px-4 py-2 text-sm text-[#0F1724] hover:bg-gray-100"
						>
							{option}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
