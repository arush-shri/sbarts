"use client";

import { ShowToast } from "@/components/Toaster";
import { FormEvent, useEffect, useState } from "react";
import { CompetitionEntry } from "../_lib/customTypes";

export default function CompetitionPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [grade, setGrade] = useState("");
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [competition, setCompetition] = useState<CompetitionEntry | null>(
		null,
	);
	const [compLoading, setCompLoading] = useState(true);

	useEffect(() => {
		const loadCompetition = async () => {
			try {
				const res = await fetch("/api/competition");
				const json = await res.json();
				if (res.ok && json.data) {
					setCompetition(json.data);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setCompLoading(false);
			}
		};

		loadCompetition();
	}, []);

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
					subject: "Competition Registration",
					message: `Grade: ${grade}\n\n${message || "Please send entry information."}`,
				}),
			});
			const data = await res.json();

			if (!res.ok) {
				ShowToast(data.error || "Could not register interest.", 0);
				return;
			}

			ShowToast("Interest registered. SB Arts will contact you soon.", 2);
			setName("");
			setEmail("");
			setGrade("");
			setMessage("");
		} catch (error) {
			console.error(error);
			ShowToast("Could not register interest.", 0);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="bg-[#f7f1e6] text-[#182033]">
			<section className="bg-[#061a3d] py-5 text-white">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
					<h1 className="heading-font font-bold text-5xl uppercase tracking-[.22em] text-[#d6ad58]">
						SB Arts International Juried Competition
					</h1>
					<p className="mt-2 max-w-4xl text-2xl italic md:text-3xl heading-font leading-tight text-[#d6ad58]">
						Arts for Hope, Dignity & Freedom
					</p>
					<p className="mt-4 max-w-3xl text-lg text-white/75">
						An international juried art competition for high school
						students worldwide.
					</p>
					<a
						href="#entry"
						className="mt-8 inline-flex items-center justify-center bg-[#d6ad58] px-6 py-4 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39]"
					>
						Enter Now
					</a>
				</div>
			</section>

			<section className="py-10">
				<div className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-6 md:grid-cols-3">
					{[
						[
							"International",
							"Open to high school students worldwide.",
						],
						[
							"Juried",
							"Reviewed by distinguished artists and arts professionals.",
						],
						[
							"Theme",
							"Hope, dignity, freedom, resilience, identity, and humanity.",
						],
					].map(([title, copy]) => (
						<article
							key={title}
							className="border border-[#061a3d]/12 bg-white p-7 shadow-[0_18px_50px_rgba(6,26,61,.12)]"
						>
							<h2 className=" text-2xl text-[#061a3d]">
								{title}
							</h2>
							<p className="mt-3 text-[#6a7280]">{copy}</p>
						</article>
					))}
				</div>
			</section>

			<section className="bg-[#f7f1e6] pb-12 pt-2">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
					<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<div className="text-xs font-bold uppercase tracking-[.22em] text-[#b88d39]">
								Key Dates
							</div>
							<h2 className="mt-2  text-4xl text-[#061a3d]">
								Competition Timeline
							</h2>
						</div>
						<div className="text-right text-sm uppercase tracking-[.12em] text-[#6a7280]">
							{compLoading
								? "Loading status..."
								: competition?.status || "Status pending"}
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{compLoading ? (
							Array.from({ length: 4 }).map((_, index) => (
								<div
									key={index}
									className="min-h-[160px] animate-pulse border border-[#061a3d]/12 bg-white p-6"
								/>
							))
						) : competition ? (
							[
								{
									title: "Entries Open",
									date: competition.entriesOpen,
								},
								{
									title: "Final Deadline",
									date: competition.finalDeadline,
								},
								{
									title: "Winners Announcement",
									date: competition.winnersAnnouncement,
								},
								{
									title: "Exhibition Open",
									date: competition.exhibitionOpen,
								},
							].map((item) => (
								<div
									key={item.title}
									className="border border-[#061a3d]/12 bg-white p-6 shadow-[0_18px_40px_rgba(6,26,61,.08)]"
								>
									<div className="text-xs font-bold uppercase tracking-[.18em] text-[#b88d39]">
										{item.title}
									</div>
									<div className="mt-4 text-2xl font-semibold text-[#061a3d]">
										{item.date}
									</div>
								</div>
							))
						) : (
							<div className="border border-[#061a3d]/12 bg-white p-8 text-center text-[#6a7280]">
								No competition dates are available yet.
							</div>
						)}
					</div>
				</div>
			</section>

			<section className="bg-white py-20">
				<div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-center gap-10 lg:grid-cols-2">
					<div>
						<div className="text-xs font-bold uppercase tracking-[.22em] text-[#b88d39]">
							Competition Mission
						</div>
						<h2 className="mt-3  text-4xl leading-tight text-[#061a3d] md:text-5xl">
							Young artists. Global voices.
						</h2>
						<p className="mt-5 text-[#6a7280]">
							The competition recognizes artistic excellence while
							encouraging students to use visual art to reflect on
							the world around them and imagine a more hopeful and
							dignified future.
						</p>
					</div>
					<div className="min-h-[420px] border border-[#d6ad58] bg-gradient-to-br from-[#d6ad58] to-[#0c2a62]" />
				</div>
			</section>

			<section className="py-20" id="entry">
				<div className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-9 lg:grid-cols-2">
					<div className="border border-[#061a3d]/12 bg-white p-8">
						<h2 className=" text-4xl text-[#061a3d]">
							Entry Information
						</h2>
						<p className="mt-4 text-[#6a7280]">
							Eligible students may submit original
							two-dimensional or digital artwork. Final rules,
							dates, awards, fees, and juror information should be
							confirmed before launch.
						</p>
					</div>
					<form
						onSubmit={handleSubmit}
						className="grid gap-4 border border-[#d6ad58]/12 bg-[#061a3d] p-8"
					>
						<h2 className=" text-4xl text-[#d6ad58]">
							Register Interest
						</h2>
						<input
							required
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="Student name"
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
						<select
							required
							value={grade}
							onChange={(event) => setGrade(event.target.value)}
							className="border border-[#d6ad58]/50 px-4 py-3 outline-none focus:border-[#d6ad58] text-[#fff] placeholder:text-[#fff]/70"
						>
							<option
								value=""
								className="bg-[#061a3d] text-white"
							>
								Select grade
							</option>
							<option className="bg-[#061a3d] text-white">
								9
							</option>
							<option className="bg-[#061a3d] text-white">
								10
							</option>
							<option className="bg-[#061a3d] text-white">
								11
							</option>
							<option className="bg-[#061a3d] text-white">
								12
							</option>
						</select>
						<textarea
							value={message}
							onChange={(event) => setMessage(event.target.value)}
							placeholder="Tell us about your artwork or question"
							className="min-h-36 resize-y border border-[#d6ad58]/50 px-4 py-3 outline-none focus:border-[#d6ad58] text-[#fff] placeholder:text-[#fff]/70"
						/>
						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex items-center justify-center bg-[#d6ad58] px-6 py-4 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39] disabled:cursor-not-allowed disabled:opacity-70"
						>
							{isSubmitting ? "Submitting..." : "Submit"}
						</button>
					</form>
				</div>
			</section>
		</main>
	);
}
