"use client";

import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { PaintingType, SellerType } from "@/app/_lib/customTypes";
import { thumbnailUrlGenerator } from "@/app/_lib/dataProcessing";
import { validateImageFile } from "@/app/_lib/validation";
import { signOut } from "firebase/auth";
import { Edit2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactElement, useEffect, useRef, useState } from "react";
import { ShowToast } from "./Toaster";

export function SidebarProfile({
	artistData,
}: {
	artistData: SellerType;
}): ReactElement {
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await signOut(firebaseClientAuth);
			router.replace("/signIn");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};
	return (
		<div className="flex flex-col lg:flex-row gap-4">
			<a
				href="/listing"
				className="bg-[#007AFF] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 
                            hover:bg-blue-600 transition-colors shadow-sm text-sm"
			>
				<Plus className="h-auto w-6" /> Add New Listing
			</a>
			<button
				onClick={handleLogout}
				className="px-5 py-2.5 bg-red-100 rounded-lg text-sm font-bold hover:bg-red-600
                transition-colors text-red-500 hover:text-white"
			>
				Sign Out
			</button>
		</div>
	);
}

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
			<div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
				<h3 className="font-bold text-lg">Your Listings</h3>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-[#F8F9FA] border-y border-[#0000000D] text-[#98A0AB] text-[11px] font-bold uppercase tracking-wider">
							<th className="px-6 py-4">Item</th>
							<th className="px-6 py-4">Price</th>
							<th className="px-6 py-4">Stock</th>
							{/* <th className="px-6 py-4">Status</th> */}
							<th className="px-6 py-4 text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[#0000000D]">
						{displayedArtworks.map((item) => (
							<ItemRow
								key={item.id}
								item={item}
								deleteListing={deleteListing}
							/>
						))}
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

export function CompetitionManager(): ReactElement {
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
			winnersAnnouncement: String(competition.winnersAnnouncement || ""),
			exhibitionOpen: String(competition.exhibitionOpen || ""),
			status: competition.status || "registration open",
		});
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

	return (
		<div className="rounded-2xl border border-[#0000001A] bg-white p-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h3 className="text-lg font-bold">
						Competition Management
					</h3>
					<p className="mt-1 text-sm text-[#64748B]">
						Create new competitions or update timelines, titles, and
						status.
					</p>
				</div>
				<button
					type="button"
					onClick={resetForm}
					className="inline-flex items-center gap-2 rounded-lg bg-[#0066FF] px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
				>
					<Plus className="h-4 w-4" />
					{editingId ? "Cancel Edit" : "New Competition"}
				</button>
			</div>

			<form
				onSubmit={handleSubmit}
				className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
			>
				<input
					required
					value={form.title}
					onChange={(event) =>
						setForm({ ...form, title: event.target.value })
					}
					placeholder="Competition title"
					className="rounded-lg border border-[#0000001A] px-3 py-2 text-sm outline-none focus:border-[#0066FF]"
				/>
				<input
					type="text"
					required
					value={form.entriesOpen}
					onChange={(event) =>
						setForm({ ...form, entriesOpen: event.target.value })
					}
					placeholder="Entries Open (DD/MM/YYYY)"
					pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$"
					className="rounded-lg border border-[#0000001A] px-3 py-2 text-sm outline-none focus:border-[#0066FF]"
				/>

				<input
					type="text"
					required
					value={form.finalDeadline}
					onChange={(event) =>
						setForm({ ...form, finalDeadline: event.target.value })
					}
					placeholder="Final Deadline (DD/MM/YYYY)"
					pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$"
					className="rounded-lg border border-[#0000001A] px-3 py-2 text-sm outline-none focus:border-[#0066FF]"
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
					className="rounded-lg border border-[#0000001A] px-3 py-2 text-sm outline-none focus:border-[#0066FF]"
				/>

				<input
					type="text"
					required
					value={form.exhibitionOpen}
					onChange={(event) =>
						setForm({ ...form, exhibitionOpen: event.target.value })
					}
					placeholder="Exhibition Open (DD/MM/YYYY)"
					pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$"
					className="rounded-lg border border-[#0000001A] px-3 py-2 text-sm outline-none focus:border-[#0066FF]"
				/>
				<select
					value={form.status}
					onChange={(event) =>
						setForm({ ...form, status: event.target.value })
					}
					className="rounded-lg border border-[#0000001A] px-3 py-2 text-sm outline-none focus:border-[#0066FF]"
				>
					<option value="registration open">Registration open</option>
					<option value="registration closed">
						Registration closed
					</option>
					<option value="winner announced">Winner announced</option>
					<option value="exhibition open">Exhibition open</option>
				</select>
				<div className="md:col-span-2 xl:col-span-3">
					<button
						type="submit"
						className="rounded-lg bg-[#0F1724] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#061a3d]"
					>
						{editingId ? "Save Changes" : "Create Competition"}
					</button>
				</div>
			</form>

			<div className="mt-8 overflow-x-auto">
				{loading ? (
					<div className="py-6 text-sm text-[#64748B]">
						Loading competitions...
					</div>
				) : competitions.length === 0 ? (
					<div className="py-6 text-sm text-[#64748B]">
						No competitions created yet.
					</div>
				) : (
					<table className="w-full border-collapse text-left text-sm">
						<thead>
							<tr className="border-y border-[#0000000D] bg-[#F8F9FA] text-[#98A0AB] uppercase tracking-wider">
								<th className="px-4 py-3">Title</th>
								<th className="px-4 py-3">Status</th>
								<th className="px-4 py-3">Dates</th>
								<th className="px-4 py-3 text-right">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[#0000000D]">
							{competitions.map((competition) => (
								<tr key={competition.id}>
									<td className="px-4 py-3 font-semibold">
										{competition.title}
									</td>
									<td className="px-4 py-3">
										{competition.status}
									</td>
									<td className="px-4 py-3 text-[#64748B]">
										{competition.entriesOpen} →{" "}
										{competition.exhibitionOpen}
									</td>
									<td className="px-4 py-3 text-right">
										<button
											type="button"
											onClick={() =>
												startEdit(competition)
											}
											className="inline-flex items-center gap-2 rounded-lg border border-[#0000001A] px-3 py-2 text-sm font-semibold transition hover:bg-gray-50"
										>
											<Edit2 className="h-4 w-4" /> Edit
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
}

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
			minWidth: 1920,
			minHeight: 1080,
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
				className="border-2 border-dashed border-[#0000001A] bg-[#f4f7ff] rounded-xl mt-3 p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#eef3ff] transition"
			>
				{preview ? (
					<>
						<img
							src={preview}
							alt="preview"
							className="w-32 h-32 object-cover rounded-lg mb-3"
						/>
						<p className="text-[#0F1724] font-semibold">
							{fileName}
						</p>
						<p className="text-xs text-[#98A0AB]">
							Image selected successfully
						</p>
					</>
				) : (
					<>
						<div className="w-10 h-10 mb-4 text-blue-500 bg-white rounded-full flex items-center justify-center shadow-sm">
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

						<p className="text-[#0F1724] font-semibold">
							Click to upload or drag and drop
						</p>

						<p className="text-xs text-[#98A0AB] mt-1">
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
				className="group hover:bg-gray-50 transition-colors"
			>
				<td className="px-6 py-4 flex items-center gap-3">
					<Image
						src={thumbnailUrlGenerator(item.images)}
						alt={`${item.title} image`}
						width={864}
						height={1184}
						className="object-cover rounded-lg aspect-square w-10 h-10 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0"
					/>
					<div>
						<p className="font-bold text-sm">{item.title}</p>
					</div>
				</td>
				<td className="px-6 py-4 text-sm font-medium text-[#0F1724]">
					${item.price.toFixed(2)}
				</td>
				<td className="px-6 py-4 text-sm text-[#98A0AB]">
					{item.quantity}
				</td>
				<td className="px-6 py-4 text-right">
					<div className="flex justify-end gap-2">
						<button
							onClick={() => router.push(`/editItem/${item.id}`)}
							className="p-2 hover:bg-white rounded-md border border-transparent 
                                            hover:border-[#0000001A] text-[#98A0AB] hover:text-[#0F1724] transition-all"
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
							className="p-2 hover:bg-red-50 rounded-md border border-transparent 
                                            hover:border-red-100 text-[#98A0AB] hover:text-red-500 transition-all"
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
