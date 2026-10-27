import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Original Art & Paintings by Shubhra Raj | SB Arts",
	description:
		"Explore original artwork, paintings, prints, and selected design pieces from the SB Arts marketplace.",
	alternates: { canonical: "/marketplace" },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
	return children;
}
