import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Buy Original Art & Paintings",
	description:
		"Explore original artwork, paintings, prints, and selected design pieces from the SB Arts marketplace.",
	alternates: { canonical: "/marketplace" },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
	return children;
}
