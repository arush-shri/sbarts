"use client";

import { Eye, EyeOff, Key, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { ReactElement, useState } from "react";

export default function ResetPasswordPage(): ReactElement {
	return (
		<div className="flex min-h-screen bg-white text-[#0F1724] px-5 md:px-20 gap-10">
			{/* Left Section: Information and Illustration */}
			<div className="hidden lg:flex w-1/2 flex-col justify-center px-8 bg-[#F8F9FA]">
				<div className="">
					<h1 className="text-4xl font-bold mb-4">
						Reset your password
					</h1>
					<p className="text-[#98A0AB] text-md w-2/3">
						Securely update your password in three quick steps:
						confirm email, verify OTP, and set a new password.
					</p>

					<Image
						src="/images/passlock.jpg"
						alt="Secure reset illustration"
						width={1184}
						height={864}
						className="object-contain w-full h-full"
						priority
					/>
				</div>
			</div>

			{/* Right Section: Interactive Form Component */}
			<div className="w-full lg:w-1/2 flex items-center justify-center pt-0 md:pt-24">
				<ResetPasswordForm />
			</div>
		</div>
	);
}

function ResetPasswordForm() {
	const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);

	// Mock handlers
	const handleSendOtp = () => setStep(2);
	const handleVerifyOtp = () => setStep(3);

	return (
		<div className="w-full border border-[#0000001A] rounded-2xl px-6 py-4 shadow-sm">
			<h2 className="text-2xl font-bold mb-2">Forgot password</h2>
			<p className="text-[#98A0AB] text-sm mb-8">
				Enter your email, verify the one-time code, and choose a new
				password for your account.
			</p>

			<div className="space-y-8">
				{/* Step 1: Email */}
				<section
					className={`transition-opacity duration-300 ${step < 1 ? "opacity-50 pointer-events-none" : "opacity-100"}`}
				>
					<div className="flex justify-between items-center mb-2">
						<label className="text-xs font-semibold text-[#98A0AB] uppercase tracking-wider">
							Step 1 — Confirm your email
						</label>
						<span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">
							<span className="bg-blue-600 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]">
								1
							</span>{" "}
							Account email
						</span>
					</div>
					<div className="relative">
						<Mail
							className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A0AB]"
							size={18}
						/>
						<input
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full pl-10 pr-4 py-3 border border-[#0000001A] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							disabled={step > 1}
						/>
					</div>
					{step === 1 && (
						<>
							<p className="text-[11px] text-[#98A0AB] mt-2 italic">
								We'll send a one-time password (OTP) to this
								email address.
							</p>
							<button
								onClick={handleSendOtp}
								className="w-full mt-4 bg-[#007AFF] text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors"
							>
								Send OTP
							</button>
						</>
					)}
				</section>

				{/* Step 2: OTP */}
				<section
					className={`transition-opacity duration-300 ${step < 2 ? "opacity-40" : "opacity-100"}`}
				>
					<div className="flex justify-between items-center mb-2">
						<label className="text-xs font-semibold text-[#98A0AB] uppercase tracking-wider">
							Step 2 — Enter OTP
						</label>
						<span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">
							<span className="bg-blue-600 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]">
								2
							</span>{" "}
							Verify code
						</span>
					</div>
					<div className="relative">
						<Key
							className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A0AB]"
							size={18}
						/>
						<input
							type="text"
							placeholder="123456"
							maxLength={6}
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							disabled={step < 2 || step > 2}
							className="w-full pl-10 pr-4 py-3 border border-[#0000001A] rounded-lg focus:outline-none 
                            focus:ring-2 focus:ring-blue-500/20"
						/>
					</div>
					{step === 2 && (
						<>
							<p className="text-[11px] text-[#98A0AB] mt-2 italic">
								Enter the 6-digit code from your email. This
								code expires in 10 minutes.
							</p>
							<button
								onClick={handleVerifyOtp}
								className="w-full mt-4 bg-[#007AFF] text-white font-bold py-3 rounded-lg hover:bg-blue-600 
                                transition-colors"
							>
								Verify OTP
							</button>
						</>
					)}
				</section>

				{/* Step 3: New Password (Visible only after step 2 is complete) */}
				{step === 3 && (
					<section className="animate-in fade-in slide-in-from-top-2 duration-500">
						<div className="flex justify-between items-center mb-2">
							<label className="text-xs font-semibold text-[#98A0AB] uppercase tracking-wider">
								Step 3 — Set new password
							</label>
							<span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">
								<span className="bg-blue-600 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]">
									3
								</span>{" "}
								Update password
							</span>
						</div>
						<div className="relative">
							<Lock
								className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A0AB]"
								size={18}
							/>
							<input
								type={showPass ? "text" : "password"}
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full pl-10 pr-10 py-3 border border-[#0000001A] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							/>
							<button
								type="button"
								onClick={() => setShowPass(!showPass)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A0AB] hover:text-[#0F1724]"
							>
								{showPass ? (
									<EyeOff size={18} />
								) : (
									<Eye size={18} />
								)}
							</button>
						</div>
						<p className="text-[11px] text-[#98A0AB] mt-2 italic">
							Use at least 8 characters, including a number and a
							symbol.
						</p>

						<button className="w-full mt-6 bg-[#007AFF] text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors">
							Verify OTP & update password
						</button>
					</section>
				)}
			</div>

			<div className="mt-8 text-center">
				<button className="text-sm text-[#98A0AB] hover:text-[#0F1724] transition-colors">
					Remembered your password?{" "}
					<span className="text-[#007AFF] font-semibold">
						Back to sign in
					</span>
				</button>
			</div>
		</div>
	);
}
