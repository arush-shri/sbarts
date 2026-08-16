"use client";

import { PaintingType } from "@/app/_lib/customTypes";
import { imageUrlGenerator } from "@/app/_lib/dataProcessing";
import { Maximize2 } from "lucide-react";
import Image from "next/image";
import { ReactElement, useState } from "react";
import ImageLightbox from "./ImageLightbox";
import InquiryModal from "./InquiryModal";

export default function PaintingCard({
	artData,
	extraStyle,
	showInquiryButton = true,
}: {
	artData?: PaintingType;
	extraStyle?: string;
	showInquiryButton?: boolean;
}): ReactElement {
	const [inquiryOpen, setInquiryOpen] = useState(false);
	const [imageOpen, setImageOpen] = useState(false);
	if (!artData) return <></>;

	return (
		<>
			<article
				className={`group flex h-full w-full flex-col overflow-hidden border border-[#061a3d]/12 bg-white shadow-[0_18px_50px_rgba(6,26,61,.12)] transition duration-500 hover:scale-103 ${extraStyle || ""}`}
			>
				<div className="block">
					<div className="group/image relative aspect-[1.15/1] overflow-hidden bg-[#061a3d]">
						<Image
							src={imageUrlGenerator(artData.images)}
							alt={`${artData.title} image`}
							width={864}
							height={1184}
							className="h-full w-full object-cover"
						/>

						<button
							type="button"
							onClick={() => setImageOpen(true)}
							className="absolute bottom-3 right-3 z-10 grid p-1.5 cursor-pointer place-items-center bg-black/60 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-black/80 group-hover/image:opacity-100"
							aria-label={`Enlarge ${artData.title}`}
						>
							<Maximize2 className="h-5 w-5" />
						</button>
					</div>
				</div>
				<div className="flex flex-1 flex-col p-5">
					<div>
						<h3 className=" text-2xl font-medium leading-tight text-[#061a3d]">
							{artData.title}
						</h3>
					</div>
					<p className="mt-2 line-clamp-2 text-sm text-[#6a7280]">
						{showInquiryButton
							? `${artData.category} · Available by inquiry`
							: artData.category}
					</p>
					{showInquiryButton ? (
						<div className="mt-auto flex items-center justify-between gap-3 pt-5">
							<button
								type="button"
								onClick={() => setInquiryOpen(true)}
								className="w-full cursor-pointer inline-flex items-center justify-center bg-[#061a3d] px-4 py-3 text-xs font-bold uppercase tracking-[.06em] text-white transition hover:bg-[#0b2b63]"
							>
								Inquire
							</button>
						</div>
					) : (
						<div className="mt-auto pt-5" />
					)}
				</div>
			</article>
			{showInquiryButton ? (
				<InquiryModal
					painting={artData}
					open={inquiryOpen}
					onClose={() => setInquiryOpen(false)}
				/>
			) : null}
			<ImageLightbox
				src={imageUrlGenerator(artData.images)}
				alt={`${artData.title} image`}
				open={imageOpen}
				onClose={() => setImageOpen(false)}
			/>
		</>
	);
}
