"use client";

import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { validateEmail, validatePassword } from "@/app/_lib/dataProcessing";
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
			if (!email || !password) {
				ShowToast("Email and password are required.", 1);
				return;
			}

			if (!validateEmail(email)) {
				ShowToast("Please enter a valid email address.", 1);
				return;
			}

			const passwordError = validatePassword(password);

			if (passwordError) {
				ShowToast(passwordError, 1);
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
			<div className="flex min-h-screen bg-white">
				{/* Left Side: Hero Image Section */}
				<div
					className="hidden lg:h-screen lg:flex w-1/2 relative bg-cover bg-center"
					style={{ backgroundImage: `url('/images/sellerbg.avif')` }}
				>
					<div className="absolute inset-0 bg-black/20" />
					<div className="absolute bottom-12 left-12 text-white max-w-md">
						<h1 className="text-5xl font-bold mb-6 leading-tight">
							Sign in to continue.
						</h1>
						<p className="text-lg mb-8 opacity-90">
							Access your purchases, manage your listings, and
							keep track of your orders in one place.
						</p>
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
								Welcome Back, Artist!
							</h2>
							<p className="text-[#0F1724] mt-2">
								Enter your details to access your seller
								dashboard.
							</p>
						</div>

						<form
							className="space-y-8 w-full flex flex-col"
							onSubmit={(e) => e.preventDefault()}
						>
							<div className="flex flex-col space-y-4 text-[#0F1724] w-full">
								<CredentioalsForm
									initialData={{
										email: formData.current.email,
										password: formData.current.password,
									}}
									onChange={updateField}
								/>
								<a
									href="/forgotPassword"
									className="self-end text-md font-semibold text-blue-500 cursor-pointer hover:underline"
								>
									Forgot password?
								</a>
							</div>

							<button
								onClick={handleClick}
								className="w-full bg-[#0061f2] text-white py-3 rounded-lg font-medium hover:bg-blue-700
                            transition-colors mb-15 text-lg"
							>
								Sign In
							</button>

							<p className="self-center text-md font-medium text-[#98A2B3]">
								Don't have an account?{" "}
								<a
									href="/signUp"
									className="self-center text-md font-semibold text-blue-500 cursor-pointer hover:underline"
								>
									Create Seller Account
								</a>
							</p>
						</form>
					</div>
				</div>
			</div>
			{loading && <Loading />}
		</AuthPage>
	);
}
