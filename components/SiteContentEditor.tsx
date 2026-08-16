"use client";

import { useSiteContent } from "@/app/_context/SiteContentContext";
import {
	SITE_CONTENT_EXTRA_FIELDS,
	SitePageKey,
} from "@/app/_lib/siteContent";
import { Save, X } from "lucide-react";
import { FormEvent, useState } from "react";

type SiteContentEditorProps = {
	pageKey: SitePageKey | null;
	open: boolean;
	onClose: () => void;
};

export default function SiteContentEditor({
	pageKey,
	open,
	onClose,
}: SiteContentEditorProps) {
	const { getPageContent, updatePageContent } = useSiteContent();
	const [saving, setSaving] = useState(false);

	if (!open || !pageKey) return null;

	const content = getPageContent(pageKey);
	const extraFields = SITE_CONTENT_EXTRA_FIELDS[pageKey] || [];

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
									{field.type === "textarea" ? (
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
