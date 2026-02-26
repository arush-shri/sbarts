"use client";

import { ArtistCard, InputField } from "@/components/PurchaseParts";
import { Lock, Upload } from "lucide-react";
import { ReactElement, useCallback, useRef, useState } from "react";
import { useSellerContext } from "../_context/SellerContext";
import { SellerType } from "../_lib/customTypes";

export default function PortraitPurchase(): ReactElement {
	const sellers: SellerType[] = useSellerContext();
	const [selectedSeller, setSelectedSeller] = useState("seller_001");
	const seller: SellerType | undefined = sellers.find(
		(s) => s.id === selectedSeller,
	);

	// THE MASTER DATA STORE (Does not trigger re-renders on change)
	const formData = useRef({
		firstName: "",
		lastName: "",
		address: "",
		city: "",
		postalCode: "",
		email: "",
		phoneNumber: "",
		sellerId: "seller_001",
		uploadedFile: null,
	});

	// Callback to allow children to update the ref
	const handleRefUpdate = useCallback((name: string, value: string) => {
		formData.current = { ...formData.current, [name]: value };
	}, []);

	const handleCheckout = () => {
		console.log(
			"Submitting non-render data from useRef:",
			formData.current,
		);
		// Add your logic here (Stripe, API call, etc.)
	};

	const platformFee = 5;
	const taxes = 12.0; // to be calulated based on location, etc.

	// Form validation can be added here before allowing checkout
	return (
		<div className="min-h-screen bg-[#FDFDFD] px-5 lg:px-20 pt-27 font-sans">
			<div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
				{/* Sidebar Navigation */}
				<aside className="w-full h-auto md:w-64 shrink-0">
					<div className="bg-white border border-gray-100 rounded-xl p-6 space-y-8 shadow-md">
						<h3 className="text-[#98A0AB] text-xs font-bold uppercase tracking-widest">
							Licensing Steps
						</h3>
						<div className="space-y-6">
							{[
								{
									step: 1,
									title: "Upload Photo",
									active: true,
								},
								{
									step: 2,
									title: "Choose Artist",
									active: true,
								},
								{
									step: 3,
									title: "Review & Pay",
									active: false,
								},
							].map((s) => (
								<div key={s.step} className="flex gap-4">
									<div
										className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${s.active ? "bg-[#0066FF] text-white" : "bg-gray-100 text-[#98A0AB]"}`}
									>
										{s.step}
									</div>
									<p
										className={`text-sm font-bold ${s.active ? "text-[#0F1724]" : "text-[#98A0AB]"}`}
									>
										{s.title}
									</p>
								</div>
							))}
						</div>
					</div>
				</aside>

				{/* Main Form Content */}
				<main className="flex flex-col space-y-8 mb-20">
					<section className="bg-white border border-gray-100 rounded-2xl p-8 space-y-8 shadow-md">
						<h3 className="text-[#0F1724] text-xl font-bold border-b border-[#0000001A] pb-4">
							1. Upload Your Photo
						</h3>
						<div
							className="border-2 border-dashed border-[#0000001A] rounded-xl p-12 flex flex-col items-center 
                        justify-center text-center space-y-3 bg-[#f4f7ff]/50 hover:bg-[#f1f5ff] transition cursor-pointer"
						>
							<div className="p-3 bg-blue-50 text-[#0066FF] rounded-full">
								<Upload className="h-auto w-5" />
							</div>
							<p className="text-sm font-bold text-[#0F1724]">
								Click to upload your photo
							</p>
							<p className="text-xs text-[#98A0AB]">
								Use a clear, well-lit photo for the best
								results.
								<br />
								Supported formats: JPG, PNG.
							</p>
						</div>
					</section>

					<section className="bg-white border border-gray-100 rounded-2xl p-8 space-y-8 shadow-md">
						<h3 className="text-[#0F1724] font-bold border-b border-[#0000001A] pb-4">
							2. Select an Artist
						</h3>
						<p className="text-xs text-[#98A0AB]">
							Choose an artist whose style matches your vision.
						</p>

						<div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
							{sellers.map((s) => (
								<ArtistCard
									key={s.id}
									seller={s}
									isSelected={seller?.id === s.id}
									onSelect={(id: string) =>
										setSelectedSeller(id)
									}
								/>
							))}
						</div>
					</section>

					<section className="bg-white border border-gray-100 rounded-2xl p-8 space-y-8 shadow-md">
						<h3 className="text-[#0F1724] font-bold border-b border-[#0000001A] pb-4">
							2. Shipping Method
						</h3>
						<div className="w-full max-w-4xl font-sans">
							<div className="space-y-6">
								<div className="flex flex-col md:flex-row gap-4">
									<InputField
										name="firstName"
										label="First Name"
										placeholder="Jane"
										updateParentRef={handleRefUpdate}
									/>
									<InputField
										name="lastName"
										label="Last Name"
										placeholder="Doe"
										updateParentRef={handleRefUpdate}
									/>
								</div>
								<InputField
									name="email"
									label="Email Address"
									placeholder="jane.doe@example.com"
									updateParentRef={handleRefUpdate}
									fullWidth
								/>
								<InputField
									name="phoneNumber"
									label="Phone Number"
									placeholder="+1 (555) 123-4567"
									updateParentRef={handleRefUpdate}
									fullWidth
								/>
								<InputField
									name="address"
									label="Shipping Address"
									placeholder="123 Creative Blvd"
									updateParentRef={handleRefUpdate}
									fullWidth
								/>
								<div className="flex flex-col md:flex-row gap-4">
									<InputField
										name="city"
										label="City"
										placeholder="San Francisco"
										updateParentRef={handleRefUpdate}
									/>
									<InputField
										name="postalCode"
										label="Postal Code"
										placeholder="94105"
										updateParentRef={handleRefUpdate}
									/>
								</div>
							</div>
						</div>
						{/* Price Summary */}
						<div className="bg-[#f4f7ff] rounded-xl p-6 space-y-3">
							<div className="flex justify-between text-sm text-[#98A0AB]">
								<span>Artwork</span>
								<span className="text-[#0F1724] font-bold">
									$
									{seller?.portraitPrice?.toFixed(2) ||
										"0.00"}
								</span>
							</div>
							<div className="flex justify-between text-sm text-[#98A0AB]">
								<span>Platform Fee</span>
								<span className="text-[#0F1724] font-bold">
									${platformFee.toFixed(2)}
								</span>
							</div>
							<div className="flex justify-between text-sm text-[#98A0AB]">
								<span>Taxes</span>
								<span className="text-[#0F1724] font-bold">
									${taxes.toFixed(2)}
								</span>
							</div>
							<div className="flex justify-between items-center pt-3 border-t border-gray-200">
								<span className="text-[#0F1724] font-bold text-2xl">
									Total Due
								</span>
								<span className="text-[#0F1724] text-xl font-extrabold">
									$
									{(
										(seller?.portraitPrice || 0) +
										platformFee +
										taxes
									).toFixed(2)}
								</span>
							</div>
						</div>
					</section>

					<div className="flex justify-end">
						<button
							onClick={handleCheckout}
							className="flex items-center gap-2 bg-[#0066FF] hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl transition-all"
						>
							<Lock size={18} />
							Secure Checkout
						</button>
					</div>
				</main>
			</div>
		</div>
	);
}
