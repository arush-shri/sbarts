import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact SB Arts",
	description:
		"Contact SB Arts for original painting inquiries, commissions, partnerships, media, marketplace, and competition questions.",
	alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
	return children;
}
