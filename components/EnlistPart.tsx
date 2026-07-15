import React from "react";

interface InputBoxProps {
	label: string;
	placeholder?: string;
	type?: "text" | "number" | "textarea";
	name: string;
	onChange: (name: string, value: string | number) => void;
}

const InputBox: React.FC<InputBoxProps> = ({
	label,
	placeholder,
	type = "text",
	name,
	onChange,
}) => {
	const baseStyles =
		"w-full rounded-2xl border border-[#061a3d]/15 bg-[#fdfaf4] px-4 py-3 text-[#182033] placeholder:text-[#6a7280] focus:border-[#d6ad58] focus:outline-none focus:ring-2 focus:ring-[#d6ad58]/20";

	return (
		<div className="flex flex-col gap-2 w-full">
			<label className="text-sm font-semibold text-[#0F1724]">
				{label}
			</label>
			{type === "textarea" ? (
				<textarea
					name={name}
					placeholder={placeholder}
					rows={4}
					className={`${baseStyles} resize-none`}
					onChange={(e) => onChange(name, e.target.value)}
				/>
			) : (
				<input
					type={type}
					name={name}
					placeholder={placeholder}
					className={baseStyles}
					onChange={(e) => onChange(name, e.target.value)}
				/>
			)}
		</div>
	);
};

export default InputBox;
