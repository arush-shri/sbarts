"use client";

import { collections } from "@/app/gallery/collections";
import { useSiteContent } from "@/app/_context/SiteContentContext";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCollectionCards() {
	const { getPageContent } = useSiteContent();
	const galleryContent = getPageContent("gallery");

	return (
		<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
			{collections.map((collection) => (
				<Link key={collection.id} href={`/gallery/${collection.id}`}>
					<article className="h-full origin-center cursor-pointer border border-[#061a3d]/12 bg-white shadow-[0_18px_50px_rgba(6,26,61,.12)] transition duration-300 hover:scale-105">
						<div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br">
							<Image
								src={
									galleryContent.fields?.[collection.imageField] ||
									collection.image
								}
								alt={collection.title}
								fill
								className="object-cover"
							/>
						</div>
						<div className="p-5 text-center">
							<h3 className="text-xl font-medium text-[#061a3d]">
								{collection.title}
							</h3>
						</div>
					</article>
				</Link>
			))}
		</div>
	);
}
