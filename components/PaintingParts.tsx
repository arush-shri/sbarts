"use client";

import { useSellerContext } from "@/app/_context/SellerContext";
import { SellerType } from "@/app/_lib/customTypes";
import { X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { ReactElement, useState } from "react";

export function PaintingImage({ uri, title }: { uri: string; title: string }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* NORMAL IMAGE */}
			<section className="w-full md:w-1/2 self-center md:self-start">
				<div className="relative overflow-hidden rounded-xl shadow-sm">
					<Image
						src={uri}
						alt={`${title} image`}
						width={864}
						height={1184}
						className="object-cover aspect-auto h-auto md:h-[82dvh]"
					/>

					{/* ZOOM BUTTON */}
					<button
						onClick={() => setIsOpen(true)}
						className="absolute bottom-3 right-3 bg-black/60 p-3 rounded-xl text-sm hover:bg-black/100 transition"
					>
						<ZoomIn className="h-auto w-4 text-[#FFFFFF]" />
					</button>
				</div>
			</section>

			{/* FULLSCREEN MODAL */}
			{isOpen && (
				<div
					className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
					onClick={() => setIsOpen(false)}
				>
					{/* Prevent close when clicking image */}
					<div
						className="relative max-w-[95vw] max-h-[95vh]"
						onClick={(e) => e.stopPropagation()}
					>
						<Image
							src={uri}
							alt={`${title} fullscreen`}
							width={1600}
							height={2000}
							className="object-contain max-h-[95vh] w-auto h-auto rounded-lg"
						/>

						{/* CLOSE BUTTON */}
						<button
							onClick={() => setIsOpen(false)}
							className="absolute top-3 right-3 bg-black/60 p-2 rounded-lg hover:bg-black/80 transition"
						>
							<X className="h-auto w-5 text-[#FFFFFF]" />
						</button>
					</div>
				</div>
			)}
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
	const sellers: SellerType[] = useSellerContext();
	const paintingSeller: SellerType | undefined = sellers.find(
		(seller) => seller.id === sellerId,
	);
	return (
		<div className="flex items-center gap-3">
			<div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
				{/* Fallback for seller avatar */}
				<Image
					src={paintingSeller?.image || "/default-avatar.png"}
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
