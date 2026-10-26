import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "International Art Competition",
	description:
		"SB Arts International Juried Competition: an art competition celebrating hope, dignity, freedom, resilience, identity, and humanity.",
	alternates: { canonical: "/competition" },
};

export default function CompetitionLayout({ children }: { children: React.ReactNode }) {
	return children;
}
