import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Art Gallery | Original Paintings by Shubhra",
	description:
		"Browse the SB Arts gallery of original art and paintings by Shubhra, including portrait, wildlife, design, hope, and high-altitude collections.",
	alternates: { canonical: "/gallery" },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
	return children;
}
