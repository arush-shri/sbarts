"use client";

import { usePaintingContext } from "@/app/_context/PaintingConext";
import { PaintingType } from "@/app/_lib/customTypes";
import Image from "next/image";
import { ReactElement } from "react";

export default function PaintingCard({
	index,
	extraStyle,
}: {
	index: number;
	extraStyle?: string;
}): ReactElement {
	const paintingsData: PaintingType[] = usePaintingContext();
	const painting: PaintingType = paintingsData[index];

	return (
		<a
			href={`/product/${painting.id}`}
			className={`flex flex-col w-full ${extraStyle || ""} rounded-lg overflow-hidden cursor-pointer`}
		>
			<Image
				src={painting.images}
				alt={`${painting.title} image`}
				width={864}
				height={1184}
				className="object-cover rounded-lg aspect-square"
			/>
			<div className="flex flex-col mt-3">
				<div className="flex flex-row justify-between">
					<span className="text-[#0F1724] text-md font-semibold">
						{painting.title}
					</span>
					<span className="text-[#0F1724] text-md font-semibold">
						${painting.price}
					</span>
				</div>
				<span className="text-[#98A0AB] text-sm mt-2">
					{painting.seller.name}
				</span>
			</div>
		</a>
	);
}
