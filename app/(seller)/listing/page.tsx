"use client";

import { useSellerContext } from "@/app/_context/SellerContext";
import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { ART_CATEGORIES } from "@/app/_lib/artCategories";
import { SellerType } from "@/app/_lib/customTypes";
import { validateListing } from "@/app/_lib/validation";
import InputBox from "@/components/EnlistPart";
import ProtectedPage from "@/components/ProtectedPage";
import ArtworkUpload from "@/components/SellerParts";
import { ShowToast } from "@/components/Toaster";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function CreateListing() {
	// Using ref to store form data as requested
	const [isUploading, setIsUploading] = useState(false);
	const [uploadStage, setUploadStage] = useState("");

	const router = useRouter();
	const formData = useRef({
		title: "",
		category: ART_CATEGORIES[0],
		medium: "",
		description: "",
		price: 1,
		quantity: 1,
		listingType: "Digital Download",
		uploadedFile: null,
	});
	const { artistData, setSellerData } = useSellerContext();

	const handleInputChange = (name: string, value: string | number | File) => {
		formData.current = { ...formData.current, [name]: value };
	};

	const handleSubmit = async () => {
		const data = formData.current;
		// ---------- VALIDATION ----------
		const result = validateListing(data, true);

		if (!result.valid) {
			ShowToast(result.message, 1);
			return;
		}

		// ---------- CREATE FORMDATA ----------
		setIsUploading(true);
		setUploadStage("Preparing files...");
		const body = new FormData();
		const sellerId = artistData ? artistData.id : "";

		body.append("title", data.title);
		body.append("category", data.category);
		body.append("medium", data.medium);
		body.append("description", data.description);
		body.append("price", String(data.price));
		body.append("quantity", String(data.quantity));
		body.append("listingType", data.listingType);
		body.append("sellerId", sellerId);

		// uploadedFile should be File object ideally
		body.append("uploadedFile", data.uploadedFile as any);

		// ---------- SEND ----------
		try {
			const token = await firebaseClientAuth.currentUser?.getIdToken();

			if (!token) {
				ShowToast("Please sign in again.", 0);
				setIsUploading(false);
				return;
			}

			const stageInterval = setInterval(() => {
				setUploadStage((prev) => {
					if (prev === "Preparing files...")
						return "Uploading high-resolution artwork...";
					if (prev === "Uploading high-resolution artwork...")
						return "Processing images & applying watermarks (this takes a moment)...";
					if (
						prev ===
						"Processing images & applying watermarks (this takes a moment)..."
					)
						return "Saving listing details...";
					return prev;
				});
			}, 4000);

			const res = await fetch("/api/listing", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body,
			});

			clearInterval(stageInterval);

			if (!res.ok) {
				ShowToast("Upload failed", 0);
				setIsUploading(false);
				return;
			}
			const responseData = await res.json();
			const newPaintingId = responseData.id;
			setSellerData({
				...artistData,
				artWorks: [...(artistData?.artWorks || []), newPaintingId],
			} as SellerType);
			setUploadStage("Success! Redirecting...");
			router.replace("/dashboard");
			setIsUploading(false);
		} catch (err) {
			setIsUploading(false);
			console.error(err);
			ShowToast("Something went wrong", 0);
		}
	};

	return (
		<ProtectedPage>
			<div className="min-h-screen bg-[#f7f1e6] px-5 py-8 lg:px-20 lg:py-10">
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
					<main className="mb-10 flex flex-1 flex-col gap-6">
						<header className="rounded-[28px] border border-[#061a3d]/12 bg-[radial-gradient(circle_at_top_left,rgba(214,173,88,.16),transparent_40%),white] p-8 shadow-[0_20px_60px_rgba(6,26,61,.08)]">
							<h1 className="font-serif text-3xl text-[#061a3d]">
								Create New Listing
							</h1>
							<p className="mt-2 text-sm text-[#6a7280]">
								Add details about your artwork to start selling.
							</p>
						</header>

						<section className="space-y-6 rounded-[28px] border border-[#061a3d]/12 bg-white p-8 shadow-[0_20px_60px_rgba(6,26,61,.08)]">
							<h2 className="border-b border-[#061a3d]/10 pb-4 font-serif text-2xl text-[#061a3d]">
								Basic Information
							</h2>
							<InputBox
								label="Artwork Title"
								name="title"
								placeholder="e.g. Sunset over the Mountains"
								onChange={handleInputChange}
							/>

							<div className="grid sm:grid-cols-2 gap-4">
								<div className="flex flex-col gap-2 w-full">
									<label className="text-sm font-semibold text-[#0F1724]">
										Category
									</label>

									<div className="relative">
										<select
											onChange={(e) =>
												handleInputChange(
													"category",
													e.target.value,
												)
											}
											className="w-full appearance-none rounded-2xl border border-[#061a3d]/15 bg-[#fdfaf4] px-4 py-3 pr-12 text-[#182033] focus:border-[#d6ad58] focus:outline-none focus:ring-2 focus:ring-[#d6ad58]/20 cursor-pointer"
										>
											{ART_CATEGORIES.map((category) => (
												<option
													key={category}
													value={category}
												>
													{category}
												</option>
											))}
										</select>

										<div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6a7280]">
											▼
										</div>
									</div>
								</div>
								<InputBox
									label="Medium / Style"
									name="medium"
									placeholder="e.g. Oil on Canvas, Vector"
									onChange={handleInputChange}
								/>
							</div>

							<InputBox
								label="Description"
								name="description"
								type="textarea"
								placeholder="Describe the inspiration, technique, and story behind this piece..."
								onChange={handleInputChange}
							/>
						</section>

						{/* Media Upload Section */}
						<section className="space-y-6 rounded-[28px] border border-[#061a3d]/12 bg-white p-8 shadow-[0_20px_60px_rgba(6,26,61,.08)]">
							<h2 className="border-b border-[#061a3d]/10 pb-4 font-serif text-2xl text-[#061a3d]">
								Media Upload
							</h2>
							<label className="text-sm font-semibold text-[#0F1724]">
								Main Artwork Image
							</label>
							<ArtworkUpload callback={handleInputChange} />
						</section>

						{/* Pricing & Inventory */}
						{/* <section className="border border-[#0000001A] bg-white rounded-xl p-8 space-y-6">
							<h2 className="font-bold text-[#0F1724] border-b border-[#0000001A] pb-4">
								Pricing & Inventory
							</h2>
							<div className="grid grid-cols-2 gap-4">
								<InputBox
									label="Price (USD)"
									name="price"
									type="number"
									placeholder="0.00"
									onChange={handleInputChange}
								/>
								<div>
									<InputBox
										label="Available Quantity"
										name="quantity"
										type="number"
										placeholder="1"
										onChange={handleInputChange}
									/>
									<p className="text-[10px] text-[#98A0AB] mt-1">
										Leave empty for unlimited (Digital items
										only)
									</p>
								</div>
							</div>

							<div className="space-y-3">
								<label className="text-sm font-semibold text-[#0F1724]">
									Listing Type
								</label>
								<div className="flex flex-col sm:flex-row mt-3 gap-3 sm:gap-6">
									{["Digital Download", "Physical Item"].map(
										(type) => (
											<label
												key={type}
												className="flex items-center gap-2 text-sm text-[#0F1724] cursor-pointer"
											>
												<input
													type="radio"
													name="listingType"
													defaultChecked={
														type ===
														"Digital Download"
													}
													className="accent-[#0F1724]"
													onChange={() =>
														handleInputChange(
															"listingType",
															type,
														)
													}
												/>
												{type}
											</label>
										),
									)}
								</div>
							</div>
						</section> */}

						{/* Footer Buttons */}
						<footer className="flex flex-col justify-end gap-4 border-t border-[#061a3d]/10 pt-4 sm:flex-row">
							<button
								onClick={() => router.back()}
								className="rounded-full border border-[#061a3d]/15 px-6 py-2 text-sm font-semibold text-[#061a3d] transition hover:border-[#d6ad58] hover:text-[#d6ad58]"
							>
								Cancel
							</button>
							<button
								onClick={handleSubmit}
								className="rounded-full bg-[#d6ad58] px-6 py-2 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39]"
							>
								Publish Listing
							</button>
						</footer>
					</main>
				</div>
			</div>
			{isUploading && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 text-center">
						<div className="w-10 h-10 border-4 border-[#D5AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
						<p className="text-sm font-semibold text-gray-900 mb-1">
							Creating your listing
						</p>
						<p className="text-xs text-gray-500 animate-pulse">
							{uploadStage}
						</p>
					</div>
				</div>
			)}

			{/* Ensure your submit button checks this state */}
			<button type="submit" disabled={isUploading}>
				{isUploading ? "Uploading..." : "Publish Artwork"}
			</button>
		</ProtectedPage>
	);
}
