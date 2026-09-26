"use client";

import { useSellerContext } from "@/app/_context/SellerContext";
import { useSiteContent } from "@/app/_context/SiteContentContext";
import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import PageIntro from "@/components/PageIntro";
import Poster from "@/components/Poster";
import { ShowToast } from "@/components/Toaster";
import { Edit3, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { CompetitionEntry } from "../_lib/customTypes";

type CompetitionForm = Pick<
	CompetitionEntry,
	| "title"
	| "entriesOpen"
	| "finalDeadline"
	| "winnersAnnouncement"
	| "exhibitionOpen"
	| "status"
>;

const emptyCompetitionForm: CompetitionForm = {
	title: "SB Arts International Juried Competition",
	entriesOpen: "",
	finalDeadline: "",
	winnersAnnouncement: "",
	exhibitionOpen: "",
	status: "registration open",
};

function toDateInputValue(value: string) {
	const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
	return match ? `${match[3]}-${match[2]}-${match[1]}` : value;
}

function toStoredDateValue(value: string) {
	const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

export default function CompetitionPage() {
	const { getPageContent } = useSiteContent();
	const {
		artistData,
		authenticated,
		loading: sellerLoading,
	} = useSellerContext();
	const content = getPageContent("competition");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [grade, setGrade] = useState("");
	const [message, setMessage] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [competition, setCompetition] = useState<CompetitionEntry | null>(
		null,
	);
	const [compLoading, setCompLoading] = useState(true);
	const [editorOpen, setEditorOpen] = useState(false);
	const [savingCompetition, setSavingCompetition] = useState(false);
	const [competitionForm, setCompetitionForm] =
		useState<CompetitionForm>(emptyCompetitionForm);
	const isAdmin =
		authenticated &&
		!sellerLoading &&
		(artistData?.admin === true || artistData?.isAdmin === true);

	useEffect(() => {
		const loadCompetition = async () => {
			try {
				const res = await fetch("/api/competition");
				const json = await res.json();
				if (res.ok && json.data) {
					setCompetition(json.data);
					setCompetitionForm({
						title: json.data.title || emptyCompetitionForm.title,
						entriesOpen: toDateInputValue(json.data.entriesOpen || ""),
						finalDeadline: toDateInputValue(json.data.finalDeadline || ""),
						winnersAnnouncement:
							toDateInputValue(json.data.winnersAnnouncement || ""),
						exhibitionOpen: toDateInputValue(
							json.data.exhibitionOpen || "",
						),
						status: json.data.status || emptyCompetitionForm.status,
					});
				}
			} catch (error) {
				console.error(error);
			} finally {
				setCompLoading(false);
			}
		};

		loadCompetition();
	}, []);

	useEffect(() => {
		if (isAdmin && !compLoading && !competition) setEditorOpen(true);
	}, [compLoading, competition, isAdmin]);

	const startCompetitionEdit = () => {
		if (competition) {
			setCompetitionForm({
				title: competition.title,
				entriesOpen: toDateInputValue(competition.entriesOpen),
				finalDeadline: toDateInputValue(competition.finalDeadline),
				winnersAnnouncement: toDateInputValue(
					competition.winnersAnnouncement,
				),
				exhibitionOpen: toDateInputValue(competition.exhibitionOpen),
				status: competition.status,
			});
		}
		setEditorOpen(true);
	};

	const handleCompetitionSave = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSavingCompetition(true);

		try {
			const currentUser = firebaseClientAuth.currentUser;
			if (!currentUser) {
				ShowToast("Please sign in again to manage the competition.", 1);
				return;
			}

			const token = await currentUser.getIdToken();
			const res = await fetch("/api/competition", {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...competitionForm,
					entriesOpen: toStoredDateValue(competitionForm.entriesOpen),
					finalDeadline: toStoredDateValue(competitionForm.finalDeadline),
					winnersAnnouncement: toStoredDateValue(
						competitionForm.winnersAnnouncement,
					),
					exhibitionOpen: toStoredDateValue(
						competitionForm.exhibitionOpen,
					),
					...(competition?.id ? { id: competition.id } : {}),
				}),
			});
			const json = await res.json();

			if (!res.ok) {
				ShowToast(json.error || "Unable to save competition.", 1);
				return;
			}

			setCompetition(json.data);
			setEditorOpen(false);
			ShowToast("Competition timeline saved.", 2);
		} catch (error) {
			console.error(error);
			ShowToast("Unable to save competition.", 0);
		} finally {
			setSavingCompetition(false);
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);

		try {
			const formData = new FormData();
			formData.append("name", name);
			formData.append("email", email);
			formData.append("subject", "Competition Registration");
			formData.append(
				"message",
				`Grade: ${grade}\n\n${message || "Please send entry information."}`,
			);
			if (selectedFile) {
				formData.append("attachment", selectedFile);
			}

			const res = await fetch("/api/inquiry", {
				method: "POST",
				body: formData,
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
			setSelectedFile(null);
			if (event.currentTarget) {
				event.currentTarget.reset();
			}
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
					<PageIntro
						pageKey="competition"
						titleClassName="heading-font max-w-full break-words font-bold text-3xl leading-tight uppercase tracking-[.12em] text-[#d6ad58] sm:text-5xl sm:tracking-[.22em]"
						subtitleClassName="mt-2 max-w-4xl text-2xl italic md:text-3xl heading-font leading-tight text-[#d6ad58]"
						subtextClassName="mt-4 max-w-3xl text-lg text-white/75"
					/>
					<a
						href="#entry"
						className="mt-8 inline-flex items-center justify-center bg-[#d6ad58] px-6 py-4 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39]"
					>
						Enter Now
					</a>
				</div>
			</section>

			<Poster />

			<section className="py-10">
				<div className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-6 md:grid-cols-3">
					{[
						[
							content.fields?.card1Title || "International",
							content.fields?.card1Subtitle ||
								"Open to high school students worldwide.",
						],
						[
							content.fields?.card2Title || "Juried",
							content.fields?.card2Subtitle ||
								"Reviewed by distinguished artists and arts professionals.",
						],
						[
							content.fields?.card3Title || "Theme",
							content.fields?.card3Subtitle ||
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
						<div className="flex items-center gap-4 md:text-right">
							<div className="text-sm uppercase tracking-[.12em] text-[#6a7280]">
								{/* {compLoading
									? "Loading status..."
									: competition?.status || "Status pending"} */}
							</div>
							{isAdmin ? (
								<button
									type="button"
									onClick={startCompetitionEdit}
									className="inline-flex items-center gap-2 border border-[#061a3d]/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:border-[#d6ad58] hover:text-[#b88d39]"
								>
									<Edit3 className="h-4 w-4" />
									Edit timeline
								</button>
							) : null}
						</div>
					</div>

					{isAdmin && editorOpen ? (
						<form
							onSubmit={handleCompetitionSave}
							className="mb-6 grid gap-4 border border-[#d6ad58] bg-white p-6 md:grid-cols-2 xl:grid-cols-3"
						>
							<div className="md:col-span-2 xl:col-span-3 flex items-start justify-between gap-4">
								<div>
									<h3 className="text-2xl text-[#061a3d]">
										{competition
											? "Edit competition"
											: "Set up competition"}
									</h3>
									<p className="mt-1 text-sm text-[#6a7280]">
										Update the public competition title,
										status, and timeline.
									</p>
								</div>
								{competition ? (
									<button
										type="button"
										onClick={() => setEditorOpen(false)}
										className="grid h-9 w-9 place-items-center text-[#6a7280] transition hover:text-[#061a3d]"
										aria-label="Close competition editor"
									>
										<X className="h-5 w-5" />
									</button>
								) : null}
							</div>
							<input
								required
								value={competitionForm.title}
								onChange={(event) =>
									setCompetitionForm({
										...competitionForm,
										title: event.target.value,
									})
								}
								placeholder="Competition title"
								className="border border-[#061a3d]/15 bg-[#fdfaf4] px-3 py-2.5 text-sm outline-none placeholder:text-[#6a7280] focus:border-[#d6ad58] md:col-span-2 xl:col-span-3"
							/>
							{(
								[
									["entriesOpen", "Entries Open"],
									["finalDeadline", "Final Deadline"],
									[
										"winnersAnnouncement",
										"Winners Announcement",
									],
									["exhibitionOpen", "Exhibition Open"],
								] as const
							).map(([field, label]) => (
								<label
									key={field}
									className="grid gap-1 text-xs font-bold uppercase tracking-[.08em] text-[#6a7280]"
								>
									{label}
									<input
										type="date"
										required
										value={competitionForm[field]}
										onChange={(event) =>
											setCompetitionForm({
												...competitionForm,
												[field]: event.target.value,
											})
										}
										className="border border-[#061a3d]/15 bg-[#fdfaf4] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#182033] outline-none placeholder:text-[#6a7280] focus:border-[#d6ad58]"
									/>
								</label>
							))}
							<label className="grid gap-1 text-xs font-bold uppercase tracking-[.08em] text-[#6a7280]">
								Status
								<select
									value={competitionForm.status}
									onChange={(event) =>
										setCompetitionForm({
											...competitionForm,
											status: event.target.value,
										})
									}
									className="border border-[#061a3d]/15 bg-[#fdfaf4] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#182033] outline-none focus:border-[#d6ad58]"
								>
									<option value="registration open">
										Registration open
									</option>
									<option value="registration closed">
										Registration closed
									</option>
									<option value="winner announced">
										Winner announced
									</option>
									<option value="exhibition open">
										Exhibition open
									</option>
								</select>
							</label>
							<div className="flex items-end gap-3 md:col-span-2 xl:col-span-3">
								<button
									type="submit"
									disabled={savingCompetition}
									className="bg-[#061a3d] px-5 py-3 text-sm font-bold uppercase tracking-[.06em] text-white transition hover:bg-[#0b2b63] disabled:cursor-not-allowed disabled:opacity-60"
								>
									{savingCompetition
										? "Saving..."
										: "Save timeline"}
								</button>
								{competition ? (
									<button
										type="button"
										onClick={() => setEditorOpen(false)}
										className="border border-[#061a3d]/15 px-5 py-3 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:border-[#d6ad58]"
									>
										Cancel
									</button>
								) : null}
							</div>
						</form>
					) : null}

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
					<div className="relative min-h-[420px] overflow-hidden border border-[#d6ad58] bg-[#0c2a62]">
						<img
							src={content.fields?.featureImage || "/images/hope.png"}
							alt="Competition feature"
							className="absolute inset-0 h-full w-full object-cover"
						/>
					</div>
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
						<label className="grid gap-2 text-sm font-semibold text-[#f7f1e6]">
							Upload artwork image (optional)
							<input
								type="file"
								accept="image/*"
								onChange={(event) =>
									setSelectedFile(
										event.target.files?.[0] || null,
									)
								}
								className="block w-full cursor-pointer border border-[#d6ad58]/50 bg-[#061a3d] px-4 py-3 text-sm text-[#fff] file:mr-3 file:rounded-none file:border file:border-[#d6ad58] file:bg-[#d6ad58] file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[.06em] file:text-[#061a3d]"
							/>
							{selectedFile ? (
								<p className="text-xs text-[#d6ad58]">
									Selected: {selectedFile.name}
								</p>
							) : null}
						</label>
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
