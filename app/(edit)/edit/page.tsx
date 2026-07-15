"use client";

import { useSellerContext } from "@/app/_context/SellerContext";
import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { validateImageFile, validateProfile } from "@/app/_lib/validation";
import ProtectedPage from "@/components/ProtectedPage";
import { ShowToast } from "@/components/Toaster";
// @ts-ignore
import { getNames } from "country-list";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function EditProfile() {
	// Initial state mimicking the provided image data
	const router = useRouter();
	const [isUploading, setIsUploading] = useState(false);
	const { artistData, setSellerData } = useSellerContext();
	const [profile, setProfile] = useState({
		fullName: artistData?.name,
		email: artistData?.email,
		country: artistData?.address.country,
		city: artistData?.address.city,
		address: artistData?.address.address,
		postalCode: artistData?.address.postalCode,
		selfPortrait: artistData?.makeSelfPortrait || false,
		portraitPrice: artistData?.portraitPrice,
		image: artistData?.image,
		imageFile: null,
	});
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const countries: string[] = getNames();

	// The function to update state based on key and string value
	const updateField = (
		key: string,
		val: string | boolean | globalThis.File,
	) => {
		setProfile((prev) => ({ ...prev, [key]: val }));
	};

	const handleImageChange = async (file: globalThis.File) => {
		const result = await validateImageFile(file, {
			label: "Profile picture",
			maxMb: 5,
		});

		if (!result.valid) {
			ShowToast(result.message, 1);
			return;
		}

		const img = new window.Image();
		const objectUrl = URL.createObjectURL(file as Blob);

		img.onload = () => {
			// Save image preview
			updateField("image", objectUrl);
			updateField("imageFile", file);
		};

		img.src = objectUrl;
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleSave = async () => {
		try {
			// ---------- VALIDATION ----------

			const result = validateProfile(profile);

			if (!result.valid) {
				ShowToast(result.message, 1);
				return;
			}

			const body = new FormData();

			body.append("id", artistData?.id || "");
			body.append("fullName", profile.fullName || "");
			body.append("country", profile.country || "");
			body.append("city", profile.city || "");
			body.append("address", profile.address || "");
			body.append("postalCode", profile.postalCode || "");
			body.append("selfPortrait", String(profile.selfPortrait));
			body.append("portraitPrice", String(profile.portraitPrice || 0));

			if (profile.imageFile) {
				body.append("image", profile.imageFile);
			}
			setIsUploading(true);
			const token = await firebaseClientAuth.currentUser?.getIdToken();
			if (!token) {
				ShowToast("Please sign in again.", 0);
				setIsUploading(false);
				return;
			}

			const res = await fetch("/api/seller", {
				method: "PUT",
				body,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setIsUploading(false);

			if (!res.ok) {
				const data = await res.json();
				ShowToast(data.error || "Failed to update profile", 0);
				return;
			}

			const data = await res.json();

			if (data.success) {
				setSellerData(data.data);
				ShowToast("Profile updated successfully", 2);
				router.replace("/dashboard");
			} else {
				ShowToast("Profile update failed", 0);
			}
		} catch (err) {
			setIsUploading(false);
			console.error(err);
			ShowToast("Something went wrong", 0);
		}
	};

	return (
		<ProtectedPage>
			<div className="min-h-screen bg-gray-50 text-gray-800 px-5 lg:px-20 pt-24">
				<div className="max-w-5xl mx-auto mb-20">
					{/* Header */}
					<div className="flex justify-between items-center mb-6">
						<div>
							<h1 className="text-2xl font-bold">Edit profile</h1>
							<p className="text-sm text-gray-500">
								Update your public seller information and
								account details.
							</p>
						</div>
						<a
							href="/dashboard"
							className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50"
						>
							Back to dashboard
						</a>
					</div>

					<div className="flex flex-col md:flex-row gap-6">
						{/* Left Column - Profile Photo */}
						<div className="h-fit w-full md:w-1/3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
							<div className="relative inline-block mb-4">
								<Image
									src={
										`${profile.image}&v=${Date.now()}` ||
										"/images/portrait.png"
									}
									alt="Artist Picture"
									width={1024}
									height={1024}
									className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-50"
								/>
							</div>
							<h2 className="text-lg font-bold">
								{profile.fullName}
							</h2>
							<p className="text-xs text-green-600 font-medium mb-4">
								Verified seller
							</p>
							<p className="text-xs text-gray-400 mb-6 px-4 leading-relaxed">
								Profile photo is shown on your artwork pages and
								dashboard. Recommended: square image - at least
								720 × 720 px
							</p>
							<button
								onClick={handleUploadClick}
								className="w-full py-2 mb-2 bg-white border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50"
							>
								Upload new photo
							</button>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								className="hidden"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) handleImageChange(file);
								}}
							/>
						</div>

						{/* Right Column - Form Fields */}
						<div className="w-full md:w-2/3 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
								{/* Full Name & Display Name */}
								<div className="md:col-span-2">
									<label className="block text-xs font-bold uppercase text-gray-500 mb-1">
										Full name
									</label>
									<input
										type="text"
										value={profile.fullName}
										onChange={(e) =>
											updateField(
												"fullName",
												e.target.value,
											)
										}
										className="w-full text-sm py-2 border-b border-gray-100 focus:outline-none"
									/>
								</div>

								{/* Email & Phone */}
								<div>
									<label className="block text-xs font-bold uppercase text-gray-500 mb-1">
										Email address
									</label>
									<input
										type="text"
										value={profile.email}
										readOnly
										className="w-full text-sm py-2 border-b border-gray-100 focus:outline-none"
									/>
								</div>

								{/* Location Details */}
								<div>
									<label className="block text-xs font-bold uppercase text-gray-500 mb-1">
										Country
									</label>
									<select
										value={profile.country}
										onChange={(e) =>
											updateField(
												"country",
												e.target.value,
											)
										}
										className="w-full text-sm py-2 border-b border-gray-100 focus:outline-none bg-transparent"
									>
										{countries.map((country) => (
											<option
												key={country}
												value={country}
											>
												{country}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-xs font-bold uppercase text-gray-500 mb-1">
										City
									</label>
									<input
										type="text"
										value={profile.city}
										onChange={(e) =>
											updateField("city", e.target.value)
										}
										className="w-full text-sm py-2 border-b border-gray-100 focus:outline-none"
									/>
								</div>
								<div className="md:col-span-2">
									<label className="block text-xs font-bold uppercase text-gray-500 mb-1">
										Address
									</label>
									<input
										type="text"
										value={profile.address}
										onChange={(e) =>
											updateField(
												"address",
												e.target.value,
											)
										}
										className="w-full text-sm py-2 border-b border-gray-100 focus:outline-none"
									/>
								</div>
								<div>
									<label className="block text-xs font-bold uppercase text-gray-500 mb-1">
										Postal code
									</label>
									<input
										type="number"
										value={profile.postalCode}
										onChange={(e) =>
											updateField(
												"postalCode",
												e.target.value,
											)
										}
										className="w-full text-sm py-2 border-b border-gray-100 focus:outline-none"
									/>
								</div>
							</div>

							{/* NEW ADDED ROW - Self Portrait Checkbox */}
							<div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col gap-4 mb-8">
								<div className="flex items-center gap-3">
									<input
										type="checkbox"
										id="selfPortrait"
										className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
										checked={profile.selfPortrait}
										onChange={(e) =>
											updateField(
												"selfPortrait",
												e.target.checked,
											)
										}
									/>

									<label
										htmlFor="selfPortrait"
										className="text-sm font-medium text-gray-700 cursor-pointer"
									>
										I create self-portraits
									</label>
								</div>

								{profile.selfPortrait && (
									<div>
										<label className="block text-xs font-bold uppercase text-gray-500 mb-1">
											Self portrait price
										</label>
										<input
											type="number"
											value={profile.portraitPrice || ""}
											onChange={(e) =>
												updateField(
													"portraitPrice",
													e.target.value,
												)
											}
											placeholder="Enter price"
											className="w-full text-sm py-2 border-b border-gray-100 focus:outline-none"
										/>
									</div>
								)}
							</div>

							<p className="text-xs text-gray-500 mb-8 leading-relaxed">
								Your payment information is handled securely via
								Stripe. ArtSpace never stores full card or bank
								details.
							</p>

							{/* Bottom Buttons */}
							<div className="flex justify-end">
								<div className="flex gap-4 items-center">
									<button
										onClick={handleSave}
										className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm"
									>
										Save profile
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{isUploading && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 text-center">
						<div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
						<p className="text-sm font-semibold text-gray-900 mb-1">
							Updating your profile...
						</p>
					</div>
				</div>
			)}
		</ProtectedPage>
	);
}
