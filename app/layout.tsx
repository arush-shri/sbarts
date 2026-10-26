import Footer from "@/components/footer";
import Header from "@/components/header";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { PaintingProvider } from "./_context/PaintingConext";
import { SellerProvider } from "./_context/SellerContext";
import { SiteContentProvider } from "./_context/SiteContentContext";
import { fontCormorant, fontMontserrat } from "./_lib/fonts";
//@ts-ignore
import "./globals.css";

const siteUrl = (
	process.env.NEXT_PUBLIC_SITE_URL || "https://msbart.com"
).replace(/\/$/, "");
const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "SB Arts",
		template: "%s | SB Arts",
	},
	description:
		"SB Arts is the official website and online art gallery of Shubhra, featuring original paintings, portrait, wildlife, design, and visual storytelling rooted in hope, dignity, and freedom.",
	keywords: [
		"SB Arts",
		"Shubhra",
		"official SB Arts website",
		"original art",
		"original paintings",
		"art gallery",
	],
	authors: [{ name: "Shubhra", url: siteUrl }],
	creator: "Shubhra / SB Arts",
	applicationName: "SB Arts",
	category: "Art and culture",
	alternates: { canonical: "/" },
	openGraph: {
		type: "website",
		url: siteUrl,
		siteName: "SB Arts",
		title: "SB Arts",
		description:
			"Explore Shubhra’s original art, paintings, and gallery collections at the official SB Arts website.",
		images: [
			{
				url: "/images/hope.png",
				width: 1200,
				height: 630,
				alt: "SB Arts artwork",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "SB Arts",
		description:
			"Explore Shubhra’s original art and paintings at the official SB Arts website.",
		images: ["/images/hope.png"],
	},
	robots: { index: true, follow: true },
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${fontCormorant.variable} ${fontMontserrat.variable} bg-[#f7f1e6]`}
			>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							name: "SB Arts",
							alternateName: [
								"Shubhra",
								"SB Arts art gallery",
								"SB Arts official website",
							],
							url: siteUrl,
							logo: `${siteUrl}/images/logo.png`,
							description:
								"The official website of Shubhra, featuring original art and paintings by SB Arts.",
							founder: { "@type": "Person", name: "Shubhra" },
							knowsAbout: [
								"Original art",
								"Painting",
								"Portraiture",
								"Wildlife art",
								"Visual storytelling",
							],
							...(instagramUrl ? { sameAs: [instagramUrl] } : {}),
						}),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebSite",
							name: "SB Arts",
							alternateName: [
								"Shubhra Art",
								"SB Arts official website",
							],
							url: siteUrl,
							inLanguage: "en",
						}),
					}}
				/>
				<Toaster
					position="top-center"
					toastOptions={{
						duration: 4000,
						style: {
							borderRadius: "10px",
						},
					}}
				/>
				<SellerProvider>
					<SiteContentProvider>
						<PaintingProvider>
							<Header />
							{children}
							<Footer />
						</PaintingProvider>
					</SiteContentProvider>
				</SellerProvider>
			</body>
		</html>
	);
}
