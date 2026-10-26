import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Original Artwork",
	description:
		"View an original SB Arts artwork or painting by Shubhra, including its story, details, and inquiry options.",
	robots: { index: true, follow: true },
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
	return children;
}
