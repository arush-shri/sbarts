"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

type ImageLightboxProps = {
	src: string;
	alt: string;
	open: boolean;
	onClose: () => void;
};

export default function ImageLightbox({
	src,
	alt,
	open,
	onClose,
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
			className="fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center bg-black/90 p-4"
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

			{/* Image container */}
			<div
				className="relative h-[90vh] w-[95vw]"
				onClick={(event) => event.stopPropagation()}
			>
				<Image
					src={src}
					alt={alt}
					fill
					sizes="95vw"
					className="object-contain"
					priority
				/>
			</div>
		</div>
	);
}
