"use client";

import { SellerType } from "@/app/_lib/customTypes";
import { convertNumToDate } from "@/app/_lib/dataProcessing";
import ArtworkGrid from "@/components/ArtworkGrid";
import Loading from "@/components/Loading";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";

export default function ArtistProfile({
	sellerId,
}: {
	sellerId: string;
}): ReactElement {
	const [artistData, setArtistData] = useState<SellerType | undefined | null>(
		null,
	);

	const loadData = async () => {
		try {
			const res = await fetch("/api/seller", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ sellerId }),
			});

			if (!res.ok) {
				setArtistData(undefined);
				return null;
			}

			const json = await res.json();
			setArtistData(json.data as SellerType);
		} catch (err) {
			console.error("Error loading");
			setArtistData(undefined);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	if (artistData === undefined) notFound();

	if (artistData === null) {
		return <Loading />;
	}

	return (
		<div className="px-5 md:px-20 pt-24 bg-[#F8F9FA] min-h-screen flex flex-col md:flex-row gap-8">
			{/* Sidebar Profile Card */}
			<aside className="w-full md:w-80 bg-white rounded-2xl p-8 border border-[#0000001A] h-fit sticky">
				<div className="flex flex-col items-center text-center mb-6">
					<div className="w-24 h-24 rounded-full overflow-hidden mb-4 relative">
						<Image
							src="/images/phoCat.jpg"
							alt="Amelia Park"
							fill
							className="object-cover"
						/>
					</div>
					<h2 className="text-[#0F1724] text-xl font-bold">
						{artistData.name}
					</h2>
					<p className="text-[#98A0AB] text-xs mt-1">
						{artistData.address.country}
					</p>
				</div>

				<div className="space-y-4 pt-6 border-t border-[#0000000D]">
					<div className="flex justify-between text-sm">
						<span className="text-[#98A0AB]">
							Primary categories
						</span>
						<span className="text-[#0F1724] font-medium text-right">
							{artistData.primaryCategories.join(", ")}...
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-[#98A0AB]">Member since</span>
						<span className="text-[#0F1724] font-medium">
							{convertNumToDate(artistData.createdAt)}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-[#98A0AB]">Total artworks</span>
						<span className="text-[#0F1724] font-medium">
							{artistData.artWorks.length}
						</span>
					</div>
				</div>
			</aside>

			{/* Main Content Area */}
			<main className="flex-1">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
					<div>
						<h1 className="text-2xl font-bold text-[#0F1724]">
							Artworks by Amelia
						</h1>
						<p className="text-[#98A0AB] text-sm mt-1">
							Browse all pieces this artist has posted across
							digital downloads, paintings, and more.
						</p>
					</div>
				</div>

				{/* Filter Bar */}
				<div className="flex flex-wrap items-center gap-3 mb-8">
					<button className="px-5 py-2 bg-[#007AFF] text-white rounded-full text-sm font-semibold shadow-sm">
						All
					</button>
					{[
						"Digital art",
						"Paintings",
						"Photography",
						"Self portrait",
					].map((cat) => (
						<button
							key={cat}
							className="px-5 py-2 bg-white border border-[#0000001A] text-[#98A0AB] rounded-full text-sm font-medium hover:bg-gray-50"
						>
							{cat}
						</button>
					))}
				</div>

				{/* Paginated Artwork Component */}
				<ArtworkGrid artworkIds={artistData.artWorks} />
			</main>
		</div>
	);
}
