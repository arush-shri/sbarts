"use client";
import { PaintingType } from "@/app/_lib/customTypes";
import { convertNumToDate } from "@/app/_lib/dataProcessing";
import Image from "next/image";
import { notFound } from "next/navigation";
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
	const baseStyles = isTextArea
		? "w-full p-3 rounded-md bg-[#f4f7ff] border border-[#0000001A] text-[#98A0AB] text-sm focus:outline-none focus:ring-1 focus:ring-[#0F1724] resize-none"
		: "w-full py-1 bg-transparent border-b border-transparent hover:border-[#0000001A] focus:border-[#0F1724] focus:outline-none text-[#98A0AB] text-sm transition-all";

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
					onChange={(e) =>
						onChange(
							name,
							type === "number"
								? Number(e.target.value)
								: e.target.value,
						)
					}
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
	const [painting, setPainting] = useState<PaintingType | undefined>(
		undefined,
	);

	const editedData = useRef({
		title: painting?.title,
		category: painting?.category,
		description: painting?.description,
		price: painting?.price,
		quantity: painting?.isDigital
			? painting?.quantityDigital
			: painting?.quantityPhysical,
	});

	const handleUpdate = (name: string, value: string | number) => {
		editedData.current = { ...editedData.current, [name]: value };
	};

	const saveChanges = async () => {
		console.log("Saving data:", editedData.current);
		const data = editedData.current;

		// ---------- VALIDATION ----------
		if (
			!data.title?.trim() ||
			!data.category?.trim() ||
			!data.description?.trim()
		) {
			alert("All fields are required.");
			return;
		}

		if (!data.price || data.price <= 0) {
			alert("Price must be greater than 0.");
			return;
		}

		if (!data.quantity || data.quantity <= 0) {
			alert("Quantity must be greater than 0.");
			return;
		}

		try {
			const res = await fetch("/api/listing", {
				method: "PUT", // update
				headers: {
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

			if (!res.ok) {
				alert("Failed to update painting.");
				return;
			}

			alert("Changes saved successfully!");
		} catch (err) {
			console.error(err);
			alert("Something went wrong.");
		}
	};

	const loadData = async () => {
		const res = await fetch("/api/painting", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: itemId }),
		});

		if (!res.ok) return null;

		const json = await res.json();

		const art: PaintingType = json.data;
		editedData.current = {
			title: art?.title,
			category: art?.category,
			description: art?.description,
			price: art?.price,
			quantity: art?.isDigital
				? art?.quantityDigital
				: art?.quantityPhysical,
		};
		setPainting(art);
	};

	useEffect(() => {
		loadData();
	}, []);

	if (!painting) notFound();

	return (
		<div className="min-h-screen bg-gray-50 px-5 lg:px-20 pt-24">
			<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column: Editable Details */}
				<div className="lg:col-span-2 bg-white rounded-xl border border-[#0000001A] p-8">
					<div className="flex justify-between items-start mb-6">
						<div>
							<h1 className="text-xl font-bold text-[#0F1724]">
								Edit artwork details
							</h1>
							<p className="text-[#98A0AB] text-xs mt-1">
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
						<InputBox
							label="Category"
							name="category"
							defaultValue={editedData.current.category}
							onChange={handleUpdate}
						/>

						<div className="md:col-span-2">
							<InputBox
								label="Description"
								name="description"
								type="textarea"
								defaultValue={editedData.current.description}
								onChange={handleUpdate}
							/>
						</div>

						<div>
							<InputBox
								label="Price (USD)"
								name="price"
								type="number"
								defaultValue={editedData.current.price}
								onChange={handleUpdate}
							/>
							<p className="text-[10px] text-[#98A0AB] mt-1">
								Price shown to buyers.
							</p>
						</div>

						<div>
							<InputBox
								label="Stock / Quantity"
								name="quantity"
								defaultValue={editedData.current.quantity}
								onChange={handleUpdate}
							/>
							<p className="text-[10px] text-[#98A0AB] mt-1">
								For physical items, enter a specific quantity.
							</p>
						</div>
					</div>

					<div className="flex flex-row flex-wrap w-full justify-end items-center mt-12 pt-6 border-t border-[#0000001A] gap-4">
						<button className="px-6 py-2 border border-[#0000001A] rounded-md text-sm font-medium text-[#0F1724] hover:bg-gray-50">
							Cancel changes
						</button>
						<button
							onClick={saveChanges}
							className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
						>
							Save changes
						</button>
					</div>
				</div>

				{/* Right Column: Previews */}
				<div className="space-y-6">
					{/* Current Preview */}
					<div className="bg-white rounded-xl border border-[#0000001A] p-4">
						<h3 className="text-xs font-bold text-[#0F1724] mb-3">
							Current preview
						</h3>
						<div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
							<Image
								className="object-cover w-full h-full brightness-75"
								src={painting.images}
								alt="Art pic"
								width={1024}
								height={1024}
								priority
							/>
						</div>
						<p className="text-[10px] text-[#98A0AB] mt-3 leading-relaxed">
							Buyers will see a watermarked version like this. The
							original file is delivered after successful payment.
						</p>
					</div>

					{/* Listing Summary */}
					<div className="bg-white rounded-xl border border-[#0000001A] p-6">
						<h3 className="text-xs font-bold text-[#0F1724] mb-4">
							Listing summary
						</h3>
						<div className="space-y-3">
							{[
								{
									label: "Current price",
									value: "$55.00",
									bold: true,
								},
								{
									label: "Type",
									value: `${painting.isDigital ? "Digital download" : "Physical art"}`,
								},
								{ label: "Sales", value: painting.purchases },
								{
									label: "Last updated",
									value: convertNumToDate(painting.updatedAt),
								},
							].map((item, i) => (
								<div
									key={i}
									className="flex justify-between text-xs"
								>
									<span className="text-[#98A0AB]">
										{item.label}
									</span>
									<span
										className={`text-[#0F1724] ${item.bold ? "font-bold" : ""}`}
									>
										{item.value}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
