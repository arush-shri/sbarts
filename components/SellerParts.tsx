"use client";

import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { CompetitionManagerRef, PaintingType } from "@/app/_lib/customTypes";
import { convertNumToDate, imageUrlGenerator } from "@/app/_lib/dataProcessing";
import { validateImageFile } from "@/app/_lib/validation";
import { Edit2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
	forwardRef,
	ReactElement,
	RefObject,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { ShowToast } from "./Toaster";

export function ListingsTable({
	artworkIds,
}: {
	artworkIds: string[];
}): ReactElement {
	const [displayedArtworks, setDisplayedArtworks] = useState<PaintingType[]>(
		[],
	);
	const router = useRouter();

	const loadData = async () => {
		const res = await fetch("/api/painting", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ids: artworkIds }),
		});

		if (!res.ok) return null;

		const json = await res.json();

		const art: PaintingType[] = json.data;
		setDisplayedArtworks(art);
	};

	const deleteListing = async (paintingId: string) => {
		try {
			const currentUser = firebaseClientAuth.currentUser;

			if (!currentUser) {
				console.error("No authenticated user found.");
				return false;
			}

			// 1. Grab the fresh authorization token from Firebase client
			const token = await currentUser.getIdToken();

			// 2. Send the delete request appending the ID parameter to the URL query string
			const res = await fetch(`/api/listing?id=${paintingId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				const errorData = await res.json();
				ShowToast("Unable to delete listing", 0);
			}

			setDisplayedArtworks((prev) =>
				prev.filter((art) => art.id !== paintingId),
			);
			ShowToast("Listing deleted successfully", 2);
		} catch (error) {
			console.error(
				"Network or internal error triggered during deletion request:",
				error,
			);
			ShowToast("Unable to delete listing", 0);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	return (
		<div>
			<div className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h3 className="font-serif text-2xl text-[#061a3d]">
						Your Listings
					</h3>
					<p className="mt-1 text-sm text-[#6a7280]">
						Keep your gallery visible and current for buyers.
					</p>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-left">
					<thead>
						<tr className="border-y border-[#061a3d]/10 bg-[#f7f1e6] text-[11px] font-bold uppercase tracking-[.18em] text-[#b88d39]">
							<th className="px-6 py-4">Item</th>
							<th className="px-6 py-4">Listed On</th>
							<th className="px-6 py-4">Updated On</th>
							<th className="px-6 py-4 text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[#061a3d]/10">
						{displayedArtworks.length > 0 ? (
							displayedArtworks.map((item) => (
								<ItemRow
									key={item.id}
									item={item}
									deleteListing={deleteListing}
								/>
							))
						) : (
							<tr>
								<td
									colSpan={4}
									className="px-6 py-10 text-center text-sm text-[#6a7280]"
								>
									No listings yet. Create your first artwork
									listing to get started.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export function StatsCards({
	totalSale,
	itemSold,
	totalListing,
}: {
	totalSale: number;
	itemSold: number;
	totalListing: number;
}): ReactElement {
	const stats = [
		{ label: "Total Sales", value: totalSale },
		{ label: "Active Listings", value: totalListing },
		{ label: "Items Sold", value: itemSold },
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{stats.map((stat) => (
				<div
					key={stat.label}
					className="bg-[#F0F7FF] border border-[#0000001A] p-8 rounded-2xl"
				>
					<p className="text-[#98A0AB] text-sm font-semibold mb-2">
						{stat.label}
					</p>
					<p className="text-3xl font-bold text-[#0F1724]">
						{stat.value}
					</p>
				</div>
			))}
		</div>
	);
}

export function CompetitionButton({
	managerRef,
}: {
	managerRef: RefObject<CompetitionManagerRef | null>;
}): ReactElement {
	const [open, setOpen] = useState(false);

	const handleForm = () => {
		const nextOpen = !open;

		setOpen(nextOpen);
		managerRef.current?.open(nextOpen);
	};
	return (
		<button
			type="button"
			onClick={handleForm}
			className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d6ad58] px-3 py-2 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39]"
		>
			<Plus className="h-auto w-5" /> New Competition
		</button>
	);
}

export const CompetitionManager = forwardRef<CompetitionManagerRef, object>(
	(props, ref): ReactElement => {
		const [competitions, setCompetitions] = useState<any[]>([]);
		const [loading, setLoading] = useState(true);
		const [editingId, setEditingId] = useState<string | null>(null);
		const [form, setForm] = useState({
			title: "",
			entriesOpen: "",
			finalDeadline: "",
			winnersAnnouncement: "",
			exhibitionOpen: "",
			status: "registration open",
		});
		const [openForm, setOpenForm] = useState<boolean>(false);

		const loadCompetitions = async () => {
			try {
				const currentUser = firebaseClientAuth.currentUser;
				if (!currentUser) return;

				const token = await currentUser.getIdToken();
				const res = await fetch("/api/competition/seller", {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) return;
				const json = await res.json();
				setCompetitions(json.data || []);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		useEffect(() => {
			loadCompetitions();
		}, []);

		const resetForm = () => {
			setOpenForm(false);
			setForm({
				title: "",
				entriesOpen: "",
				finalDeadline: "",
				winnersAnnouncement: "",
				exhibitionOpen: "",
				status: "registration open",
			});
			setEditingId(null);
		};

		const handleSubmit = async (event: React.FormEvent) => {
			event.preventDefault();

			try {
				const currentUser = firebaseClientAuth.currentUser;
				if (!currentUser) {
					ShowToast("Please sign in again to manage competitions", 1);
					return;
				}

				if (!isValidFutureDate(form.entriesOpen)) {
					alert("Entries Open must be a valid future date.");
					return;
				}

				if (!isValidFutureDate(form.finalDeadline)) {
					alert("Final Deadline must be a valid future date.");
					return;
				}

				if (!isValidFutureDate(form.winnersAnnouncement)) {
					alert("Winners Announcement must be a valid future date.");
					return;
				}

				if (!isValidFutureDate(form.exhibitionOpen)) {
					alert("Exhibition Open must be a valid future date.");
					return;
				}

				const token = await currentUser.getIdToken();
				const payload = {
					...form,
				};

				const res = await fetch("/api/competition/seller", {
					method: editingId ? "PUT" : "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(
						editingId ? { ...payload, id: editingId } : payload,
					),
				});

				const json = await res.json();
				if (!res.ok) {
					ShowToast(json.error || "Unable to save competition", 1);
					return;
				}

				ShowToast(
					editingId ? "Competition updated" : "Competition created",
					2,
				);
				resetForm();
				loadCompetitions();
			} catch (error) {
				console.error(error);
				ShowToast("Unable to save competition", 1);
			}
		};

		const startEdit = (competition: any) => {
			setEditingId(competition.id);
			setForm({
				title: competition.title || "",
				entriesOpen: String(competition.entriesOpen || ""),
				finalDeadline: String(competition.finalDeadline || ""),
				winnersAnnouncement: String(
					competition.winnersAnnouncement || "",
				),
				exhibitionOpen: String(competition.exhibitionOpen || ""),
				status: competition.status || "registration open",
			});
			setOpenForm(true);
		};

		const isValidFutureDate = (dateStr: string) => {
			const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

			if (!match) return false;

			const [, day, month, year] = match;

			const date = new Date(Number(year), Number(month) - 1, Number(day));

			// Ensure date wasn't auto-corrected (e.g. 31/02/2026)
			if (
				date.getFullYear() !== Number(year) ||
				date.getMonth() !== Number(month) - 1 ||
				date.getDate() !== Number(day)
			) {
				return false;
			}

			// Compare only dates, not time
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			return date >= today;
		};

		useImperativeHandle(ref, () => ({
			open(toOpen: boolean) {
				setEditingId(null);
				setForm({
					title: "",
					entriesOpen: "",
					finalDeadline: "",
					winnersAnnouncement: "",
					exhibitionOpen: "",
					status: "registration open",
				});
				setOpenForm(toOpen);
			},
		}));

		return (
			<div className="rounded-[28px] border border-[#061a3d]/12 bg-white shadow-[0_18px_50px_rgba(6,26,61,.08)]">
				<div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
					<div>
						<h3 className="font-serif text-2xl text-[#061a3d]">
							Competition{""}
							{openForm
								? editingId
									? " Management"
									: " Creation"
								: "s"}
						</h3>

						<p className="mt-1 text-sm text-[#6a7280]">
							{openForm
								? editingId
									? "Update timelines, titles, and status of competition."
									: "Create new competition"
								: "All competitions you've created so far."}
						</p>
					</div>
				</div>

				{openForm && (
					<form
						onSubmit={handleSubmit}
						className="mb-4 px-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
					>
						<input
							required
							value={form.title}
							onChange={(event) =>
								setForm({ ...form, title: event.target.value })
							}
							placeholder="Competition title"
							className="rounded-2xl border border-[#061a3d]/15 bg-[#fdfaf4] px-3 py-2.5 text-sm text-[#182033] outline-none placeholder:text-[#6a7280] focus:border-[#d6ad58] focus:ring-2 focus:ring-[#d6ad58]/20"
						/>
						<input
							type="text"
							required
							value={form.entriesOpen}
							onChange={(event) =>
								setForm({
									...form,
									entriesOpen: event.target.value,
								})
							}
							placeholder="Entries Open (DD/MM/YYYY)"
							pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$"
							className="rounded-2xl border border-[#061a3d]/15 bg-[#fdfaf4] px-3 py-2.5 text-sm text-[#182033] outline-none placeholder:text-[#6a7280] focus:border-[#d6ad58] focus:ring-2 focus:ring-[#d6ad58]/20"
						/>

						<input
							type="text"
							required
							value={form.finalDeadline}
							onChange={(event) =>
								setForm({
									...form,
									finalDeadline: event.target.value,
								})
							}
							placeholder="Final Deadline (DD/MM/YYYY)"
							pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$"
							className="rounded-2xl border border-[#061a3d]/15 bg-[#fdfaf4] px-3 py-2.5 text-sm text-[#182033] outline-none placeholder:text-[#6a7280] focus:border-[#d6ad58] focus:ring-2 focus:ring-[#d6ad58]/20"
						/>

						<input
							type="text"
							required
							value={form.winnersAnnouncement}
							onChange={(event) =>
								setForm({
									...form,
									winnersAnnouncement: event.target.value,
								})
							}
							placeholder="Winners Announcement (DD/MM/YYYY)"
							pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$"
							className="rounded-2xl border border-[#061a3d]/15 bg-[#fdfaf4] px-3 py-2.5 text-sm text-[#182033] outline-none placeholder:text-[#6a7280] focus:border-[#d6ad58] focus:ring-2 focus:ring-[#d6ad58]/20"
						/>

						<input
							type="text"
							required
							value={form.exhibitionOpen}
							onChange={(event) =>
								setForm({
									...form,
									exhibitionOpen: event.target.value,
								})
							}
							placeholder="Exhibition Open (DD/MM/YYYY)"
							pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$"
							className="rounded-2xl border border-[#061a3d]/15 bg-[#fdfaf4] px-3 py-2.5 text-sm text-[#182033] outline-none placeholder:text-[#6a7280] focus:border-[#d6ad58] focus:ring-2 focus:ring-[#d6ad58]/20"
						/>
						<select
							value={form.status}
							onChange={(event) =>
								setForm({ ...form, status: event.target.value })
							}
							className="rounded-2xl border border-[#061a3d]/15 bg-[#fdfaf4] px-3 py-2.5 text-sm text-[#182033] outline-none focus:border-[#d6ad58] focus:ring-2 focus:ring-[#d6ad58]/20"
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
						<div className="md:col-span-2 xl:col-span-3">
							<button
								type="submit"
								className="rounded-full bg-[#061a3d] px-5 py-2 text-sm font-bold uppercase tracking-[.06em] text-white transition hover:bg-[#0b2b63] cursor-pointer"
							>
								{editingId ? "Save Changes" : "Create"}
							</button>
							<button
								onClick={resetForm}
								type="button"
								className="rounded-full ml-3 border-1 border-[#061a3d] px-5 py-2 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] cursor-pointer"
							>
								Cancel
							</button>
						</div>
					</form>
				)}

				<div className="overflow-x-auto">
					{loading ? (
						<div className="p-6 text-sm text-[#64748B]">
							Loading competitions...
						</div>
					) : competitions.length === 0 ? (
						<div className="p-6 text-sm text-[#64748B]">
							No competitions created yet.
						</div>
					) : (
						<table className="w-full border-collapse text-left text-sm">
							<thead>
								<tr className="border-y border-[#061a3d]/10 bg-[#f7f1e6] text-[11px] font-bold uppercase tracking-[.18em] text-[#b88d39]">
									<th className="px-6 py-3">Title</th>
									<th className="px-6 py-3">Status</th>
									<th className="px-6 py-3">Dates</th>
									<th className="px-6 py-3 text-right">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#0000000D]">
								{competitions.map((competition) => (
									<tr
										key={competition.id}
										className="transition-colors hover:bg-[#fdfaf4]"
									>
										<td className="px-6 py-3 font-semibold">
											{competition.title}
										</td>
										<td className="px-6 py-3">
											{competition.status}
										</td>
										<td className="px-6 py-3 text-[#64748B]">
											{competition.entriesOpen} →{" "}
											{competition.exhibitionOpen}
										</td>
										<td className="px-6 py-3 text-right">
											<button
												onClick={() => {
													startEdit(competition);
												}}
												className="rounded-full border border-transparent p-2 text-[#6a7280] transition-all hover:border-[#061a3d]/15 hover:bg-white hover:text-[#061a3d]"
											>
												<Edit2 className="h-auto w-4" />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		);
	},
);

export default function ArtworkUpload({
	callback,
}: {
	callback: (name: string, value: File) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [fileName, setFileName] = useState("");

	const handleClick = () => {
		inputRef.current?.click();
	};

	const validateAndProcess = async (file: File) => {
		const result = await validateImageFile(file, {
			label: "Artwork image",
			maxMb: 50,
		});

		if (!result.valid) {
			ShowToast(result.message, 1);
			return;
		}

		const img = new window.Image();
		const objectUrl = URL.createObjectURL(file);

		img.onload = () => {
			setPreview(objectUrl);
			setFileName(file.name);

			callback("uploadedFile", file);
		};

		img.src = objectUrl;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) validateAndProcess(file);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const file = e.dataTransfer.files?.[0];
		if (file) validateAndProcess(file);
	};

	return (
		<>
			<input
				ref={inputRef}
				type="file"
				accept="image/jpeg,image/png"
				className="hidden"
				onChange={handleChange}
			/>

			<div
				onClick={handleClick}
				onDragOver={(e) => e.preventDefault()}
				onDrop={handleDrop}
				className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#061a3d]/20 bg-[linear-gradient(135deg,rgba(214,173,88,.12),rgba(255,255,255,.95))] p-12 text-center transition hover:bg-[linear-gradient(135deg,rgba(214,173,88,.2),rgba(246,241,230,.95))]"
			>
				{preview ? (
					<>
						<img
							src={preview}
							alt="preview"
							className="mb-3 h-32 w-32 rounded-lg object-cover"
						/>
						<p className="font-semibold text-[#061a3d]">
							{fileName}
						</p>
						<p className="text-xs text-[#6a7280]">
							Image selected successfully
						</p>
					</>
				) : (
					<>
						<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#d6ad58] text-[#061a3d] shadow-sm">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
						</div>

						<p className="font-semibold text-[#061a3d]">
							Click to upload or drag and drop
						</p>

						<p className="mt-1 text-xs text-[#6a7280]">
							High resolution required. Max file size 50MB.
							<br />
							Recommended aspect ratios: 1:1, 4:3, or 16:9.
						</p>
					</>
				)}
			</div>
		</>
	);
}

function ItemRow({
	item,
	deleteListing,
}: {
	item: PaintingType;
	deleteListing: (paintingId: string) => Promise<false | undefined>;
}): ReactElement {
	{
		const router = useRouter();
		const [loading, setLoading] = useState(false);
		return (
			<tr
				key={item.id}
				className="group transition-colors hover:bg-[#fdfaf4]"
			>
				<td className="px-6 py-4 flex items-center gap-3">
					<Image
						src={imageUrlGenerator(item.images)}
						alt={`${item.title} image`}
						width={864}
						height={1184}
						className="object-cover rounded-lg aspect-square w-10 h-10 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0"
					/>
					<div>
						<p className="font-bold text-sm">{item.title}</p>
					</div>
				</td>
				<td className="px-6 py-4 text-sm text-[#98A0AB]">
					{convertNumToDate(item.createdAt)}
				</td>
				<td className="px-6 py-4 text-sm text-[#98A0AB]">
					{convertNumToDate(item.updatedAt)}
				</td>
				<td className="px-6 py-4 text-right">
					<div className="flex justify-end gap-2">
						<button
							onClick={() => router.push(`/editItem/${item.id}`)}
							className="rounded-full border border-transparent p-2 text-[#6a7280] transition-all hover:border-[#061a3d]/15 hover:bg-white hover:text-[#061a3d]"
						>
							<Edit2 className="h-auto w-4" />
						</button>
						<button
							onClick={async () => {
								setLoading(true);
								await deleteListing(item.id);
								setLoading(false);
							}}
							disabled={loading}
							className="rounded-full border border-transparent p-2 text-[#6a7280] transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500"
						>
							{loading ? (
								<div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
							) : (
								<Trash2 className="h-auto w-4" />
							)}
						</button>
					</div>
				</td>
			</tr>
		);
	}
}
