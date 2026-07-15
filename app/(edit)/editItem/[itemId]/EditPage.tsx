"use client";
import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { ART_CATEGORIES } from "@/app/_lib/artCategories";
import { PaintingType } from "@/app/_lib/customTypes";
import {
	convertNumToDate,
	thumbnailUrlGenerator,
} from "@/app/_lib/dataProcessing";
import { validateListing } from "@/app/_lib/validation";
import Loading from "@/components/Loading";
import { ShowToast } from "@/components/Toaster";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import React, { ReactElement, useEffect, useRef, useState } from "react";

interface InputBoxProps {
	label: string;
	defaultValue?: string | number;
	type?: "text" | "number" | "textarea";
	name: string;
	onChange: (name: string, value: string | number) => void;
}

const InputBox: React.FC<InputBoxProps> = ({
	label,
	defaultValue,
	type = "text",
	name,
	onChange,
}) => {
	const isTextArea = type === "textarea";

	// Textarea uses the light blue bg, standard inputs here look like plain text until clicked
	const baseStyles =
		"rounded-2xl border border-[#061a3d]/15 bg-[#fdfaf4] px-3 py-2.5 text-sm text-[#182033] outline-none placeholder:text-[#6a7280] focus:border-[#d6ad58] focus:ring-2 focus:ring-[#d6ad58]/20";

	return (
		<div className="flex flex-col gap-1 w-full">
			<label className="text-sm font-semibold text-[#0F1724]">
				{label}
			</label>
			{isTextArea ? (
				<textarea
					name={name}
					defaultValue={defaultValue}
					rows={4}
					className={baseStyles}
					onChange={(e) => onChange(name, e.target.value)}
				/>
			) : (
				<input
					type={type}
					name={name}
					defaultValue={defaultValue}
					className={baseStyles}
					onChange={(e) => onChange(name, e.target.value)}
				/>
			)}
		</div>
	);
};

