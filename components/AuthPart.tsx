import { BUYING_ENABLED } from "@/app/_lib/featureFlags";
import { validateImageFile } from "@/app/_lib/validation";
// @ts-ignore
import { getNames } from "country-list";
import { CreditCard, Eye, EyeOff, ImagePlus } from "lucide-react";
import { memo, useRef, useState } from "react";
import { ShowToast } from "./Toaster";
interface Props {
	initialData: any;
	onChange: (key: string, value: string) => void;
	passReqs?: boolean;
}

export const AccountInfo = memo(({ initialData, onChange }: Props) => {
	const [fullName, setFullName] = useState(initialData.fullName);

	return (
		<div className="space-y-4 text-[#0F1724]">
			<h3 className="text-sm font-semibold text-[#0F1724] uppercase tracking-wider">
				Account Information
			</h3>

			<div>
				<label className="block text-sm font-medium text-[#0F1724] mb-1">
					Full Name
				</label>
				<input
					type="text"
					value={fullName}
					placeholder="Enter Full Name"
					onChange={(e) => {
						setFullName(e.target.value);
						onChange("fullName", e.target.value);
					}}
					className="w-full px-4 py-2 border placeholder:text-[#98A0AB] border-[#0000001A] rounded-lg focus:outline-none focus:ring-1 
                    focus:ring-blue-500"
				/>
			</div>

			<CredentioalsForm
				initialData={initialData}
				onChange={onChange}
				passReqs={true}
			/>
		</div>
	);
});

