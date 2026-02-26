"use client";

import { Check } from "lucide-react";
import React, { memo, useState } from "react";

export const LicenseCard = memo(
	({
		type,
		price,
		features,
		isSelected,
		onSelect,
		badge,
	}: {
		type: string;
		price: number;
		features: string[];
		isSelected: boolean;
		onSelect: () => void;
		badge?: string;
	}) => {
		return (
			<div
				onClick={onSelect}
				className={`relative flex-1 p-6 rounded-xl border-2 cursor-pointer transition-all ${
					isSelected
						? "border-[#0061f2] bg-[#f4f7ff]"
						: "border-gray-100 bg-white"
				}`}
			>
				{badge && (
					<span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0061f2] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
						{badge}
					</span>
				)}
				<h4 className="text-[#0F1724] font-bold text-lg mb-1">
					{type}
				</h4>
				<p className="text-[#0F1724] text-2xl font-extrabold mb-4">
					${price}
				</p>
				<ul className="space-y-2">
					{features.map((f, i) => (
						<li
							key={i}
							className="flex items-center gap-2 text-[#98A0AB] text-xs"
						>
							<Check
								size={14}
								className={
									isSelected
										? "text-[#0061f2]"
										: "text-gray-300"
								}
							/>
							{f}
						</li>
					))}
				</ul>
			</div>
		);
	},
);

export const InputField = memo(
	({
		label,
		placeholder,
		name,
		updateParentRef,
		type = "text",
		fullWidth = false,
	}: {
		label: string;
		placeholder: string;
		name: string;
		updateParentRef: (name: string, value: string) => void;
		type?: string;
		fullWidth?: boolean;
	}) => {
		// Local state for the input UI
		const [value, setValue] = useState("");

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newVal = e.target.value;
			setValue(newVal); // Updates local UI
			updateParentRef(name, newVal); // Updates parent useRef
		};

		return (
			<div
				className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : "flex-1"}`}
			>
				<label className="text-xs font-bold text-[#0F1724]">
					{label}
				</label>
				<input
					type={type}
					value={value}
					onChange={handleChange}
					placeholder={placeholder}
					className="w-full bg-[#F9FAFB] border border-gray-100 rounded-lg px-4 py-3 text-sm text-[#0F1724] placeholder-[#98A0AB] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
				/>
			</div>
		);
	},
);

export const ArtistCard = memo(({ seller, onSelect, isSelected }: any) => {
	return (
		<div
			onClick={() => onSelect(seller.id, seller.portraitPrice)}
			className={`relative shrink-0 cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden ${
				isSelected
					? "border-[#0061f2] bg-[#f4f7ff]"
					: "border-gray-100 bg-white"
			}`}
		>
			<div className="h-32 bg-gray-200 relative">
				<img
					src={seller.image}
					alt={seller.name}
					className="w-full h-full object-cover opacity-80"
				/>
				<span className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-[#0F1724]">
					${seller.portraitPrice}
				</span>
			</div>
			<div className="p-3 pr-10">
				<div className="flex items-center gap-2">
					<div className="w-5 h-5 rounded-full bg-gray-300 overflow-hidden">
						<img src={seller.image} alt="avatar" />
					</div>
					<p className="text-sm font-bold text-[#0F1724]">
						{seller.name}
					</p>
				</div>
				<p className="text-[11px] text-[#98A0AB] mt-1 ml-7">
					Custom Portrait Style
				</p>
			</div>
		</div>
	);
});
