import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About Shubhra and SB Arts",
	description:
		"Learn about Shubhra’s artistic practice and the SB Arts mission: original art and paintings shaped by observation, empathy, craft, and imagination.",
	alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
	return children;
}
