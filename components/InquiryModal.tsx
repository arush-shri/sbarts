"use client";

import { PaintingType } from "@/app/_lib/customTypes";
import { X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { ShowToast } from "./Toaster";

type InquiryModalProps = {
	painting?: PaintingType;
	open: boolean;
	onClose: () => void;
};

export default function InquiryModal({
	painting,
	open,
	onClose,
}: InquiryModalProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (!open) return;
		setMessage(
			painting
				? `Hi, I am interested in "${painting.title}". Please share availability and next steps.`
				: "",
		);
	}, [open, painting]);

	if (!open) return null;

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
					message,
					paintingId: painting?.id,
					paintingTitle: painting?.title,
				}),
			});

			const data = await res.json();
			if (!res.ok) {
				ShowToast(data.error || "Could not send inquiry.", 0);
				return;
			}

			ShowToast("Inquiry sent. SB Arts will contact you soon.", 2);
			setName("");
			setEmail("");
			setMessage("");
			onClose();
		} catch (error) {
			console.error(error);
			ShowToast("Could not send inquiry.", 0);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-[120] flex items-center justify-center bg-[#031126]/80 px-4 py-8"
			onMouseDown={onClose}
			role="dialog"
			aria-modal="true"
			aria-label="Artwork inquiry"
		>
			<form
				onSubmit={handleSubmit}
				onMouseDown={(event) => event.stopPropagation()}
				className="w-full max-w-xl border border-[#d6ad58]/50 bg-white p-6 shadow-[0_24px_70px_rgba(6,26,61,.28)]"
			>
				<div className="mb-5 flex items-start justify-between gap-4">
					<div>
						<p className="text-xs font-bold uppercase tracking-[.22em] text-[#b88d39]">
							Inquire
						</p>
						<h2 className="mt-2  text-3xl leading-tight text-[#061a3d]">
							{painting
								? `Ask about ${painting.title}`
								: "Send a message"}
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="grid h-10 w-10 place-items-center border border-[#061a3d]/15 text-[#061a3d] transition hover:bg-[#f7f1e6]"
						aria-label="Close inquiry form"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="grid gap-4">
					<label className="grid gap-2 text-sm font-semibold text-[#182033]">
						Name
						<input
							required
							value={name}
							onChange={(event) => setName(event.target.value)}
							className="border border-[#061a3d]/20 bg-white px-4 py-3 font-normal outline-none transition focus:border-[#d6ad58]"
							placeholder="Your name"
						/>
					</label>
					<label className="grid gap-2 text-sm font-semibold text-[#182033]">
						Email
						<input
							required
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							className="border border-[#061a3d]/20 bg-white px-4 py-3 font-normal outline-none transition focus:border-[#d6ad58]"
							placeholder="you@example.com"
						/>
					</label>
					<label className="grid gap-2 text-sm font-semibold text-[#182033]">
						Message
						<textarea
							required
							value={message}
							onChange={(event) => setMessage(event.target.value)}
							className="min-h-36 resize-y border border-[#061a3d]/20 bg-white px-4 py-3 font-normal outline-none transition focus:border-[#d6ad58]"
							placeholder="Tell us what you would like to know."
						/>
					</label>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="mt-5 inline-flex w-full items-center justify-center bg-[#d6ad58] px-5 py-4 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39] disabled:cursor-not-allowed disabled:opacity-70"
				>
					{isSubmitting ? "Sending..." : "Send Inquiry"}
				</button>
			</form>
		</div>
	);
}
