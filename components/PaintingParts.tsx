"use client";

import { PaintingType, SellerType } from "@/app/_lib/customTypes";
import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";
import ImageLightbox from "./ImageLightbox";

export function PaintingImage({
	uri,
	painting,
}: {
	uri: string;
	painting: PaintingType;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* NORMAL IMAGE */}
			<section className="w-full md:w-1/2 self-center md:self-start">
				<div className="relative overflow-hidden rounded-xl shadow-sm">
					<Image
						src={uri}
						alt={`${painting.title} image`}
						width={864}
						height={1184}
						className="object-cover aspect-auto h-auto md:h-[82dvh]"
					/>

					{/* ZOOM BUTTON */}
					<button
						type="button"
						onClick={() => setIsOpen(true)}
						aria-label={`Enlarge ${painting.title}`}
						className="absolute bottom-3 right-3 bg-black/60 p-3 rounded-xl text-sm hover:bg-black/100 transition"
					>
						<ZoomIn className="h-auto w-4 text-[#FFFFFF]" />
					</button>
				</div>
			</section>

			<ImageLightbox
				src={uri}
				alt={`${painting.title} image`}
				painting={painting}
				open={isOpen}
				onClose={() => setIsOpen(false)}
			/>
		</>
	);
}

export function SellerInfo({
	sellerId,
	purchases,
}: {
	sellerId: string;
	purchases: number;
}): ReactElement {
	const router = useRouter();
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
				body: JSON.stringify({ sellerId: sellerId }),
			});

			if (!resArtist.ok) return null;

			const jsonArtist = await resArtist.json();
			setPaintingSeller(jsonArtist.data as SellerType);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		loadData();
	}, [sellerId]);

	const sellerImage = paintingSeller?.image
		? `${paintingSeller.image}&v=${Date.now()}`
		: "/images/portrait.png";

	return (
		<div
			onClick={() => router.push(`/profile/${sellerId}`)}
			className="flex items-center gap-3 cursor-pointer"
		>
			<div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
				{/* Fallback for seller avatar */}
				<Image
					src={sellerImage}
					alt={`${paintingSeller?.name || "Seller"} image`}
					width={512}
					height={512}
					className="object-cover rounded-lg aspect-square"
				/>
			</div>
			<div>
				<p className="font-semibold text-[#0F1724] leading-none">
					{paintingSeller?.name || "Unknown Seller"}
				</p>
				{
					//Text rethink
				}
				<p className="text-sm text-[#98A0AB]">
					Pro Artist • {purchases} Sales
				</p>
			</div>
		</div>
	);
}
