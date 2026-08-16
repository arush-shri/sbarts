"use client";

import { useSiteContent } from "@/app/_context/SiteContentContext";
import PageIntro from "@/components/PageIntro";
import { ShowToast } from "@/components/Toaster";
import Image from "next/image";
import { FormEvent, useState } from "react";

export default function ContactPage() {
	const { getPageContent } = useSiteContent();
	const content = getPageContent("contact");
	const contactEmail = content.fields?.contactEmail || "info@msbart.com";
	const websiteText = content.fields?.websiteText || "msbart.com";
	const websiteUrl = content.fields?.websiteUrl || "https://msbart.com";
	const instagramUrl = content.fields?.instagramUrl || "#";
	const xUrl = content.fields?.xUrl || "#";
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
					<PageIntro
						pageKey="contact"
						titleClassName="heading-font font-bold text-5xl leading-tight text-[#d6ad58] md:text-7xl"
						subtitleClassName="heading-font mt-4 text-xl md:text-2xl"
						subtextClassName="mt-4 max-w-3xl text-lg text-white/75"
					/>
				</div>
			</section>

			<section className="py-10">
				<div className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-9 lg:grid-cols-[.9fr_1.1fr]">
					<div className="border border-[#061a3d]/12 bg-white p-8">
						<h2 className="text-4xl text-[#061a3d]">
							Contact SB Arts
						</h2>
						<p className="mt-5">
							<strong>Email:</strong> {contactEmail}
						</p>
						<p className="mt-2">
							<strong>Website:</strong>{" "}
							<a
								href={websiteUrl}
								target="_blank"
								rel="noreferrer"
							>
								{websiteText}
							</a>
						</p>
						<div className="mt-6 flex gap-3">
							<a
								href={instagramUrl}
								target={
									instagramUrl === "#" ? undefined : "_blank"
								}
								rel={
									instagramUrl === "#"
										? undefined
										: "noreferrer"
								}
								aria-label="Instagram"
								className="grid h-11 w-11 place-items-center rounded-full bg-[#061a3d] font-bold text-[#d6ad58]"
							>
								<Image
									src="/svg/insta.svg"
									alt="SB Arts"
									width={29}
									height={29}
								/>
							</a>
							<a
								href={xUrl}
								target={xUrl === "#" ? undefined : "_blank"}
								rel={xUrl === "#" ? undefined : "noreferrer"}
								aria-label="X"
								className="grid h-11 w-11 place-items-center rounded-full bg-[#061a3d] font-bold text-[#d6ad58]"
							>
								<Image
									src="/svg/x.svg"
									alt="SB Arts"
									width={32}
									height={32}
								/>
							</a>
						</div>
					</div>

					<form
						onSubmit={handleSubmit}
						className="grid gap-4 border border-[#061a3d]/12 bg-[#061a3d] p-8"
					>
						<h2 className="text-4xl text-[#d6ad58]">
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
