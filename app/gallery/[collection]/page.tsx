"use client";

import { collectionIdToCategory, collections } from "@/app/gallery/collections";
import { PaintingType } from "@/app/_lib/customTypes";
import PaintingCard from "@/components/PaintingCard";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GalleryCollectionPage() {
	const params = useParams<{ collection: string }>();
	const collection = collections.find((item) => item.id === params.collection);
	const [items, setItems] = useState<PaintingType[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!collection) return;
		fetch("/api/explore", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				category: [collectionIdToCategory[collection.id]],
				sort: "Newest",
				surface: "gallery",
			}),
		})
			.then((response) => response.json())
			.then((json) => setItems(Array.isArray(json.data) ? json.data : []))
			.catch(() => setItems([]))
			.finally(() => setLoading(false));
	}, [collection]);

	if (!collection) {
		return <main className="p-10 text-center">Collection not found.</main>;
	}

	return (
		<main className="min-h-screen bg-white text-[#182033]">
			<section className="bg-[#061a3d] py-10 text-white">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
					<Link href="/gallery" className="text-sm text-[#d6ad58]">← All collections</Link>
					<p className="mt-8 text-xs font-bold uppercase tracking-[.22em] text-[#d6ad58]">Collection</p>
					<h1 className="mt-2 text-5xl font-bold text-[#d6ad58]">{collection.title}</h1>
					<p className="mt-4 max-w-3xl text-white/80">{collection.copy}</p>
				</div>
			</section>
			<section className="py-10">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
					{loading ? <div className="py-20 text-center text-[#6a7280]">Loading artwork...</div> : items.length ? <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{items.map((item) => <PaintingCard key={item.id} artData={item} showInquiryButton={false} />)}</div> : <div className="border border-[#061a3d]/12 p-10 text-center text-[#6a7280]">No artwork found for this collection.</div>}
				</div>
			</section>
		</main>
	);
}
