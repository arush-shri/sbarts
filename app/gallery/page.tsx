"use client";

import { ART_CATEGORIES } from "@/app/_lib/artCategories";
import { PaintingType } from "@/app/_lib/customTypes";
import PaintingCard from "@/components/PaintingCard";
import Image from "next/image";
import { useEffect, useState } from "react";

const collections = [
	{
		id: "hope",
		title: ART_CATEGORIES[0],
		copy: "Art exploring resilience, identity, migration, memory, and the quiet strength of everyday lives.",
		image: "/images/hope.png",
		className: "from-[#d6ad58] to-[#0c2a62]",
	},
	{
		id: "portrait",
		title: ART_CATEGORIES[1],
		copy: "Drawing character, identity, and emotion through careful observation.",
		image: "/images/portrait.png",
		className: "from-[#b9a190] to-[#463029]",
	},
	{
		id: "wildlife",
		title: ART_CATEGORIES[2],
		copy: "Celebrating the beauty and dignity of the natural world.",
		image: "/images/wildlife.png",
		className: "from-[#304b36] to-[#b39250]",
	},
	{
		id: "high-altitude",
		title: ART_CATEGORIES[3],
		copy: "Inspired by aviation, aerospace, mountains, clouds, and exploration.",
		image: "/images/altitude.png",
		className: "from-[#a4bfd8] to-[#112957]",
	},
	{
		id: "design",
		title: ART_CATEGORIES[4],
		copy: "Where precision, creativity, and visual storytelling come together.",
		image: "/images/design.png",
		className: "from-[#0f2e67] to-[#d6ad58]",
	},
];

export default function GalleryPage() {
	const [items, setItems] = useState<PaintingType[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const res = await fetch("/api/explore", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ sort: "Newest" }),
				});
				const json = await res.json();
				setItems(Array.isArray(json.data) ? json.data : []);
			} catch (error) {
				console.error(error);
				setItems([]);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	return (
		<main className="bg-white text-[#182033]">
			<section className="bg-[radial-gradient(circle_at_82%_20%,rgba(214,173,88,.2),transparent_30%),linear-gradient(135deg,#061a3d,#0b2b63)] py-10 text-white">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
					<h1 className="heading-font font-bold text-5xl leading-tight text-[#d6ad58] md:text-7xl">
						Gallery
					</h1>
					<p className="mt-4 max-w-3xl text-lg text-white/75">
						Explore work centered on humanity, portraiture, nature,
						aerospace, and design.
					</p>
				</div>
			</section>

			<section className="py-20">
				<div className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-5">
					{collections.map((collection) => (
						<article
							key={collection.id}
							id={collection.id}
							className="grid overflow-hidden border border-[#061a3d]/12 bg-white md:grid-cols-[180px_1fr]"
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
								<h2 className=" text-2xl text-[#061a3d]">
									{collection.title}
								</h2>
								<p className="mt-2 text-[#6a7280]">
									{collection.copy}
								</p>{" "}
								<a
									href={`/marketplace?category=${collection.id}`}
									className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[.06em] text-[#b88d39] transition duration-300 hover:scale-108 origin-left"
								>
									View collection
									<span>→</span>
								</a>{" "}
							</div>
						</article>
					))}
				</div>
			</section>

			<section className="bg-[#f7f1e6] py-20">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
					<div className="mb-9 text-center">
						<div className="text-xs font-bold uppercase tracking-[.22em] text-[#b88d39]">
							Available Work
						</div>
						<h2 className="mt-2  text-4xl text-[#061a3d]">
							Current Catalogue
						</h2>
					</div>
					{loading ? (
						<div className="py-12 text-center text-[#6a7280]">
							Loading artwork...
						</div>
					) : (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{items.map((item) => (
								<PaintingCard key={item.id} artData={item} />
							))}
						</div>
					)}
				</div>
			</section>
		</main>
	);
}
