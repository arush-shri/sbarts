"use client";

import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { validateEmail } from "@/app/_lib/validation";
import AuthPage from "@/components/AuthPage";
import { ShowToast } from "@/components/Toaster";
import { sendPasswordResetEmail } from "@firebase/auth";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactElement, useState } from "react";

export default function ResetPasswordPage(): ReactElement {
	return (
		<div className="min-h-screen bg-[#f7f1e6] text-[#182033]">
			<div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
				<section className="relative flex w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_82%_20%,rgba(214,173,88,.18),transparent_30%),linear-gradient(135deg,#061a3d,#0b2b63)] px-6 py-16 text-white lg:min-h-screen lg:w-[44%] lg:px-10 lg:py-0">
					<div className="max-w-md">
						<h1 className="heading-font font-bold text-4xl leading-tight text-[#d6ad58] sm:text-5xl">
							Reset your password
						</h1>
						<p className="mt-4 text-lg text-white/80">
							Securely update your password in a few quick steps
							and return to your seller workspace.
						</p>
					</div>
				</section>

				<div className="flex w-full flex-1 items-center justify-center bg-[#f7f1e6] px-5 py-12 md:px-10 lg:px-14">
					<ResetPasswordForm />
				</div>
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
			// ---------- VALIDATE ----------
			const result = validateEmail(email);

			if (!result.valid) {
				ShowToast(result.message, 1);
				return;
			}

			// ---------- SEND RESET EMAIL ----------
			await sendPasswordResetEmail(firebaseClientAuth, email);

			ShowToast("Password reset email sent. Please check your inbox.", 2);
			navToSignIn();
		} catch (error: any) {
			console.error(error);

			if (error.code === "auth/user-not-found") {
				ShowToast("No account found with this email.", 0);
			} else if (error.code === "auth/invalid-email") {
				ShowToast("Invalid email address.", 0);
			} else {
				ShowToast("Failed to send reset email.", 0);
			}
		}
	};

	return (
		<AuthPage>
			<div className="w-full max-w-md border border-[#061a3d]/12 bg-white p-8 shadow-[0_20px_60px_rgba(6,26,61,.12)]">
				<h2 className=" text-3xl text-[#061a3d]">Forgot password</h2>
				<p className="mt-3 text-sm leading-6 text-[#6a7280]">
					Enter your email and we will send you a secure reset link
					for your account.
				</p>

				<div className="mt-8 space-y-6">
					<section className="opacity-100 transition-opacity duration-300">
						<div className="mb-2 flex items-center justify-between">
							<label className="text-xs font-semibold uppercase tracking-[.16em] text-[#061a3d]">
								Confirm your email
							</label>
							<span className="rounded-full bg-[#f7f1e6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#b88d39]">
								Account email
							</span>
						</div>
						<div className="relative">
							<Mail
								className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a7280]"
								size={18}
							/>
							<input
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full border border-[#061a3d]/15 bg-[#fdfaf4] py-3 pl-10 pr-4 text-[#182033] placeholder:text-[#6a7280] focus:border-[#d6ad58] focus:outline-none focus:ring-2 focus:ring-[#d6ad58]/20"
							/>
						</div>
						<p className="mt-2 text-[11px] uppercase tracking-[.16em] text-[#6a7280]">
							We will send a reset message to this address.
						</p>
						<button
							onClick={handleSendOtp}
							className="mt-4 w-full bg-[#d6ad58] px-4 py-3 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39]"
						>
							Reset Password
						</button>
					</section>
				</div>

				<div className="mt-8 text-center">
					<button className="text-sm text-[#182033] transition-colors">
						Remembered your password?{" "}
						<span
							onClick={navToSignIn}
							className="cursor-pointer font-semibold text-[#061a3d] underline-offset-2 transition hover:text-[#d6ad58]"
						>
							Back to sign in
						</span>
					</button>
				</div>
			</div>
		</AuthPage>
	);
}
