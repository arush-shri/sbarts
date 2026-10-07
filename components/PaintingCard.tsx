"use client";

import { PaintingType } from "@/app/_lib/customTypes";
import { imageUrlGenerator } from "@/app/_lib/dataProcessing";
import { cachePaintingForNavigation } from "@/app/_lib/paintingNavigation";
import Image from "next/image";
import { KeyboardEvent, MouseEvent, ReactElement, useState } from "react";
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
	if (!artData) return <></>;

	const openPainting = () => {
		cachePaintingForNavigation(artData);
		window.open(
			`/product/${encodeURIComponent(artData.id)}`,
			"_blank",
			"noopener,noreferrer",
		);
	};

	const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			openPainting();
		}
	};

	const stopCardNavigation = (event: MouseEvent<HTMLElement>) => {
		event.stopPropagation();
	};

	return (
		<>
			<article
				onClick={openPainting}
				onKeyDown={handleCardKeyDown}
				tabIndex={0}
				role="link"
				className={`group flex h-full w-full flex-col overflow-hidden border border-[#061a3d]/12 bg-white shadow-[0_18px_50px_rgba(6,26,61,.12)] transition duration-500 hover:scale-103 ${extraStyle || ""}`}
			>
				<div className="block cursor-pointer">
					<div className="relative flex aspect-[1.15/1] items-center justify-center overflow-hidden bg-[#061a3d]">
						<Image
							src={imageUrlGenerator(artData.images)}
							alt={`${artData.title} image`}
							width={864}
							height={1184}
							className="h-[93%] w-auto object-contain"
						/>

					</div>
				</div>
				<div className="flex flex-1 flex-col p-5">
					<div>
						<h3 className=" text-lg font-medium leading-tight text-[#061a3d]">
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
								onClick={(event) => {
									stopCardNavigation(event);
									setInquiryOpen(true);
								}}
								className="w-full cursor-pointer inline-flex items-center justify-center bg-[#061a3d] px-4 py-3 font-bold uppercase tracking-[.06em] text-white transition hover:bg-[#0b2b63]"
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
		</>
	);
}
