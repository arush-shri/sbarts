"use client";

import { PaintingType } from "@/app/_lib/customTypes";
import { thumbnailUrlGenerator } from "@/app/_lib/dataProcessing";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
	artworkIds: string[];
	filterValue: string;
}

const ArtworkGrid = ({ artworkIds, filterValue }: Props) => {
	const ITEMS_PER_PAGE = 6;
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
	const [displayedArtworks, setDisplayedArtworks] = useState<PaintingType[]>(
		[],
	);

	const loadData = async () => {
		const res = await fetch("/api/painting", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ids: artworkIds, filterValue: filterValue }),
		});

		if (!res.ok) return null;

		const json = await res.json();

		const art: PaintingType[] = json.data;
		setDisplayedArtworks(art);
	};

	useEffect(() => {
		loadData();
	}, [filterValue]);

	const hasMore = visibleCount < artworkIds.length;

	return (
		<div className="space-y-12">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{displayedArtworks.map((art) => (
					<a
						href={`/product/${art.id}`}
						key={art.id}
						className="bg-white rounded-2xl overflow-hidden border border-[#0000001A] group cursor-pointer transition-all hover:shadow-md"
					>
						<div className="aspect-[4/3] relative bg-[#F1F3F5]">
							{/* Image source logic based on context ID */}
							<Image
								src={thumbnailUrlGenerator(art?.images)}
								alt={art.title}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>

						<div className="p-5">
							<div className="flex justify-between items-start mb-1">
								<h3 className="font-bold text-[#0F1724] text-lg">
									{art.title}
								</h3>
							</div>
							<div className="flex justify-between items-center text-sm">
								<p className="text-[#98A0AB]">{art.category}</p>
								<p className="font-bold text-[#0F1724]">
									{art.price}
								</p>
							</div>

							<div className="mt-4 pt-4 border-t border-[#0000000D] flex justify-between items-center">
								<span className="text-[#007AFF] text-xs font-bold flex items-center gap-1">
									<span className="w-1.5 h-1.5 bg-[#007AFF] rounded-full"></span>
									{art.isDigital && art.isPhysical
										? "Digital & Physical Art"
										: art.isDigital
											? "Digital Art"
											: art.isPhysical
												? "Physical Art"
												: "Unavailable"}
								</span>
								<span className="text-[#0F1724] text-xs font-semibold hover:underline">
									View details
								</span>
							</div>
						</div>
					</a>
				))}
			</div>

			{hasMore && (
				<div className="flex justify-center pb-12">
					<button
						onClick={() =>
							setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
						}
						className="px-10 py-3 bg-white border border-[#0F1724] text-[#0F1724] font-bold rounded-xl hover:bg-[#0F1724] hover:text-white transition-all shadow-sm"
					>
						Load more paintings
					</button>
				</div>
			)}
		</div>
	);
};

export default ArtworkGrid;
