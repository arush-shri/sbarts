"use client";

import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import AuthPage from "@/components/AuthPage";
import { sendPasswordResetEmail } from "@firebase/auth";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
	const [email, setEmail] = useState("");
	const router = useRouter();

	const navToSignIn = () => router.replace("/signIn");
	const handleSendOtp = async () => {
		try {
			await sendPasswordResetEmail(firebaseClientAuth, email);

			alert("Password reset email sent. Please check your inbox.");
			navToSignIn();
		} catch (error: any) {
			console.error(error);

			if (error.code === "auth/user-not-found") {
				alert("No account found with this email.");
			} else {
				alert("Failed to send reset email.");
			}
		}
	};

	return (
		<AuthPage>
			<div className="w-full border border-[#0000001A] rounded-2xl px-6 py-4 shadow-sm">
				<h2 className="text-2xl font-bold mb-2">Forgot password</h2>
				<p className="text-[#98A0AB] text-sm mb-8">
					Enter your email, verify the one-time code, and choose a new
					password for your account.
				</p>

				<div className="space-y-8">
					{/* Step 1: Email */}
					<section
						className={`transition-opacity duration-300 opacity-100`}
					>
						<div className="flex justify-between items-center mb-2">
							<label className="text-xs font-semibold text-[#98A0AB] uppercase tracking-wider">
								Confirm your email
							</label>
							<span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">
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
							/>
						</div>
						<p className="text-[11px] text-[#98A0AB] mt-2 italic">
							We'll send a mail to reset you password to this
							email address.
						</p>
						<button
							onClick={handleSendOtp}
							className="w-full mt-4 bg-[#007AFF] text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors"
						>
							Reset Password
						</button>
					</section>
				</div>

				<div className="mt-8 text-center">
					<button className="text-sm text-[#0F1724] transition-colors">
						Remembered your password?{" "}
						<span
							onClick={navToSignIn}
							className="text-[#007AFF] font-semibold cursor-pointer hover:underline underline-offset-2"
						>
							Back to sign in
						</span>
					</button>
				</div>
			</div>
		</AuthPage>
	);
}
