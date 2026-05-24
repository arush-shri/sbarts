"use client";

import { PaintingType } from "@/app/_lib/customTypes";
import { watermarkedUrlGenerator } from "@/app/_lib/dataProcessing";
import { BUYING_ENABLED } from "@/app/_lib/featureFlags";
import Loading from "@/components/Loading";
import { PaintingImage, SellerInfo } from "@/components/PaintingParts";
import { ShowToast } from "@/components/Toaster";
import { Share2 } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ProductPage() {
	const { productId } = useParams();
	const [painting, setPainting] = useState<PaintingType | undefined | null>(
		null,
	);
	const hasCountedView = useRef(false);

	const loadData = async () => {
		try {
			const shouldIncrementView = !hasCountedView.current;
			hasCountedView.current = true;

			const res = await fetch("/api/painting", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: productId,
					incrementView: shouldIncrementView,
				}),
			});

			if (!res.ok) {
				setPainting(undefined);
				return null;
			}

			const json = await res.json();

			const art: PaintingType = json.data;
			setPainting(art);
		} catch (error) {
			console.log("Error loading");
			setPainting(undefined);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	if (painting === undefined) {
		notFound();
	}

	if (painting === null) {
		return <Loading />;
	}

	const handleShare = async () => {
		const shareData = {
			title: document.title,
			text: "Check out this painting!",
			url: window.location.href,
		};

		try {
			if (navigator.share) {
				await navigator.share(shareData);
			} else {
				// fallback (copy link)
				await navigator.clipboard.writeText(window.location.href);
				ShowToast("Link copied to clipboard!", 2);
			}
		} catch (err) {
			console.log("Share cancelled");
		}
	};

	return (
		<div className="flex w-full px-4 py-8 px-5 lg:px-20 pt-24">
			<div className="flex flex-col md:flex-row gap-12">
				{/* Left Column: Image Gallery/Preview */}
				<PaintingImage
					uri={watermarkedUrlGenerator(painting.images)}
					title={painting.title}
				/>

				{/* Right Column: Product Details */}
				<section className="flex flex-col space-y-8 w-full md:w-2/3">
					{/* Seller Info */}

					<SellerInfo
						sellerId={painting.sellerId}
						purchases={painting.purchases}
					/>

					{/* Title and Price */}
					<div className="space-y-2">
						<h1 className="text-4xl font-bold text-[#0F1724]">
							{painting.title}
						</h1>
						<p className="text-2xl font-semibold text-[#0F1724]">
							${painting.price.toFixed(2)}
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center gap-3">
						{BUYING_ENABLED ? (
							<a
								href={`/purchase?productId=${painting.id}&orderType=${painting.isDigital ? "digital" : "physical"}`}
								className="flex-1 rounded-lg bg-[#0061f2] py-4 text-center font-bold text-white transition hover:bg-blue-700"
							>
								Purchase
							</a>
						) : (
							<button
								type="button"
								disabled
								className="flex-1 rounded-lg bg-[#E5EAF1] py-4 text-center font-bold text-[#64748B] cursor-not-allowed"
							>
								Purchasing Paused
							</button>
						)}
						<button
							onClick={handleShare}
							className="rounded-lg border border-gray-200 p-4 transition hover:bg-gray-100"
						>
							<Share2 className="h-auto w-6 text-[#0F1724]" />
						</button>
					</div>

					{/* Technical Specs Grid */}
					<div className="grid grid-cols-2 gap-y-6 rounded-xl bg-[#f4f7ff] p-6">
						<div>
							<p className="text-xs text-[#98A0AB] uppercase tracking-wider mb-1">
								Format
							</p>
							<p className="font-semibold text-[#0F1724] text-md">
								{painting.isDigital
									? "Digital Download"
									: "Physical Item"}
							</p>
						</div>
						{painting.isDigital && painting.resolution && (
							<div>
								<p className="text-xs text-[#98A0AB] uppercase tracking-wider mb-1">
									Resolution
								</p>
								<p className="font-semibold text-[#0F1724] text-md">
									{painting.resolution}
								</p>
							</div>
						)}
					</div>

					{/* Description Section */}
					<div className="space-y-4">
						<h3 className="font-bold text-[#0F1724]">
							About this artwork
						</h3>
						<p className="leading-relaxed text-[#98A0AB]">
							{painting.description}
						</p>
						{painting.isDigital && (
							<p className="text-sm text-[#98A0AB]">
								Upon purchase, you will receive a
								high-resolution link to download the artwork
								without the watermark.
							</p>
						)}
					</div>

					{/* Tags */}
					<div className="flex flex-wrap gap-2 pt-4">
						{painting.keywords.map((tag) => (
							<span
								key={tag}
								className="rounded-md bg-[#f4f7ff] px-3 py-1 text-sm font-medium text-[#98A0AB] first-letter:uppercase"
							>
								{tag}
							</span>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
