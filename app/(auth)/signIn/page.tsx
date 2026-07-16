"use client";

import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { validateSignIn } from "@/app/_lib/validation";
import AuthPage from "@/components/AuthPage";
import { CredentioalsForm } from "@/components/AuthPart";
import Loading from "@/components/Loading";
import { ShowToast } from "@/components/Toaster";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { useRouter } from "next/navigation";
import { ReactElement, useRef, useState } from "react";

export default function SellerSignIn(): ReactElement {
	// Master form state held in a Ref to prevent parent re-renders on every keystroke
	const formData = useRef({
		email: "",
		password: "",
	});
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		try {
			setLoading(true);
			const email = formData.current.email?.trim();
			const password = formData.current.password?.trim();

			// ---------- VALIDATION ----------
			const result = validateSignIn(formData.current);

			if (!result.valid) {
				ShowToast(result.message, 1);
				return;
			}

			// ---------- SIGN IN ----------
			const userCredential = await signInWithEmailAndPassword(
				firebaseClientAuth,
				email,
				password,
			);

			if (userCredential.user) {
				router.replace("/dashboard");
			}
		} catch (error: any) {
			console.log("Error sign in:", error);

			if (error.code === "auth/user-not-found") {
				ShowToast("No account found with this email.", 0);
			} else if (error.code === "auth/wrong-password") {
				ShowToast("Incorrect password.", 0);
			} else if (error.code === "auth/invalid-email") {
				ShowToast("Invalid email address.", 0);
			} else {
				ShowToast("Sign in failed. Please try again.", 0);
			}
		} finally {
			setLoading(false);
		}
	};

	const updateField = (key: string, value: string | boolean) => {
		formData.current = { ...formData.current, [key]: value };
	};

	return (
		<AuthPage>
			<div className="min-h-screen bg-[#f7f1e6] text-[#182033]">
				<div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
					<section className="relative flex w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_82%_20%,rgba(214,173,88,.18),transparent_30%),linear-gradient(135deg,#061a3d,#0b2b63)] px-6 py-16 text-white lg:min-h-screen lg:w-[44%] lg:px-10 lg:py-0">
						<div className="relative z-10 max-w-md">
							<h1 className="heading-font font-bold  text-4xl leading-tight text-[#d6ad58] sm:text-5xl">
								Sign in to continue.
							</h1>
							<p className="mt-4 text-lg text-white/80">
								Manage your listings and competitions in one
								place.
							</p>
						</div>
					</section>

					<section className="flex w-full flex-1 items-center justify-center bg-[#f7f1e6] px-5 py-12 md:px-10 lg:px-14">
						<div className="w-full max-w-md rounded-[28px] border border-[#061a3d]/12 bg-white p-8 shadow-[0_20px_60px_rgba(6,26,61,.12)]">
							<div className="mb-8 flex flex-col items-center text-center">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#d6ad58] text-xl shadow-sm">
									<span>🎨</span>
								</div>
								<h2 className=" text-3xl text-[#061a3d]">
									Welcome Back!
								</h2>
								<p className="mt-2 text-sm text-[#6a7280]">
									Enter your details to access dashboard.
								</p>
							</div>

							<form
								className="flex w-full flex-col space-y-6"
								onSubmit={(e) => e.preventDefault()}
							>
								<div className="flex w-full flex-col space-y-4 text-[#182033]">
									<CredentioalsForm
										initialData={{
											email: formData.current.email,
											password: formData.current.password,
										}}
										onChange={updateField}
									/>
									<a
										href="/forgotPassword"
										className="self-end text-sm font-semibold text-[#061a3d] transition hover:text-[#d6ad58]"
									>
										Forgot password?
									</a>
								</div>

								<button
									onClick={handleClick}
									className="w-full rounded-full bg-[#d6ad58] px-4 py-3 text-lg font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39]"
								>
									Sign In
								</button>
							</form>
						</div>
					</section>
				</div>
			</div>
			{loading && <Loading />}
		</AuthPage>
	);
}