export const PhysicalAddress = memo(({ initialData, onChange }: Props) => {
	const [address, setAddress] = useState(initialData);
	const countries: string[] = getNames();

	const handleLocalChange = (key: string, val: string) => {
		setAddress({ ...address, [key]: val });
		onChange(key, val);
	};

	return (
		<div className="space-y-4 text-[#0F1724]">
			<h3 className="text-sm font-semibold text-[#0F1724] uppercase tracking-wider">
				Physical Address
			</h3>

			<div>
				<label className="block text-sm font-medium text-[#0F1724] mb-1">
					Street Address
				</label>
				<input
					type="text"
					placeholder="123 Creative Avenue, Studio 4B"
					value={address.street}
					onChange={(e) =>
						handleLocalChange("street", e.target.value)
					}
					className="w-full px-4 py-2 border border-[#0000001A] placeholder:text-[#98A0AB] rounded-lg focus:outline-none focus:ring-1 
                    focus:ring-blue-500"
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-[#0F1724] mb-1">
						City
					</label>
					<input
						type="text"
						value={address.city}
						placeholder="New York"
						onChange={(e) =>
							handleLocalChange("city", e.target.value)
						}
						className="w-full px-4 py-2 border border-[#0000001A] placeholder:text-[#98A0AB] rounded-lg focus:outline-none focus:ring-1 
                    focus:ring-blue-500"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-[#0F1724] mb-1">
						State / Province
					</label>
					<input
						type="text"
						value={address.state}
						placeholder="NY"
						onChange={(e) =>
							handleLocalChange("state", e.target.value)
						}
						className="w-full px-4 py-2 border border-[#0000001A] placeholder:text-[#98A0AB] rounded-lg focus:outline-none focus:ring-1 
                    focus:ring-blue-500"
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-[#0F1724] mb-1">
						Zip Code
					</label>
					<input
						type="text"
						value={address.zip}
						placeholder="10012"
						onChange={(e) =>
							handleLocalChange("zip", e.target.value)
						}
						className="w-full px-4 py-2 border border-[#0000001A] placeholder:text-[#98A0AB] rounded-lg focus:outline-none focus:ring-1 
                    focus:ring-blue-500"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-[#0F1724] mb-1">
						Country
					</label>
					<select
						value={address.country}
						onChange={(e) =>
							handleLocalChange("country", e.target.value)
						}
						className="w-full px-4 py-2 border border-[#0000001A] rounded-lg bg-white appearance-none text-[#0F1724] focus:outline-none focus:ring-1 
                    focus:ring-blue-500"
					>
						{countries.map((country) => (
							<option key={country} value={country}>
								{country}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
});

export const SellerImageUpload = memo(
	({ onChange }: { onChange: (k: string, v: File) => void }) => {
		const inputRef = useRef<HTMLInputElement>(null);

		const [preview, setPreview] = useState<string | null>(null);
		const [fileName, setFileName] = useState("");

		const handleClick = () => {
			inputRef.current?.click();
		};

		const handleFileChange = async (
			e: React.ChangeEvent<HTMLInputElement>,
		) => {
			const file = e.target.files?.[0];
			if (!file) return;

			// ---------- TYPE CHECK ----------
			const result = await validateImageFile(file, {
				types: ["image/jpeg", "image/png"],
				maxMb: 5,
				minHeight: 720,
				minWidth: 720,
				label: "Profile picture",
			});

			if (!result.valid) {
				ShowToast(result.message, 1);
				return;
			}

			// ---------- DIMENSION CHECK ----------
			const img = new window.Image();
			const objectUrl = URL.createObjectURL(file);

			img.onload = () => {
				setPreview(objectUrl);
				setFileName(file.name);

				// send uri to parent
				onChange("uploadedFile", file);
			};

			img.onerror = () => {
				ShowToast("Invalid image file.", 2);
				URL.revokeObjectURL(objectUrl);
			};

			img.src = objectUrl;
		};

		return (
			<>
				{/* hidden input */}
				<input
					ref={inputRef}
					type="file"
					accept="image/jpeg,image/png"
					className="hidden"
					onChange={handleFileChange}
				/>

				<div
					onClick={handleClick}
					className="p-4 border border-dashed border-[#0000001A] rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition"
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							{/* LEFT SIDE */}
							{preview ? (
								<img
									src={preview}
									alt="Selected"
									className="w-12 h-12 rounded-md object-cover"
								/>
							) : (
								<div className="p-2 bg-[#635BFF] rounded-md">
									<ImagePlus
										className="text-white"
										size={20}
									/>
								</div>
							)}

							{/* RIGHT SIDE */}
							<div>
								<p className="text-sm font-bold text-[#0F1724]">
									{preview ? fileName : "Upload Your Picture"}
								</p>

								{preview && (
									<p className="text-xs text-[#98A0AB]">
										Click to change image
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</>
		);
	},
);

export const StripeConnect = memo(
	({ onChange }: { onChange: (k: string, v: boolean) => void }) => {
		const [connected, setConnected] = useState(false);

		if (!BUYING_ENABLED) return null;
		return (
			<div className="p-4 border border-dashed border-[#00000033] rounded-xl bg-slate-50">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-[#635BFF] rounded-md">
							<CreditCard className="text-white" size={20} />
						</div>
						<div>
							<p className="text-sm font-bold text-[#0F1724]">
								Payout Method
							</p>
							<p className="text-xs text-[#98A0AB]">
								Connect Stripe to receive payments
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={() => {
							setConnected(!connected);
							onChange("stripeConnected", !connected);
						}}
						className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
							connected
								? "bg-emerald-100 text-emerald-700 border border-emerald-200"
								: "bg-[#635BFF] text-white hover:bg-[#5249d9]"
						}`}
					>
						{connected ? "Connected" : "Connect Stripe"}
					</button>
				</div>
			</div>
		);
	},
);

export const CredentioalsForm = memo(
	({ initialData, onChange, passReqs }: Props) => {
		const [email, setEmail] = useState(initialData.email);
		const [password, setPassword] = useState("");
		const [showPassword, setShowPassword] = useState(false);
		return (
			<>
				<div>
					<label className="block text-sm font-medium text-[#0F1724] mb-1">
						Email Address
					</label>
					<div className="relative">
						<input
							type="email"
							value={email}
							placeholder="Enter Email Address"
							onChange={(e) => {
								setEmail(e.target.value);
								onChange("email", e.target.value);
							}}
							className="w-full px-4 py-2 border border-[#0000001A] placeholder:text-[#98A0AB] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 pr-24"
						/>
						{/* <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-500 text-sm font-medium">
						Verified <CheckCircle2 size={16} />
					</div> */}
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-[#0F1724] mb-1">
						Password
					</label>
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							placeholder="••••••••"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								onChange("password", e.target.value);
							}}
							className="w-full px-4 py-2 border border-[#0000001A] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A0AB] hover:text-[#0F1724]"
						>
							{showPassword ? (
								<EyeOff size={18} />
							) : (
								<Eye size={18} />
							)}
						</button>
					</div>
					{passReqs && (
						<p className="text-[11px] text-[#98A0AB] mt-1">
							Must be at least 8 characters.
						</p>
					)}
				</div>
			</>
		);
	},
);

type PropsRow = {
	selfPortrait: string;
	portraitPrice: string;
	updateField: (key: string, value: string) => void;
};

export function SelfPortraitRow({
	selfPortrait,
	portraitPrice,
	updateField,
}: PropsRow) {
	const [isSelfPortrait, setIsSelfPortrait] = useState(
		selfPortrait === "true",
	);
	const [price, setPrice] = useState(portraitPrice);

	const handlePortraitToggle = (checked: boolean) => {
		setIsSelfPortrait(checked);
		updateField("selfPortrait", checked ? "true" : "false");
	};

	const handlePriceChange = (value: string) => {
		setPrice(value);
		updateField("portraitPrice", value);
	};

	return (
		<div className="flex items-center justify-between gap-4 border border-[#0000001A] rounded-lg px-4 py-3">
			<div className="flex items-center gap-3">
				<input
					type="checkbox"
					checked={isSelfPortrait}
					onChange={(e) => handlePortraitToggle(e.target.checked)}
					className="w-4 h-4 accent-blue-600"
				/>

				<span className="text-sm font-medium text-[#0F1724]">
					I create self portraits
				</span>
			</div>

			<div
				className={`relative flex items-center w-36 ${!isSelfPortrait ? "opacity-50" : ""}`}
			>
				<span className="absolute left-3 text-sm text-[#98A0AB] pointer-events-none">
					$
				</span>
				<input
					type="number"
					value={price}
					placeholder="0.00"
					onChange={(e) => handlePriceChange(e.target.value)}
					disabled={!isSelfPortrait}
					min={0}
					step="0.01"
					className="w-full pl-7 pr-3 py-2 border border-[#0000001A] placeholder:text-[#98A0AB] rounded-lg 
                    focus:outline-none focus:ring-1 focus:ring-blue-500 text-[#0F1724] text-sm
                    disabled:bg-gray-50 disabled:cursor-not-allowed"
				/>
			</div>
		</div>
	);
}
