import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Explore Art & Paintings",
	description:
		"Search and explore SB Arts artwork and paintings across portrait, wildlife, design, hope, and high-altitude collections.",
	alternates: { canonical: "/explore" },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
	return children;
}
