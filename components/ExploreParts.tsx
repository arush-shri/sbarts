"use client";

import { ExploreButtonProps, FilterButtonRef } from "@/app/_lib/customTypes";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { forwardRef, ReactElement, useImperativeHandle, useState } from "react";

export function ExploreCategories({
	callback,
	selected,
}: {
	callback: (selectedCategories: string[]) => void;
	selected: string[];
}): ReactElement {
	const [selectedCategories, setSelectedCategories] =
		useState<string[]>(selected);

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
	callback: (selectedTypes: "digital" | "physical" | "all") => void;
}): ReactElement {
	const [selected, setSelected] = useState({
		digital: true,
		physical: true,
	});

	const toggleType = (type: "digital" | "physical") => {
		const updated = {
			...selected,
			[type]: !selected[type],
		};

		setSelected(updated);

		if (updated.digital && updated.physical) {
			callback("all");
		} else if (updated.digital) {
			callback("digital");
		} else if (updated.physical) {
			callback("physical");
		} else {
			// if both unchecked → fallback to all
			callback("all");
			setSelected({ digital: true, physical: true });
		}
	};

	return (
		<div className="flex flex-col gap-3">
			<label className="flex items-center gap-3 cursor-pointer group">
				<input
					type="checkbox"
					checked={selected.digital}
					onChange={() => toggleType("digital")}
					className="w-4 h-4 rounded accent-blue-600"
				/>
				<span className="text-sm text-[#98A0AB] group-hover:text-[#0F1724]">
					Digital Download
				</span>
			</label>

			<label className="flex items-center gap-3 cursor-pointer group">
				<input
					type="checkbox"
					checked={selected.physical}
					onChange={() => toggleType("physical")}
					className="w-4 h-4 rounded accent-blue-600"
				/>
				<span className="text-sm text-[#98A0AB] group-hover:text-[#0F1724]">
					Physical Item
				</span>
			</label>
		</div>
	);
}

export function ExplorePriceRange({
	callback,
	minSelected,
	maxSelected,
}: {
	callback: (minPrice: number, maxPrice: number) => void;
	minSelected: string;
	maxSelected: string;
}): ReactElement {
	const [minPrice, setMinPrice] = useState<string>(minSelected);
	const [maxPrice, setMaxPrice] = useState<string>(maxSelected);

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

export const ExploreFilterButton = forwardRef<
	FilterButtonRef,
	ExploreButtonProps
>((props, ref) => {
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
						selected={props.filterData.category || []}
						callback={(selectedCategories: string[]) => {
							props.onClickCallback?.(
								"category",
								selectedCategories,
							);
						}}
					/>
				</div>

				<hr className="border-[#0000001A]" />

				{/* Type */}
				<div className="space-y-4 my-8">
					<h3 className="text-[#0F1724] font-semibold text-sm">
						Type
					</h3>
					<ExploreTypes
						callback={(selectedTypes: string) => {
							props.onClickCallback?.("type", selectedTypes);
						}}
					/>
				</div>

				<hr className="border-[#0000001A]" />

				{/* Price Range */}
				<div className="space-y-4 mt-8">
					<h3 className="text-[#0F1724] font-semibold text-sm">
						Price Range
					</h3>
					<ExplorePriceRange
						minSelected={(
							props.filterData.minPrice || 0
						).toString()}
						maxSelected={(
							props.filterData.maxPrice || 1
						).toString()}
						callback={(minPrice, maxPrice) => {
							props.onClickCallback?.(
								"price",
								`${minPrice},${maxPrice}`,
							);
						}}
					/>
				</div>
			</div>
		</aside>
	);
});

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
					{selected} <ChevronDown size={16} />
				</button>
			</div>

			{open && (
				<div className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-md z-50">
					{options.map((option) => (
						<button
							key={option}
							onClick={() => {
								setSelected(option);
								callback(option);
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
