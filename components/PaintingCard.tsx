"use client";

import { PaintingType } from "@/app/_lib/customTypes";
import { thumbnailUrlGenerator } from "@/app/_lib/dataProcessing";
import Image from "next/image";
import Link from "next/link";
import { ReactElement, useState } from "react";
import InquiryModal from "./InquiryModal";

export default function PaintingCard({
	artData,
	extraStyle,
}: {
	artData?: PaintingType;
	extraStyle?: string;
}): ReactElement {
	const [inquiryOpen, setInquiryOpen] = useState(false);

	if (!artData) return <></>;

	return (
		<>
			<article
				className={`group flex h-full w-full flex-col overflow-hidden border border-[#061a3d]/12 bg-white shadow-[0_18px_50px_rgba(6,26,61,.12)] ${extraStyle || ""}`}
			>
				<Link href={`/product/${artData.id}`} className="block">
					<div className="relative aspect-[1.15/1] overflow-hidden bg-[#061a3d]">
						<Image
							src={thumbnailUrlGenerator(artData.images)}
							alt={`${artData.title} image`}
							width={864}
							height={1184}
							className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
						/>
					</div>
				</Link>
				<div className="flex flex-1 flex-col p-5">
					<Link href={`/product/${artData.id}`}>
						<h3 className="font-serif text-2xl font-medium leading-tight text-[#061a3d]">
							{artData.title}
						</h3>
					</Link>
					<p className="mt-2 line-clamp-2 text-sm text-[#6a7280]">
						{artData.category} · Available by inquiry
					</p>
					<div className="mt-auto flex items-center justify-between gap-3 pt-5">
						<span className="font-bold text-[#061a3d]">
							Inquire
						</span>
						<button
							type="button"
							onClick={() => setInquiryOpen(true)}
							className="inline-flex items-center justify-center bg-[#061a3d] px-4 py-3 text-xs font-bold uppercase tracking-[.06em] text-white transition hover:bg-[#0b2b63]"
						>
							Inquire
						</button>
					</div>
				</div>
			</article>
			<InquiryModal
				painting={artData}
				open={inquiryOpen}
				onClose={() => setInquiryOpen(false)}
			/>
		</>
	);
}
