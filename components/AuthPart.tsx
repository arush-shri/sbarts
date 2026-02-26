// @ts-ignore
import { getNames } from "country-list";
import { CreditCard } from "lucide-react";
import { memo, useState } from "react";
interface Props {
	initialData: any;
	onChange: (key: string, value: string) => void;
}

export const AccountInfo = memo(({ initialData, onChange }: Props) => {
	const [fullName, setFullName] = useState(initialData.fullName);
	const [email, setEmail] = useState(initialData.email);

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

export const StripeConnect = memo(
	({ onChange }: { onChange: (k: string, v: boolean) => void }) => {
		const [connected, setConnected] = useState(false);

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
