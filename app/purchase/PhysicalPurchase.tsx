"use client";

import Loading from "@/components/Loading";
import { InputField } from "@/components/PurchaseParts";
import { ShowToast } from "@/components/Toaster";
import { Image as ImageIcon, Lock } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { PaintingType, SellerType } from "../_lib/customTypes";
import { watermarkedUrlGenerator } from "../_lib/dataProcessing";
import { BUYING_ENABLED } from "../_lib/featureFlags";
import { validateCheckout } from "../_lib/validation";

export default function PhysicalPurchase({
	productId,
}: {
	productId: string;
}): ReactElement {
	const [painting, setPainting] = useState<PaintingType | undefined | null>(
		null,
	);
	const [paintingSeller, setPaintingSeller] = useState<
		SellerType | undefined
	>(undefined);

	const [selectedShipping, setSelectedShipping] = useState("standard");

	const loadData = async () => {
		try {
			const res = await fetch("/api/painting", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: productId }),
			});

			if (!res.ok) {
				setPainting(undefined);
				return null;
			}

			const json = await res.json();

			const art: PaintingType = json.data;
			setPainting(art);

			const resArtist = await fetch("/api/seller", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ sellerId: art.sellerId }),
			});

			if (!res.ok) return null;

			const jsonArtist = await resArtist.json();
			setPaintingSeller(jsonArtist.data as SellerType);
		} catch (err) {
			console.error("Error Loading");
			setPainting(undefined);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	// THE MASTER DATA STORE (Does not trigger re-renders on change)
	const formData = useRef({
		firstName: "",
		lastName: "",
		address: "",
		city: "",
		postalCode: "",
		email: "",
		phoneNumber: "",
	});

	// Callback to allow children to update the ref
	const handleRefUpdate = useCallback((name: string, value: string) => {
		formData.current = { ...formData.current, [name]: value };
	}, []);

	const handleCheckout = async () => {
		if (!BUYING_ENABLED) return;

		const result = validateCheckout(
			{
				...formData.current,
				shippingMethod: selectedShipping,
			},
			"physical",
		);

		if (!result.valid) {
			ShowToast(result.message, 1);
			return;
		}

		const res = await fetch("/api/checkout", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				paintingId: productId,
				orderType: "physical",
				shippingMethod: selectedShipping,
			}),
		});

		const data = await res.json();
		if (data.url) window.location.href = data.url;
	};

	const licensePrice: number = painting?.price || 1;
	const platformFee = 5;
	const taxes = 12.0; // to be calulated based on location, etc.

	if (painting === undefined || !painting?.isPhysical) {
		notFound();
	}

	if (painting === null) {
		return <Loading />;
	}

	// Form validation can be added here before allowing checkout
	return (
		<div className="min-h-screen bg-[#FDFDFD] px-5 lg:px-20 pt-27">
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
									title: "Shipping Address",
									active: true,
								},
								{
									step: 2,
									title: "Shipping Method",
									active: true,
								},
								{
									step: 3,
									title: "Secure Payment",
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
				<main className="flex-1 space-y-8 mb-20">
					<section className="bg-white border border-gray-100 rounded-2xl p-8 space-y-8 shadow-md">
						<h1 className="text-[#0F1724] text-xl font-bold">
							Artwork Detail
						</h1>
						<a
							href={`/product/${productId}`}
							className={`flex flex-col sm:flex-row w-full gap-x-4 items-center cursor-pointer border-t border-b border-[#0000001A] py-5`}
						>
							<Image
								src={watermarkedUrlGenerator(painting.images)}
								alt={`${painting.title} image`}
								width={864}
								height={1184}
								className="object-cover rounded-lg aspect-square w-25"
							/>
							<div className="flex flex-col">
								<div className="flex flex-row justify-between">
									<span className="text-[#0F1724] text-md font-semibold">
										{painting.title}
									</span>
								</div>
								<span className="text-[#98A0AB] text-sm mt-1">
									by {paintingSeller?.name || "Seller"}
								</span>
								<span className="self-start flex flex-row gap-x-2 rounded-md bg-[#f4f7ff] px-3 py-1 text-sm font-medium text-[#0F1724] mt-3">
									<ImageIcon className="h-auto w-4" />
									Physical Print
								</span>
							</div>
						</a>
					</section>

					<section className="bg-white border border-gray-100 rounded-2xl p-8 space-y-8 shadow-md">
						<h3 className="text-[#0F1724] font-bold">
							1. Shipping Address
						</h3>
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
							{/* <InputField
								name="cardNumber"
								label="Card Information"
								placeholder="0000 0000 0000 0000"
								updateParentRef={handleRefUpdate}
								fullWidth
							/> */}
						</div>
					</section>

					<section className="bg-white border border-gray-100 rounded-2xl p-8 space-y-8 shadow-md">
						<h3 className="text-[#0F1724] font-bold border-b border-[#0000001A] pb-4">
							2. Shipping Method
						</h3>
						<div className="w-full max-w-4xl">
							<h3 className="text-[#0F1724] font-bold text-lg mb-4">
								Shipping Method
							</h3>

							<div className="flex flex-col gap-4">
								{/* Standard Shipping Option */}
								<div
									onClick={() =>
										setSelectedShipping("standard")
									}
									className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
										selectedShipping === "standard"
											? "border-[#0066FF] bg-[#f4f7ff]"
											: "border-[#0000001A] bg-white"
									}`}
								>
									<div className="space-y-1">
										<h4 className="text-[#0F1724] font-bold text-base">
											Standard (5-7 business days)
										</h4>
										<p className="text-[#98A0AB] text-sm">
											Tracking included
										</p>
									</div>
									<div className="text-[#0F1724] font-bold text-lg">
										$10.00
									</div>
								</div>

								{/* Express Shipping Option */}
								<div
									onClick={() =>
										setSelectedShipping("express")
									}
									className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
										selectedShipping === "express"
											? "border-[#0066FF] bg-[#f4f7ff]"
											: "border-[#0000001A] bg-white"
									}`}
								>
									<div className="space-y-1">
										<h4 className="text-[#0F1724] font-bold text-base">
											Express (2-3 business days)
										</h4>
										<p className="text-[#98A0AB] text-sm">
											Priority handling
										</p>
									</div>
									<div className="text-[#0F1724] font-bold text-lg">
										$25.00
									</div>
								</div>
							</div>
						</div>
						{/* Price Summary */}
						<div className="bg-[#f4f7ff] rounded-xl p-6 space-y-3">
							<div className="flex justify-between text-sm text-[#98A0AB]">
								<span>Artwork</span>
								<span className="text-[#0F1724] font-bold">
									${licensePrice.toFixed(2)}
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
							<div className="flex justify-between text-sm text-[#98A0AB]">
								<span>Shipping</span>
								<span className="text-[#0F1724] font-bold">
									${selectedShipping === "standard" ? 10 : 25}
								</span>
							</div>
							<div className="flex justify-between items-center pt-3 border-t border-gray-200">
								<span className="text-[#0F1724] font-bold text-2xl">
									Total Due
								</span>
								<span className="text-[#0F1724] text-xl font-extrabold">
									$
									{(
										licensePrice +
										platformFee +
										taxes +
										(selectedShipping === "standard"
											? 10
											: 25)
									).toFixed(2)}
								</span>
							</div>
						</div>
					</section>

					<div className="flex justify-end">
						<button
							onClick={handleCheckout}
							disabled={!BUYING_ENABLED}
							className={`flex items-center gap-2 text-white font-bold px-10 py-4 rounded-xl transition-all ${
								BUYING_ENABLED
									? "bg-[#0066FF] hover:bg-blue-700"
									: "bg-[#94A3B8] cursor-not-allowed"
							}`}
						>
							<Lock size={18} />
							{BUYING_ENABLED
								? "Secure Checkout"
								: "Checkout Paused"}
						</button>
					</div>
				</main>
			</div>
		</div>
	);
}