export default function EditArtwork({
	itemId,
}: {
	itemId: string;
}): ReactElement {
	const [painting, setPainting] = useState<PaintingType | null | undefined>(
		null,
	);
	const [isUploading, setIsUploading] = useState(false);
	const router = useRouter();

	const editedData = useRef({
		title: painting?.title,
		category: painting?.category,
		description: painting?.description,
		price: painting?.price,
		quantity: painting?.isDigital ? painting?.quantity : painting?.quantity,
	});

	const handleUpdate = (name: string, value: string | number) => {
		editedData.current = { ...editedData.current, [name]: value };
	};

	const saveChanges = async () => {
		const data = editedData.current;

		// ---------- VALIDATION ----------
		const result = validateListing(
			{
				...data,
				medium: "Existing",
				listingType: painting?.isDigital
					? "Digital Download"
					: "Physical Item",
				uploadedFile: "existing",
			},
			false,
		);

		if (!result.valid) {
			ShowToast(result.message, 1);
			return;
		}

		try {
			setIsUploading(true);
			const token = await firebaseClientAuth.currentUser?.getIdToken();
			if (!token) {
				ShowToast("Please sign in again.", 0);
				setIsUploading(false);
				return;
			}
			const res = await fetch("/api/listing", {
				method: "PUT", // update
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: itemId,
					title: data.title,
					category: data.category,
					description: data.description,
					price: data.price,
					quantity: data.quantity,
				}),
			});
			setIsUploading(false);

			if (!res.ok) {
				ShowToast("Failed to update painting.", 0);
				return;
			}

			ShowToast("Changes saved successfully!", 2);
			router.back();
		} catch (err) {
			setIsUploading(false);
			console.error(err);
			ShowToast("Something went wrong.", 0);
		}
	};

	const loadData = async () => {
		try {
			const res = await fetch("/api/painting", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: itemId }),
			});

			if (!res.ok) {
				setPainting(undefined);
				return null;
			}

			const json = await res.json();

			const art: PaintingType = json.data;
			editedData.current = {
				title: art?.title,
				category: art?.category,
				description: art?.description,
				price: art?.price,
				quantity: art?.isDigital ? art?.quantity : art?.quantity,
			};
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

	return (
		<div className="min-h-screen bg-[#f7f1e6] px-5 py-8 lg:px-20 lg:py-10">
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="rounded-[28px] border border-[#061a3d]/12 bg-white p-8 shadow-[0_20px_60px_rgba(6,26,61,.08)] lg:col-span-2">
					<div className="mb-6 flex items-start justify-between">
						<div>
							<h1 className="font-serif text-3xl text-[#061a3d]">
								Edit artwork details
							</h1>
							<p className="mt-2 text-sm text-[#6a7280]">
								Update the information shown on your artwork
								page.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
						<InputBox
							label="Title"
							name="title"
							defaultValue={editedData.current.title}
							onChange={handleUpdate}
						/>
						<div className="flex flex-col gap-1 w-full">
							<label className="text-sm font-semibold text-[#0F1724]">
								Category
							</label>

							<div className="relative">
								<select
									name="category"
									defaultValue={editedData.current.category}
									onChange={(e) =>
										handleUpdate("category", e.target.value)
									}
									className="w-full appearance-none rounded-2xl border border-[#061a3d]/15 bg-[#fdfaf4] px-3 py-2.5 pr-10 text-sm text-[#182033] outline-none focus:border-[#d6ad58] focus:ring-2 focus:ring-[#d6ad58]/20 cursor-pointer"
								>
									{ART_CATEGORIES.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>

								<div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#6a7280]">
									▼
								</div>
							</div>
						</div>

						<div className="md:col-span-2">
							<InputBox
								label="Description"
								name="description"
								type="textarea"
								defaultValue={editedData.current.description}
								onChange={handleUpdate}
							/>
						</div>
					</div>

					<div className="mt-12 flex w-full flex-wrap items-center justify-end gap-4 border-t border-[#061a3d]/10 pt-6">
						<button
							onClick={() => router.back()}
							className="rounded-full border border-[#061a3d]/15 px-6 py-2 text-sm font-semibold text-[#061a3d] transition hover:border-[#d6ad58] hover:text-[#d6ad58]"
						>
							Cancel changes
						</button>
						<button
							onClick={saveChanges}
							className="rounded-full bg-[#d6ad58] px-6 py-2 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39]"
						>
							Save changes
						</button>
					</div>
				</div>

				{/* Right Column: Previews */}
				<div className="space-y-6">
					{/* Current Preview */}
					<div className="rounded-[24px] border border-[#061a3d]/12 bg-white p-4 shadow-[0_18px_40px_rgba(6,26,61,.08)]">
						<h3 className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-[#b88d39]">
							Current preview
						</h3>
						<div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
							<Image
								className="object-cover w-full h-full brightness-75"
								src={thumbnailUrlGenerator(painting.images)}
								alt="Art pic"
								width={1024}
								height={1024}
								priority
							/>
						</div>
					</div>

					{/* Listing Summary */}
					<div className="rounded-[24px] border border-[#061a3d]/12 bg-white p-6 shadow-[0_18px_40px_rgba(6,26,61,.08)]">
						<div className="flex justify-between text-xs">
							<h3 className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-[#b88d39]">
								Created On
							</h3>
							<span>{convertNumToDate(painting.createdAt)}</span>
						</div>
						<div className="flex justify-between text-xs">
							<h3 className="text-xs font-bold uppercase tracking-[.16em] text-[#b88d39]">
								Updated On
							</h3>
							<span>{convertNumToDate(painting.updatedAt)}</span>
						</div>
					</div>
				</div>
			</div>
			{isUploading && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 text-center">
						<div className="w-10 h-10 border-4 border-[#D5AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
						<p className="text-sm font-semibold text-gray-900 mb-1">
							Updating your listing
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
