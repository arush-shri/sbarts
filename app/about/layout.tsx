import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Shubhra Raj | SB Arts",
	description:
		"Learn about Shubhra Raj, the artist and founder of SB Arts, and explore the ideas behind her original art and paintings.",
	keywords: ["Shubhra Raj", "SB Arts", "Shubhra Raj artist", "SB Arts artist"],
	alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
	const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://msbart.com").replace(/\/$/, "");
	const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Person",
						name: "Shubhra Raj",
						url: `${siteUrl}/about`,
						jobTitle: "Artist",
						description: "Artist and founder of SB Arts.",
						worksFor: {
							"@type": "Organization",
							name: "SB Arts",
							url: siteUrl,
						},
						...(instagramUrl ? { sameAs: [instagramUrl] } : {}),
					}),
				}}
			/>
			{children}
		</>
	);
}
