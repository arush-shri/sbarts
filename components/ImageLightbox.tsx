"use client";

import { PaintingType } from "@/app/_lib/customTypes";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

type ImageLightboxProps = {
	src: string;
	alt: string;
	open: boolean;
	onClose: () => void;
	painting?: PaintingType;
};

export default function ImageLightbox({
	src,
	alt,
	open,
	onClose,
	painting,
}: ImageLightboxProps) {
	useEffect(() => {
		if (!open) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		// Prevent background page from scrolling
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center overflow-y-auto bg-black/90 p-4 md:p-8"
			onClick={onClose}
		>
			{/* Close button */}
			<button
				type="button"
				onClick={onClose}
				className="absolute right-5 top-5 z-10 grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
				aria-label="Close image"
			>
				<X className="h-6 w-6" />
			</button>

			<div
				className="grid max-h-[calc(100dvh-2rem)] w-[min(1180px,95vw)] overflow-y-auto bg-[#f7f1e6] md:max-h-[calc(100dvh-4rem)] md:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="relative min-h-[55vh] bg-[#061a3d] md:min-h-[calc(100dvh-4rem)]">
					<Image
						src={src}
						alt={alt}
						fill
						sizes="(max-width: 768px) 95vw, 65vw"
						className="object-contain p-5 md:p-10"
						priority
					/>
				</div>

				{painting ? (
					<aside className="flex flex-col gap-6 overflow-y-auto p-6 text-[#182033] md:p-8">
						<div>
							<p className="text-xs font-bold uppercase tracking-[.2em] text-[#b88d39]">
								{painting.category}
							</p>
							<h2 className="mt-2 text-3xl leading-tight text-[#061a3d]">
								{painting.title}
							</h2>
							<p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#6a7280]">
								{painting.description}
							</p>
						</div>

						{painting.keywords?.length ? (
							<div className="flex flex-wrap gap-2">
								{painting.keywords.map((keyword) => (
									<span
										key={keyword}
										className="bg-white px-3 py-2 text-xs font-medium text-[#6a7280]"
									>
										{keyword}
									</span>
								))}
							</div>
						) : null}
					</aside>
				) : null}
			</div>
		</div>
	);
}
