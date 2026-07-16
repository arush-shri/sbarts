"use client";

import { PaintingType } from "@/app/_lib/customTypes";
import { imageUrlGenerator } from "@/app/_lib/dataProcessing";
import InquiryModal from "@/components/InquiryModal";
import Loading from "@/components/Loading";
import { PaintingImage } from "@/components/PaintingParts";
import { ShowToast } from "@/components/Toaster";
import { Share2 } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ProductPage() {
	const { productId } = useParams();
	const [painting, setPainting] = useState<PaintingType | undefined | null>(
		null,
	);
	const [inquiryOpen, setInquiryOpen] = useState(false);
	const hasCountedView = useRef(false);

	useEffect(() => {
		const loadData = async () => {
			try {
				const shouldIncrementView = !hasCountedView.current;
				hasCountedView.current = true;

				const res = await fetch("/api/painting", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						id: productId,
						incrementView: shouldIncrementView,
					}),
				});

				if (!res.ok) {
					setPainting(undefined);
					return;
				}

				const json = await res.json();
				setPainting(json.data as PaintingType);
			} catch (error) {
				console.error(error);
				setPainting(undefined);
			}
		};

		loadData();
	}, [productId]);

	if (painting === undefined) {
		notFound();
	}

	if (painting === null) {
		return <Loading />;
	}

	const handleShare = async () => {
		const shareData = {
			title: painting.title,
			text: "Check out this SB Arts painting.",
			url: window.location.href,
		};

		try {
			if (navigator.share) {
				await navigator.share(shareData);
			} else {
				await navigator.clipboard.writeText(window.location.href);
				ShowToast("Link copied to clipboard.", 2);
			}
		} catch {
			console.log("Share cancelled");
		}
	};

	return (
		<main className="bg-[#f7f1e6] text-[#182033]">
			<section className="bg-[radial-gradient(circle_at_82%_20%,rgba(214,173,88,.2),transparent_30%),linear-gradient(135deg,#061a3d,#0b2b63)] py-14 text-white">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
					<div className="text-xs font-bold uppercase tracking-[.22em] text-[#d6ad58]">
						Artwork
					</div>
					<h1 className="mt-2  text-5xl leading-tight text-[#d6ad58] md:text-7xl">
						{painting.title}
					</h1>
				</div>
			</section>

			<section className="mx-auto flex w-[min(1180px,calc(100%-40px))] flex-col gap-12 py-16 md:flex-row">
				<PaintingImage
					uri={imageUrlGenerator(painting.images)}
					title={painting.title}
				/>

				<div className="flex w-full flex-col gap-8 md:w-1/2">
					<div>
						<div className="text-xs font-bold uppercase tracking-[.22em] text-[#b88d39]">
							{painting.category}
						</div>
						<h2 className="mt-3  text-4xl leading-tight text-[#061a3d]">
							{painting.title}
						</h2>
						<p className="mt-4 text-[#6a7280]">
							{painting.description}
						</p>
					</div>

					<div className="grid grid-cols-2 gap-4 border border-[#061a3d]/12 bg-white p-6">
						<div>
							<p className="text-xs uppercase tracking-[.12em] text-[#6a7280]">
								Format
							</p>
							<p className="mt-1 font-semibold text-[#061a3d]">
								Catalogue Work
							</p>
						</div>
						{painting.resolution && (
							<div>
								<p className="text-xs uppercase tracking-[.12em] text-[#6a7280]">
									Resolution
								</p>
								<p className="mt-1 font-semibold text-[#061a3d]">
									{painting.resolution}
								</p>
							</div>
						)}
					</div>

					<div className="flex flex-wrap gap-3">
						<button
							type="button"
							onClick={() => setInquiryOpen(true)}
							className="flex-1 bg-[#d6ad58] px-6 py-4 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39]"
						>
							Inquire
						</button>
						<button
							type="button"
							onClick={handleShare}
							className="grid h-[52px] w-[52px] place-items-center border border-[#061a3d]/15 bg-white text-[#061a3d] transition hover:bg-[#061a3d] hover:text-white"
							aria-label="Share artwork"
						>
							<Share2 className="h-5 w-5" />
						</button>
					</div>

					{painting.keywords?.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{painting.keywords.map((tag) => (
								<span
									key={tag}
									className="bg-white px-3 py-2 text-sm font-medium text-[#6a7280]"
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</div>
			</section>

			<InquiryModal
				painting={painting}
				open={inquiryOpen}
				onClose={() => setInquiryOpen(false)}
			/>
		</main>
	);
}
