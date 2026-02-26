"use client";

import {
	AccountInfo,
	PhysicalAddress,
	StripeConnect,
} from "@/components/AuthPart";
import { ReactElement, useRef } from "react";

export default function SellerOnboarding(): ReactElement {
	// Master form state held in a Ref to prevent parent re-renders on every keystroke
	const formData = useRef({
		fullName: "",
		email: "",
		street: "",
		city: "",
		state: "",
		zip: "",
		password: "",
		country: "",
		stripeConnected: false,
	});

	const updateField = (key: string, value: string | boolean) => {
		formData.current = { ...formData.current, [key]: value };
		console.log("Current Form State:", formData.current);
	};

	return (
		<div className="flex min-h-screen bg-white font-sans">
			{/* Left Side: Hero Image Section */}
			<div
				className="hidden lg:h-screen lg:flex w-1/2 relative bg-cover bg-center"
				style={{ backgroundImage: `url('/images/sellerbg.avif')` }}
			>
				<div className="absolute inset-0 bg-black/20" />
				<div className="absolute bottom-12 left-12 text-white max-w-md">
					<h1 className="text-5xl font-bold mb-6 leading-tight">
						Turn your creativity into a career.
					</h1>
					<p className="text-lg mb-8 opacity-90">
						Join thousands of artists selling digital art,
						paintings, photography, and portraits to collectors
						worldwide.
					</p>
					<div className="flex gap-3">
						{["Digital Art", "Paintings", "Photography"].map(
							(tag) => (
								<span
									key={tag}
									className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm border border-white/30"
								>
									{tag}
								</span>
							),
						)}
					</div>
				</div>
			</div>

			{/* Right Side: Form Section */}
			<div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-5 md:px-20 pt-24 overflow-y-auto">
				<div className="w-full max-w-md">
					<div className="flex flex-col items-center mb-10">
						<div className="w-10 h-10 bg-[#0061f2] rounded-full flex items-center justify-center mb-4">
							<span className="text-white text-xl">🎨</span>
						</div>
						<h2 className="text-3xl font-bold text-[#0F1724]">
							Create seller account
						</h2>
						<p className="text-[#0F1724] mt-2">
							Enter your details to start selling on SBArts.
						</p>
					</div>

					<form
						className="space-y-8"
						onSubmit={(e) => e.preventDefault()}
					>
						<AccountInfo
							initialData={{
								fullName: formData.current.fullName,
								email: formData.current.email,
							}}
							onChange={updateField}
						/>

						<PhysicalAddress
							initialData={{
								street: formData.current.street,
								city: formData.current.city,
								state: formData.current.state,
								zip: formData.current.zip,
								country: formData.current.country,
							}}
							onChange={updateField}
						/>

						<StripeConnect onChange={updateField} />

						<button
							className="w-full bg-[#0061f2] text-white py-3 rounded-lg font-medium hover:bg-blue-700
                            transition-colors mb-15 text-lg"
						>
							Continue
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
