"use client";

import { useSiteContent } from "@/app/_context/SiteContentContext";
import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import {
	SITE_CONTENT_EXTRA_FIELDS,
	SiteHeroSlide,
	SitePageKey,
} from "@/app/_lib/siteContent";
import { ArrowDown, ArrowUp, Plus, Save, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { ShowToast } from "@/components/Toaster";

type SiteContentEditorProps = {
	pageKey: SitePageKey | null;
	open: boolean;
	onClose: () => void;
};

type SlideshowFieldProps = {
	initialValue: string;
	onUpload: (file: File, previousUrl: string) => Promise<string | null>;
};

function parseSlides(value: string): SiteHeroSlide[] {
	try {
		const parsed = JSON.parse(value);
		if (!Array.isArray(parsed)) return [];
		return parsed.map((slide) => ({
			title: typeof slide?.title === "string" ? slide.title : "",
			copy: typeof slide?.copy === "string" ? slide.copy : "",
			image: typeof slide?.image === "string" ? slide.image : "",
		}));
	} catch {
		return [];
	}
}

function SlideshowField({ initialValue, onUpload }: SlideshowFieldProps) {
	const [slides, setSlides] = useState(() => parseSlides(initialValue));
	const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

	const updateSlide = (index: number, changes: Partial<SiteHeroSlide>) => {
		setSlides((current) =>
			current.map((slide, slideIndex) =>
				slideIndex === index ? { ...slide, ...changes } : slide,
			),
		);
	};

	const moveSlide = (index: number, direction: -1 | 1) => {
		const targetIndex = index + direction;
		if (targetIndex < 0 || targetIndex >= slides.length) return;
		setSlides((current) => {
			const next = [...current];
			const target = next[index + direction];
			next[index + direction] = next[index];
			next[index] = target;
			return next;
		});
	};

	return (
		<div className="grid gap-4">
			<input
				type="hidden"
				name="fields.heroSlides"
				value={JSON.stringify(slides)}
			/>
			{slides.map((slide, index) => (
				<div
					key={`${index}-${slide.image}`}
					className="grid gap-3 border border-[#061a3d]/15 bg-white p-4"
				>
					<div className="flex items-center justify-between gap-3">
						<strong className="text-sm text-[#061a3d]">
							Slide {index + 1}
						</strong>
						<div className="flex gap-1">
							<button
								type="button"
								disabled={index === 0}
								onClick={() => moveSlide(index, -1)}
								className="grid h-8 w-8 place-items-center border border-[#061a3d]/15 disabled:opacity-30"
								aria-label={`Move slide ${index + 1} up`}
								title="Move up"
							>
								<ArrowUp className="h-4 w-4" />
							</button>
							<button
								type="button"
								disabled={index === slides.length - 1}
								onClick={() => moveSlide(index, 1)}
								className="grid h-8 w-8 place-items-center border border-[#061a3d]/15 disabled:opacity-30"
								aria-label={`Move slide ${index + 1} down`}
								title="Move down"
							>
								<ArrowDown className="h-4 w-4" />
							</button>
							<button
								type="button"
								onClick={() => setSlides((current) => current.filter((_, slideIndex) => slideIndex !== index))}
								className="grid h-8 w-8 place-items-center border border-red-200 text-red-700"
								aria-label={`Remove slide ${index + 1}`}
								title="Remove slide"
							>
								<Trash2 className="h-4 w-4" />
							</button>
						</div>
					</div>
					<div className="grid gap-3 sm:grid-cols-2">
						<input
							value={slide.title}
							onChange={(event) => updateSlide(index, { title: event.target.value })}
							placeholder="Slide title"
							className="border border-[#061a3d]/20 px-3 py-2 font-normal outline-none focus:border-[#d6ad58]"
						/>
						<input
							value={slide.copy}
							onChange={(event) => updateSlide(index, { copy: event.target.value })}
							placeholder="Slide description"
							className="border border-[#061a3d]/20 px-3 py-2 font-normal outline-none focus:border-[#d6ad58]"
						/>
					</div>
					{slide.image ? (
						<img src={slide.image} alt="" className="h-32 w-full object-cover" />
					) : (
						<div className="grid h-32 place-items-center bg-[#061a3d]/5 text-sm text-[#6a7280]">
							Upload an image for this slide
						</div>
					)}
					<label className="inline-flex w-fit cursor-pointer border border-[#061a3d]/20 px-4 py-3 text-xs font-bold uppercase tracking-[.06em] text-[#061a3d] hover:border-[#d6ad58]">
						{uploadingIndex === index ? "Uploading..." : "Change image"}
						<input
							type="file"
							accept="image/*"
							hidden
							disabled={uploadingIndex !== null}
							onChange={async (event) => {
								const file = event.target.files?.[0];
								if (!file) return;
								setUploadingIndex(index);
								const image = await onUpload(file, slide.image);
								if (image) updateSlide(index, { image });
								setUploadingIndex(null);
							}}
						/>
					</label>
				</div>
			))}
			<button
				type="button"
				onClick={() => setSlides((current) => [...current, { title: "", copy: "", image: "" }])}
				className="inline-flex w-fit items-center gap-2 border border-[#061a3d]/20 px-4 py-3 text-xs font-bold uppercase tracking-[.06em] text-[#061a3d] hover:border-[#d6ad58]"
			>
				<Plus className="h-4 w-4" />
				Add slide
			</button>
		</div>
	);
}

export default function SiteContentEditor({
	pageKey,
	open,
	onClose,
}: SiteContentEditorProps) {
	const { getPageContent, updatePageContent } = useSiteContent();
	const [saving, setSaving] = useState(false);
	const [uploadingField, setUploadingField] = useState<string | null>(null);

	if (!open || !pageKey) return null;

	const content = getPageContent(pageKey);
	const extraFields = SITE_CONTENT_EXTRA_FIELDS[pageKey] || [];

	const uploadImage = async (
		fieldKey: string,
		file: File,
		previousUrl?: string,
	): Promise<string | null> => {
		if (!file.type.startsWith("image/")) {
			ShowToast("Please choose an image file.", 1);
			return null;
		}
		const user = firebaseClientAuth.currentUser;
		if (!user) {
			ShowToast("Please sign in again to upload images.", 1);
			return null;
		}

		setUploadingField(fieldKey);
		try {
			const token = await user.getIdToken();
			const uploadData = new FormData();
			uploadData.append("file", file);
			const currentInput = document.querySelector<HTMLInputElement>(
				`input[data-image-field="${fieldKey}"]`,
			);
			const previousImageUrl = previousUrl || currentInput?.value;
			if (previousImageUrl) {
				uploadData.append("previousUrl", previousImageUrl);
			}
			const response = await fetch("/api/site-content/upload", {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` },
				body: uploadData,
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "Image upload failed.");
			const input = currentInput;
			if (input) input.value = result.url;
			const preview = document.querySelector<HTMLImageElement>(
				`img[data-image-preview="${fieldKey}"]`,
			);
			if (preview) preview.src = result.url;
			ShowToast("Image uploaded. Save the page to publish it.", 2);
			return result.url;
		} catch (error) {
			ShowToast(
				error instanceof Error ? error.message : "Image upload failed.",
				0,
			);
			return null;
		} finally {
			setUploadingField(null);
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		const formData = new FormData(event.currentTarget);
		const fields = extraFields.reduce<Record<string, string>>(
			(nextFields, field) => {
				nextFields[field.key] = String(
					formData.get(`fields.${field.key}`) || "",
				);
				return nextFields;
			},
			{},
		);

		const saved = await updatePageContent(pageKey, {
			title: String(formData.get("title") || ""),
			subtitle: String(formData.get("subtitle") || ""),
			subtext: String(formData.get("subtext") || ""),
			fields: {
				...(content.fields || {}),
				...fields,
			},
		});

		setSaving(false);
		if (saved) onClose();
	};

	return (
		<div className="fixed left-0 top-0 z-[9999] flex h-screen w-screen items-center justify-center bg-[#061a3d]/75 px-5 py-8">
			<form
				key={`${pageKey}-${content.title}-${content.subtitle}-${content.subtext}-${JSON.stringify(content.fields || {})}`}
				onSubmit={handleSubmit}
				className="max-h-[calc(100vh-48px)] w-full max-w-2xl overflow-y-auto border border-[#d6ad58]/40 bg-[#f7f1e6] p-6 text-[#182033] shadow-[0_30px_90px_rgba(0,0,0,.35)]"
			>
				<div className="mb-5 flex items-start justify-between gap-4">
					<div>
						<h2 className="heading-font text-3xl font-bold text-[#061a3d]">
							Edit page text
						</h2>
						<p className="mt-1 text-sm text-[#6a7280]">
							Changes publish immediately and refresh the site
							cache.
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="grid h-10 w-10 place-items-center border border-[#061a3d]/15 text-[#061a3d] transition hover:border-[#d6ad58]"
						aria-label="Close editor"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<label className="grid gap-2 text-sm font-semibold text-[#061a3d]">
					Title
					<input
						name="title"
						required
						defaultValue={content.title}
						maxLength={600}
						className="border border-[#061a3d]/20 bg-white px-4 py-3 font-normal outline-none focus:border-[#d6ad58]"
					/>
				</label>

				<label className="mt-4 grid gap-2 text-sm font-semibold text-[#061a3d]">
					Subtitle
					<textarea
						name="subtitle"
						defaultValue={content.subtitle}
						maxLength={600}
						rows={3}
						className="resize-y border border-[#061a3d]/20 bg-white px-4 py-3 font-normal outline-none focus:border-[#d6ad58]"
					/>
				</label>

				<label className="mt-4 grid gap-2 text-sm font-semibold text-[#061a3d]">
					Subtext
					<textarea
						name="subtext"
						defaultValue={content.subtext}
						maxLength={600}
						rows={4}
						className="resize-y border border-[#061a3d]/20 bg-white px-4 py-3 font-normal outline-none focus:border-[#d6ad58]"
					/>
				</label>

				{extraFields.length ? (
					<div className="mt-6 border-t border-[#061a3d]/15 pt-5">
						<h3 className="heading-font text-2xl font-semibold text-[#061a3d]">
							Page details
						</h3>
						<div className="mt-4 grid gap-4">
							{extraFields.map((field) => (
								<label
									key={field.key}
									className="grid gap-2 text-sm font-semibold text-[#061a3d]"
								>
									{field.label}
									{field.type === "image-list" ? (
										<SlideshowField
											initialValue={content.fields?.[field.key] || "[]"}
											onUpload={(file, previousUrl) =>
												uploadImage(field.key, file, previousUrl)
											}
										/>
									) : field.type === "image" ? (
										<div className="grid gap-3">
											<input
												name={`fields.${field.key}`}
												data-image-field={field.key}
												defaultValue={content.fields?.[field.key] || ""}
												className="border border-[#061a3d]/20 bg-white px-4 py-3 font-normal outline-none focus:border-[#d6ad58]"
											/>
											<label className="inline-flex w-fit cursor-pointer items-center border border-[#061a3d]/20 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[.06em] text-[#061a3d] hover:border-[#d6ad58]">
												{uploadingField === field.key ? "Uploading..." : "Upload image"}
												<input
													type="file"
													accept="image/*"
													hidden
													disabled={uploadingField !== null}
													onChange={(event) => {
														const file = event.target.files?.[0];
														if (file) void uploadImage(field.key, file);
													}}
												/>
											</label>
											<img
												data-image-preview={field.key}
												src={content.fields?.[field.key] || ""}
												alt=""
												className="h-40 w-full object-cover"
											/>
										</div>
									) : field.type === "textarea" ? (
										<textarea
											name={`fields.${field.key}`}
											defaultValue={
												content.fields?.[field.key] || ""
											}
											maxLength={600}
											rows={field.rows || 3}
											className="resize-y border border-[#061a3d]/20 bg-white px-4 py-3 font-normal outline-none focus:border-[#d6ad58]"
										/>
									) : (
										<input
											name={`fields.${field.key}`}
											type={field.type || "text"}
											defaultValue={
												content.fields?.[field.key] || ""
											}
											maxLength={600}
											className="border border-[#061a3d]/20 bg-white px-4 py-3 font-normal outline-none focus:border-[#d6ad58]"
										/>
									)}
								</label>
							))}
						</div>
					</div>
				) : null}

				<div className="mt-6 flex justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						className="border border-[#061a3d]/20 px-5 py-3 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:border-[#d6ad58]"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={saving}
						className="inline-flex items-center justify-center gap-2 bg-[#d6ad58] px-5 py-3 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39] disabled:cursor-not-allowed disabled:opacity-70"
					>
						<Save className="h-4 w-4" />
						{saving ? "Saving..." : "Save"}
					</button>
				</div>
			</form>
		</div>
	);
}
