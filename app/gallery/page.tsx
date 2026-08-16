"use client";

import { ART_CATEGORIES } from "@/app/_lib/artCategories";
import { PaintingType } from "@/app/_lib/customTypes";
import PageIntro from "@/components/PageIntro";
import PaintingCard from "@/components/PaintingCard";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

const collections = [
	{
		id: "hope",
		title: ART_CATEGORIES[0],
		copy: "Art exploring resilience, identity, migration, memory, and the quiet strength of everyday lives.",
		image: "/images/hope.png",
	},
	{
		id: "portrait",
		title: ART_CATEGORIES[1],
		copy: "Drawing character, identity, and emotion through careful observation.",
		image: "/images/portrait.png",
	},
	{
		id: "wildlife",
		title: ART_CATEGORIES[2],
		copy: "Celebrating the beauty and dignity of the natural world.",
		image: "/images/wildlife.png",
	},
	{
		id: "high-altitude",
		title: ART_CATEGORIES[3],
		copy: "Inspired by aviation, aerospace, mountains, clouds, and exploration.",
		image: "/images/altitude.png",
	},
	{
		id: "design",
		title: ART_CATEGORIES[4],
		copy: "Where precision, creativity, and visual storytelling come together.",
		image: "/images/design.png",
	},
] as const;

const collectionIdToCategory: Record<string, string> = {
	hope: "Hope & Dignity",
	portrait: "Portrait",
	wildlife: "Wildlife",
	"high-altitude": "High Altitude",
	design: "Design",
};

export default function GalleryPage() {
	const [items, setItems] = useState<PaintingType[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedCollectionId, setSelectedCollectionId] = useState<
		string | null
	>(null);

	const selectedCollection = useMemo(
		() =>
			collections.find(
				(collection) => collection.id === selectedCollectionId,
			) || null,
		[selectedCollectionId],
	);

	const loadCollection = useCallback(async (collectionId: string) => {
		setLoading(true);
		try {
			const category =
				collectionIdToCategory[collectionId] || collectionId;
			const res = await fetch("/api/explore", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					category: [category],
					sort: "Newest",
				}),
			});
			const json = await res.json();
			setItems(Array.isArray(json.data) ? json.data : []);
		} catch (error) {
			console.error(error);
			setItems([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!selectedCollectionId) return;
		loadCollection(selectedCollectionId);
	}, [loadCollection, selectedCollectionId]);

	const handleOpenCollection = (collectionId: string) => {
		setSelectedCollectionId(collectionId);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleBack = () => {
		setSelectedCollectionId(null);
		setItems([]);
	};

	return (
		<main className="bg-white text-[#182033]">
			<section className="bg-[#061a3d] py-5 text-white">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
					<PageIntro
						pageKey="gallery"
						titleClassName="heading-font font-bold text-5xl leading-tight text-[#d6ad58] md:text-7xl"
						subtitleClassName="heading-font mt-4 text-2xl md:text-3xl"
						subtextClassName="mt-4 max-w-3xl heading-font text-xl md:text-2xl text-white/85"
					/>
				</div>
			</section>

			<section className="py-10">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))] min-h-[calc(100vh-220px)]">
					{selectedCollection ? (
						<div className="animate-[fadeIn_0.3s_ease-out] min-h-[calc(100vh-260px)]">
							<div className="mb-6 flex items-center gap-3">
								<button
									type="button"
									onClick={handleBack}
									className="inline-flex h-11 w-11 items-center justify-center border border-[#061a3d]/15 bg-white text-[#061a3d] transition hover:border-[#d6ad58] hover:text-[#d6ad58]"
									aria-label="Back to collections"
								>
									<ArrowLeft className="h-5 w-5" />
								</button>
								<div>
									<p className="text-xs font-bold uppercase tracking-[.22em] text-[#b88d39]">
										Collection
									</p>
									<h2 className="mt-1 text-3xl text-[#061a3d] md:text-4xl">
										{selectedCollection.title}
									</h2>
								</div>
							</div>

							{loading ? (
								<div className="flex min-h-[50vh] items-center justify-center text-center text-[#6a7280]">
									Loading artwork...
								</div>
							) : items.length ? (
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
									{items.map((item) => (
										<PaintingCard
											key={item.id}
											artData={item}
											showInquiryButton={false}
										/>
									))}
								</div>
							) : (
								<div className="border border-[#061a3d]/12 bg-white p-10 text-center text-[#6a7280]">
									No artwork found for this collection.
								</div>
							)}
						</div>
					) : (
						<div className="grid min-h-[calc(100vh-260px)] gap-5 transition-all duration-300">
							{collections.map((collection) => (
								<article
									key={collection.id}
									id={collection.id}
									className="grid overflow-hidden border border-[#061a3d]/12 bg-white transition-all duration-300 hover:-translate-y-0.5 md:grid-cols-[180px_1fr]"
								>
									<div className="relative min-h-32 overflow-hidden bg-gradient-to-br">
										<Image
											src={collection.image}
											alt={collection.title}
											fill
											className="object-cover"
										/>
									</div>
									<div className="p-6">
										<h2 className="text-2xl text-[#061a3d]">
											{collection.title}
										</h2>
										<p className="mt-2 text-[#6a7280]">
											{collection.copy}
										</p>
										<button
											type="button"
											onClick={() =>
												handleOpenCollection(
													collection.id,
												)
											}
											className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[.06em] text-[#b88d39] transition duration-300 hover:translate-x-1"
										>
											View collection
											<span aria-hidden="true">→</span>
										</button>
									</div>
								</article>
							))}
						</div>
					)}
				</div>
			</section>
		</main>
	);
}
