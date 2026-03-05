// app/not-found.tsx
"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface ButtonProps {
	children: React.ReactNode;
	variant?: "primary" | "outline";
	onClick?: () => void;
	icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	children,
	variant = "primary",
	onClick,
	icon,
}) => {
	const baseStyles =
		"flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 text-sm md:text-base";

	const variants = {
		primary: "bg-[#0B76FF] text-white hover:bg-blue-600 shadow-sm",
		outline:
			"bg-white border border-[#0000001A] text-[#0F1724] hover:bg-gray-50",
	};

	return (
		<button
			onClick={onClick}
			className={`${baseStyles} ${variants[variant]}`}
		>
			{icon}
			{children}
		</button>
	);
};

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
			{/* Large 404 Background Text */}
			<div className="relative">
				<h1 className="text-9xl font-black text-[#ebeef4] leading-none select-none">
					404
				</h1>

				{/* Content Overlap/Below Container */}
				<div className="mt-0 space-y-4">
					<h2 className="text-3xl md:text-4xl font-bold text-[#0F1724]">
						Page not found
					</h2>

					<p className="max-w-md mx-auto text-[#6B7280] text-sm md:text-base leading-relaxed">
						Sorry, we couldn't find the page you're looking for. It
						might have been removed, had its name changed, or is
						temporarily unavailable.
					</p>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
				<Button
					variant="outline"
					onClick={() => router.back()}
					icon={
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
					}
				>
					Go Back
				</Button>

				<Button
					variant="primary"
					onClick={() => router.push("/")}
					icon={
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
					}
				>
					Back to Home
				</Button>
			</div>
		</div>
	);
}
