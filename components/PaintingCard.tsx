"use client";

import { PaintingType, SellerType } from "@/app/_lib/customTypes";
import { thumbnailUrlGenerator } from "@/app/_lib/dataProcessing";
import Image from "next/image";
import { ReactElement, useEffect, useState } from "react";

export default function PaintingCard({
	artData,
	extraStyle,
}: {
	artData?: PaintingType;
	extraStyle?: string;
}): ReactElement {
	// const searchParams = useSearchParams();
	const painting: PaintingType | undefined = artData;
	const [paintingSeller, setPaintingSeller] = useState<
		SellerType | undefined
	>(undefined);

	const loadData = async () => {
		try {
			const resArtist = await fetch("/api/seller", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ sellerId: painting?.sellerId }),
			});

			if (!resArtist.ok) return null;

			const jsonArtist = await resArtist.json();
			setPaintingSeller(jsonArtist.data as SellerType);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (painting?.sellerId) loadData();
	}, [painting]);

	// useEffect(() => {
	// 	const sessionId = searchParams.get("session_id");
	// 	const cancelled = searchParams.get("cancelled");

	// 	if (cancelled) {
	// 		ShowToast("Payment cancelled ❌", 0);
	// 		return;
	// 	}

	// 	if (!sessionId) return;

	// 	completeOrder(sessionId);

	// 	window.history.replaceState({}, "", "/");
	// }, [searchParams]);

	if (!painting) return <></>;

	return (
		<a
			href={`/product/${painting.id}`}
			className={`flex flex-col w-full ${extraStyle || ""} rounded-lg overflow-hidden cursor-pointer`}
		>
			<Image
				src={thumbnailUrlGenerator(painting.images)}
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
