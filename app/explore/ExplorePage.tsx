"use client";

import { ART_CATEGORIES } from "@/app/_lib/artCategories";
import { PaintingType } from "@/app/_lib/customTypes";
import PageIntro from "@/components/PageIntro";
import PaintingCard from "@/components/PaintingCard";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactElement, useCallback, useEffect, useState } from "react";

const categories = ["All", ...ART_CATEGORIES];

const categoryIdToName: Record<string, string> = {
	hope: "Hope & Dignity",
	portrait: "Portrait",
	wildlife: "Wildlife",
	"high-altitude": "High Altitude",
	design: "Design",
};

export default function ExplorePage({
	category,
	keyword,
	title = "Marketplace",
}: {
	category?: string;
	keyword?: string;
	title?: string;
}): ReactElement {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [items, setItems] = useState<PaintingType[]>([]);
	const [selectedCategory, setSelectedCategory] = useState(category || "All");
	const [search, setSearch] = useState(keyword || "");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (searchParams.toString()) {
			window.history.replaceState(window.history.state, "", pathname);
		}
	}, [pathname, searchParams]);

	const loadData = useCallback(
		async (nextCategory: string, nextSearch: string) => {
			setLoading(true);
			try {
				const body = {
					search: nextSearch.trim() || undefined,
					category:
						nextCategory && nextCategory !== "All"
							? [nextCategory]
							: undefined,
					sort: "Newest",
					surface: "marketplace",
				};

				const res = await fetch("/api/explore", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				});

				const json = await res.json();
				setItems(Array.isArray(json.data) ? json.data : []);
			} catch (error) {
				console.error(error);
				setItems([]);
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	useEffect(() => {
		const mappedCategory =
			category && categoryIdToName[category]
				? categoryIdToName[category]
				: category || "All";
		const nextSearch = keyword || "";
		setSelectedCategory(mappedCategory);
		setSearch(nextSearch);
		loadData(mappedCategory, nextSearch);
	}, [category, keyword, loadData]);

	const handleCategory = (nextCategory: string) => {
		setSelectedCategory(nextCategory);
		loadData(nextCategory, search);
	};

	return (
		<main className="bg-[#f7f1e6] text-[#182033]">
			<section className="bg-[#061a3d] py-5 text-white">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
					{title === "Marketplace" ? (
						<PageIntro
							pageKey="marketplace"
							titleClassName="heading-font font-bold text-5xl leading-tight text-[#d6ad58] md:text-7xl"
							subtitleClassName="heading-font mt-4 text-xl md:text-2xl"
							subtextClassName="heading-font mt-4 max-w-3xl text-lg text-white/75"
						/>
					) : (
						<h1 className="heading-font font-bold text-5xl leading-tight text-[#d6ad58] md:text-7xl">
							{title}
						</h1>
					)}
				</div>
			</section>

			<section className="py-10 min-h-[calc(100vh-200px)]">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))] h-full flex flex-col">
					<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="flex flex-wrap gap-2">
							{categories.map((item) => (
								<button
									key={item}
									type="button"
									onClick={() => handleCategory(item)}
									className={`border px-4 py-2 text-sm font-bold uppercase tracking-[.06em] transition ${
										selectedCategory === item
											? "border-[#061a3d] bg-[#061a3d] text-white"
											: "border-[#061a3d]/15 bg-white text-[#061a3d] hover:border-[#d6ad58]"
									}`}
								>
									{item}
								</button>
							))}
						</div>
					</div>

					{loading ? (
						<div className="py-16 text-center text-[#6a7280] flex-1 flex items-center justify-center">
							Loading artwork...
						</div>
					) : items.length ? (
						<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 flex-1">
							{items.map((art) => (
								<PaintingCard key={art.id} artData={art} />
							))}
						</div>
					) : (
						<div className="border border-[#061a3d]/12 bg-white p-10 text-center text-[#6a7280] flex-1 flex items-center justify-center">
							No artwork found for this selection.
						</div>
					)}
				</div>
			</section>
		</main>
	);
}
