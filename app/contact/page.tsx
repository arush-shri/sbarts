"use client";

import { ShowToast } from "@/components/Toaster";
import { FormEvent, useState } from "react";

export default function ContactPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);

		try {
			const res = await fetch("/api/inquiry", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					email,
					subject,
					message,
				}),
			});
			const data = await res.json();

			if (!res.ok) {
				ShowToast(data.error || "Could not send message.", 0);
				return;
			}

			ShowToast("Message sent. SB Arts will contact you soon.", 2);
			setName("");
			setEmail("");
			setSubject("");
			setMessage("");
		} catch (error) {
			console.error(error);
			ShowToast("Could not send message.", 0);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="bg-[#f7f1e6] text-[#182033]">
			<section className="bg-[#061a3d] py-5 text-white">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
					<h1 className="heading-font font-bold text-5xl leading-tight text-[#d6ad58] md:text-7xl">
						Get in Touch
					</h1>
					<p className="heading-font mt-4 text-xl md:text-2xl">
						For commissions, media, partnerships, marketplace
						inquiries, or competition questions.
					</p>
				</div>
			</section>

			<section className="py-10">
				<div className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-9 lg:grid-cols-[.9fr_1.1fr]">
					<div className="border border-[#061a3d]/12 bg-white p-8">
						<h2 className=" text-4xl text-[#061a3d]">
							Contact SB Arts
						</h2>
						<p className="mt-5">
							<strong>Email:</strong> info@msbart.com
						</p>
						<p className="mt-2">
							<strong>Website:</strong> msbart.com
						</p>
						<div className="mt-6 flex gap-3">
							<a
								href="#"
								aria-label="Instagram"
								className="grid h-11 w-11 place-items-center rounded-full bg-[#061a3d] font-bold text-[#d6ad58]"
							>
								IG
							</a>
							<a
								href="#"
								aria-label="X"
								className="grid h-11 w-11 place-items-center rounded-full bg-[#061a3d] font-bold text-[#d6ad58]"
							>
								X
							</a>
						</div>
					</div>

					<form
						onSubmit={handleSubmit}
						className="grid gap-4 border border-[#061a3d]/12 bg-[#061a3d] p-8"
					>
						<h2 className=" text-4xl text-[#d6ad58]">
							Send a Message
						</h2>
						<input
							required
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="Your name"
							className="border border-[#d6ad58]/50 px-4 py-3 outline-none focus:border-[#d6ad58] text-[#fff] placeholder:text-[#fff]/70"
						/>
						<input
							required
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="Email address"
							className="border border-[#d6ad58]/50 px-4 py-3 outline-none focus:border-[#d6ad58] text-[#fff] placeholder:text-[#fff]/70"
						/>
						<input
							value={subject}
							onChange={(event) => setSubject(event.target.value)}
							placeholder="Subject"
							className="border border-[#d6ad58]/50 px-4 py-3 outline-none focus:border-[#d6ad58] text-[#fff] placeholder:text-[#fff]/70"
						/>
						<textarea
							required
							value={message}
							onChange={(event) => setMessage(event.target.value)}
							placeholder="Your message"
							className="min-h-40 resize-y border border-[#d6ad58]/50 px-4 py-3 outline-none focus:border-[#d6ad58] text-[#fff] placeholder:text-[#fff]/70"
						/>
						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex items-center justify-center bg-[#d6ad58] px-6 py-4 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39] disabled:cursor-not-allowed disabled:opacity-70"
						>
							{isSubmitting ? "Sending..." : "Send Message"}
						</button>
					</form>
				</div>
			</section>
		</main>
	);
}
