"use client";

import { usePaintingContext } from "@/app/_context/PaintingConext";
import { PaintingType } from "@/app/_lib/customTypes";
import Link from "next/link";
import PaintingCard from "./PaintingCard";

export default function FeaturedArtworks() {
	const paintingsData: PaintingType[] = usePaintingContext();
	if (!paintingsData || paintingsData.length === 0) return null;

	return (
		<section className="bg-[#f7f1e6] py-20">
			<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
				<div className="mx-auto mb-9 max-w-3xl text-center">
					<div className="text-xs font-bold uppercase tracking-[.22em] text-[#b88d39]">
						Marketplace
					</div>
					<h2 className="mt-2  text-4xl leading-tight text-[#061a3d] md:text-5xl">
						Collect SB Arts
					</h2>
					<p className="mt-3 text-[#6a7280]">
						Original work, limited-edition prints, and selected
						design pieces available by inquiry.
					</p>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{paintingsData.slice(0, 4).map((painting) => (
						<PaintingCard key={painting.id} artData={painting} />
					))}
				</div>

				<div className="mt-8 text-center">
					<Link
						href="/marketplace"
						className="inline-flex items-center justify-center border border-[#061a3d] px-6 py-4 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#061a3d] hover:text-white"
					>
						View Marketplace
					</Link>
				</div>
			</div>
		</section>
	);
}
