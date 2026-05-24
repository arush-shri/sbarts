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
		"w-full p-3 rounded-md bg-[#00000006] text-[#0F1724] placeholder:text-[#98A0AB] focus:outline-none focus:ring-1 focus:ring-[#0F1724]";

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
