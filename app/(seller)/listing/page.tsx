"use client";

import { useSellerContext } from "@/app/_context/SellerContext";
import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { SellerType } from "@/app/_lib/customTypes";
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
		category: "Digital Art",
		medium: "",
		description: "",
		price: 0,
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
		if (
			!data.title.trim() ||
			!data.category.trim() ||
			!data.medium.trim() ||
			!data.description.trim() ||
			!data.listingType.trim() ||
			!data.uploadedFile
		) {
			ShowToast("Please fill all required fields.", 1);
			return;
		}

		if (data.price <= 0) {
			ShowToast("Price must be greater than 0.", 1);
			return;
		}

		if (data.quantity <= 0) {
			ShowToast("Quantity must be greater than 0.", 1);
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
			<div className="flex min-h-screen px-5 lg:px-20 pt-24 flex justify-center">
				<div className="w-full flex flex-col md:flex-row gap-8">
					{/* Sidebar Checklist */}
					<aside className="md:w-64 flex flex-col gap-6">
						<div className="border border-[#0000001A] bg-white rounded-xl p-6">
							<h3 className="font-bold text-[#0F1724] mb-4">
								Listing Checklist
							</h3>
							<ul className="space-y-4">
								{[
									"Basic Details",
									"Media Upload",
									"Pricing & Inventory",
								].map((step) => (
									<li
										key={step}
										className="flex items-center gap-3 text-sm"
									>
										<div
											className={`w-4 h-4 rounded-full border-2 flex items-center justify-center border-[#98A0AB]`}
										/>
										<span className="text-[#0F1724] font-medium">
											{step}
										</span>
									</li>
								))}
							</ul>
							<div className="mt-8 pt-6 border-t border-[#0000001A]">
								<p className="text-xs text-[#98A0AB] mb-2">
									Need help?
								</p>
								<a
									href="#"
									className="text-sm text-blue-600 font-medium hover:underline"
								>
									Read Seller Guidelines →
								</a>
							</div>
						</div>
					</aside>

					{/* Main Form Area */}
					<main className="flex-1 flex flex-col gap-6 mb-10">
						<header>
							<h1 className="text-2xl font-bold text-[#0F1724]">
								Create New Listing
							</h1>
							<p className="text-[#98A0AB] text-sm">
								Add details about your artwork to start selling.
							</p>
						</header>

						{/* Basic Information Section */}
						<section className="border border-[#0000001A] bg-white rounded-xl p-8 space-y-6">
							<h2 className="font-bold text-[#0F1724] border-b border-[#0000001A] pb-4">
								Basic Information
							</h2>
							<InputBox
								label="Artwork Title"
								name="title"
								placeholder="e.g. Sunset over the Mountains"
								onChange={handleInputChange}
							/>

							<div className="grid sm:grid-cols-2 gap-4">
								<div className="flex flex-col gap-2">
									<label className="text-sm font-semibold text-[#0F1724]">
										Category
									</label>
									<select
										className="w-full p-3 rounded-md bg-[#00000006] text-[#98A0AB] outline-none"
										onChange={(e) =>
											handleInputChange(
												"category",
												e.target.value,
											)
										}
									>
										<option>Digital Art</option>
										<option>Paintings</option>
										<option>Photography</option>
										<option>Self Portrait</option>
									</select>
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
						<section className="border border-[#0000001A] bg-white rounded-xl p-8 space-y-6">
							<h2 className="font-bold text-[#0F1724] border-b border-[#0000001A] pb-4">
								Media Upload
							</h2>
							<label className="text-sm font-semibold text-[#0F1724]">
								Main Artwork Image
							</label>
							<ArtworkUpload callback={handleInputChange} />
						</section>

						{/* Pricing & Inventory */}
						<section className="border border-[#0000001A] bg-white rounded-xl p-8 space-y-6">
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
						</section>

						{/* Footer Buttons */}
						<footer className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-[#0000001A]">
							<button className="px-6 py-2 text-[#0F1724] font-medium">
								Cancel
							</button>
							<button
								onClick={handleSubmit}
								className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
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
						<div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
