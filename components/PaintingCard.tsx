"use client";

import { usePaintingContext } from "@/app/_context/PaintingConext";
import { useSellerContext } from "@/app/_context/SellerContext";
import { PaintingType, SellerType } from "@/app/_lib/customTypes";
import Image from "next/image";
import { ReactElement } from "react";

export default function PaintingCard({
	artData,
	extraStyle,
	index,
}: {
	artData?: PaintingType;
	extraStyle?: string;
	index?: number;
}): ReactElement {
	const paintingsData: PaintingType[] = usePaintingContext();
	const painting: PaintingType | undefined = index
		? paintingsData[index]
		: artData;
	const sellers: SellerType[] = useSellerContext();
	const paintingSeller: SellerType | undefined = sellers.find(
		(seller) => seller.id === painting?.sellerId,
	);

	if (!painting) return <></>;

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
					{paintingSeller?.name || "Seller"}
				</span>
			</div>
		</a>
	);
}
