"use client";

import { usePaintingContext } from "@/app/_context/PaintingConext";
import { PaintingType } from "@/app/_lib/customTypes";
import PaintingCard from "./PaintingCard";

export default function FeaturedArtworks() {
	const paintingsData: PaintingType[] = usePaintingContext();
	if (!paintingsData || paintingsData.length === 0) return null;

	return (
		<section className="flex flex-col justify-center px-5 lg:px-20 mt-15 md:mt-36">
			<span className="font-bold text-[#0F1724] text-3xl">
				Featured Artwork
			</span>
			<span className="text-[#98A0AB] text-lg mt-2 ">
				Hand-picked selection of exceptional digital art, paintings and
				photography.
			</span>
			<div className="flex flex-wrap gap-y-3 w-full mt-10 justify-between">
				{paintingsData.map((painting, index) => (
					<PaintingCard
						key={index}
						artData={painting}
						extraStyle="sm:w-[20dvw]"
					/>
				))}
			</div>
		</section>
	);
}
