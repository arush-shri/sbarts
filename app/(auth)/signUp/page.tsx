"use client";

import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { validateAccountSignUp } from "@/app/_lib/validation";
import AuthPage from "@/components/AuthPage";
import Loading from "@/components/Loading";
import { ShowToast } from "@/components/Toaster";
import {
	createUserWithEmailAndPassword,
	deleteUser,
	updateProfile,
} from "@firebase/auth";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactElement, useState } from "react";

export default function SignUpPage(): ReactElement {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [form, setForm] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const updateField = (key: keyof typeof form, value: string) => {
		setForm((current) => ({ ...current, [key]: value }));
	};

	const getErrorCode = (error: unknown) =>
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		typeof error.code === "string"
			? error.code
			: "";

	const handleSubmit = async () => {
		const cleanForm = {
			...form,
			fullName: form.fullName.trim(),
			email: form.email.trim().toLowerCase(),
		};
		const result = validateAccountSignUp(cleanForm);

		if (!result.valid) {
			ShowToast(result.message, 1);
			return;
		}

		try {
			setLoading(true);
			const userCredential = await createUserWithEmailAndPassword(
				firebaseClientAuth,
				cleanForm.email,
				cleanForm.password,
			);

			await updateProfile(userCredential.user, {
				displayName: cleanForm.fullName,
			});

			const token = await userCredential.user.getIdToken();
			const res = await fetch("/api/auth/signUp", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fullName: cleanForm.fullName,
					email: cleanForm.email,
				}),
			});

			const data = await res.json();
			if (!res.ok) {
				await deleteUser(userCredential.user).catch(() => {});
				ShowToast(data.error || "Could not create account profile.", 0);
				return;
			}

			ShowToast("Account created successfully.", 2);
			router.replace("/dashboard");
		} catch (error: unknown) {
			console.error("Sign up error:", error);
			const errorCode = getErrorCode(error);

			if (errorCode === "auth/email-already-in-use") {
				ShowToast("An account already exists with this email.", 0);
			} else if (errorCode === "auth/invalid-email") {
				ShowToast("Invalid email address.", 0);
			} else if (errorCode === "auth/weak-password") {
				ShowToast("Please choose a stronger password.", 0);
			} else {
				ShowToast("Sign up failed. Please try again.", 0);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthPage>
			<div className="min-h-screen bg-[#f7f1e6] text-[#182033]">
				<div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
					<section className="relative flex w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_82%_20%,rgba(214,173,88,.18),transparent_30%),linear-gradient(135deg,#061a3d,#0b2b63)] px-6 py-16 text-white lg:min-h-screen lg:w-[44%] lg:px-10 lg:py-0">
						<div className="relative z-10 max-w-md">
							<p className="text-xs font-bold uppercase tracking-[.22em] text-white/65">
								SB Arts account
							</p>
							<h1 className="heading-font mt-3 text-4xl font-bold leading-tight text-[#d6ad58] sm:text-5xl">
								Create your account.
							</h1>
							<p className="mt-4 text-lg text-white/80">
								Join the workspace to publish artwork listings
								and keep your catalogue current.
							</p>
						</div>
					</section>

					<section className="flex w-full flex-1 items-center justify-center bg-[#f7f1e6] px-5 py-12 md:px-10 lg:px-14">
						<div className="w-full max-w-md border border-[#061a3d]/12 bg-white p-8 shadow-[0_20px_60px_rgba(6,26,61,.12)]">
							<div className="mb-8 flex flex-col items-center text-center">
								<div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#d6ad58] text-[#061a3d] shadow-sm">
									<UserPlus className="h-5 w-5" />
								</div>
								<h2 className="text-3xl text-[#061a3d]">
									Sign up
								</h2>
								<p className="mt-2 text-sm text-[#6a7280]">
									Enter your details to get started.
								</p>
							</div>

							<form
								className="flex w-full flex-col space-y-5"
								onSubmit={(event) => event.preventDefault()}
							>
								<label className="block">
									<span className="mb-2 block text-sm font-semibold uppercase tracking-[.16em] text-[#061a3d]">
										Full Name
									</span>
									<input
										type="text"
										value={form.fullName}
										placeholder="Enter full name"
										onChange={(event) =>
											updateField(
												"fullName",
												event.target.value,
											)
										}
										className="w-full border border-[#061a3d]/15 bg-[#fdfaf4] px-4 py-3 text-[#182033] placeholder:text-[#6a7280] focus:border-[#d6ad58] focus:outline-none focus:ring-2 focus:ring-[#d6ad58]/20"
									/>
								</label>

								<label className="block">
									<span className="mb-2 block text-sm font-semibold uppercase tracking-[.16em] text-[#061a3d]">
										Email Address
									</span>
									<input
										type="email"
										value={form.email}
										placeholder="you@example.com"
										onChange={(event) =>
											updateField(
												"email",
												event.target.value,
											)
										}
										className="w-full border border-[#061a3d]/15 bg-[#fdfaf4] px-4 py-3 text-[#182033] placeholder:text-[#6a7280] focus:border-[#d6ad58] focus:outline-none focus:ring-2 focus:ring-[#d6ad58]/20"
									/>
								</label>

								<label className="block">
									<span className="mb-2 block text-sm font-semibold uppercase tracking-[.16em] text-[#061a3d]">
										Password
									</span>
									<div className="relative">
										<input
											type={
												showPassword
													? "text"
													: "password"
											}
											value={form.password}
											placeholder="Password"
											onChange={(event) =>
												updateField(
													"password",
													event.target.value,
												)
											}
											className="w-full border border-[#061a3d]/15 bg-[#fdfaf4] px-4 py-3 pr-10 text-[#182033] placeholder:text-[#6a7280] focus:border-[#d6ad58] focus:outline-none focus:ring-2 focus:ring-[#d6ad58]/20"
										/>
										<button
											type="button"
											onClick={() =>
												setShowPassword((value) => !value)
											}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a7280] transition hover:text-[#061a3d]"
											aria-label={
												showPassword
													? "Hide password"
													: "Show password"
											}
										>
											{showPassword ? (
												<EyeOff size={18} />
											) : (
												<Eye size={18} />
											)}
										</button>
									</div>
									<p className="mt-2 text-[11px] uppercase tracking-[.16em] text-[#6a7280]">
										Use 8-32 characters with uppercase,
										lowercase, number, and special character.
									</p>
								</label>

								<label className="block">
									<span className="mb-2 block text-sm font-semibold uppercase tracking-[.16em] text-[#061a3d]">
										Confirm Password
									</span>
									<input
										type={
											showPassword ? "text" : "password"
										}
										value={form.confirmPassword}
										placeholder="Confirm password"
										onChange={(event) =>
											updateField(
												"confirmPassword",
												event.target.value,
											)
										}
										className="w-full border border-[#061a3d]/15 bg-[#fdfaf4] px-4 py-3 text-[#182033] placeholder:text-[#6a7280] focus:border-[#d6ad58] focus:outline-none focus:ring-2 focus:ring-[#d6ad58]/20"
									/>
								</label>

								<button
									type="button"
									onClick={handleSubmit}
									className="w-full bg-[#d6ad58] px-4 py-3 text-lg font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39]"
								>
									Create Account
								</button>
							</form>

							<div className="mt-7 text-center text-sm text-[#6a7280]">
								Already have an account?{" "}
								<Link
									href="/signIn"
									className="font-semibold text-[#061a3d] transition hover:text-[#d6ad58]"
								>
									Sign in
								</Link>
							</div>
						</div>
					</section>
				</div>
			</div>
			{loading && <Loading />}
		</AuthPage>
	);
}
