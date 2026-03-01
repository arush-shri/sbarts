"use client";

import InputBox from "@/components/EnlistPart";
import { useRef, useState } from "react";

export default function CreateListing() {
	// Using ref to store form data as requested
	const formData = useRef({
		title: "",
		category: "",
		medium: "",
		description: "",
		price: 0,
		quantity: 1,
		listingType: "Digital Download",
	});

	const [activeStep, setActiveStep] = useState("Basic Details");

	const handleInputChange = (name: string, value: string | number) => {
		formData.current = { ...formData.current, [name]: value };
	};

	const handleSubmit = () => {
		console.log("Submitting Data:", formData.current);
		alert("Listing Published! Check console for data.");
	};

	return (
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
										className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${activeStep === step ? "border-blue-600" : "border-[#98A0AB]"}`}
									>
										{activeStep === step && (
											<div className="w-2 h-2 bg-blue-600 rounded-full" />
										)}
									</div>
									<span
										className={
											activeStep === step
												? "text-[#0F1724] font-medium"
												: "text-[#98A0AB]"
										}
									>
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
						<div className="border-2 border-dashed border-[#0000001A] bg-[#f4f7ff] rounded-xl mt-3 p-12 flex flex-col items-center justify-center text-center cursor-pointer">
							<div className="w-10 h-10 mb-4 text-blue-500 bg-white rounded-full flex items-center justify-center shadow-sm">
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
									/>
								</svg>
							</div>
							<p className="text-[#0F1724] font-semibold">
								Click to upload or drag and drop
							</p>
							<p className="text-xs text-[#98A0AB] mt-1">
								High resolution required. Max file size 50MB.
								<br />
								Recommended aspect ratios: 1:1, 4:3, or 16:9.
							</p>
						</div>
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
													type === "Digital Download"
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
	);
}
