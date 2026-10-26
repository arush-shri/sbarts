import Footer from "@/components/footer";
import Header from "@/components/header";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { PaintingProvider } from "./_context/PaintingConext";
import { SellerProvider } from "./_context/SellerContext";
import { SiteContentProvider } from "./_context/SiteContentContext";
import { fontCormorant, fontMontserrat } from "./_lib/fonts";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://msbart.com";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "SB Arts | Shubhra Art & Paintings",
		template: "%s | SB Arts",
	},
	description:
		"Discover Shubhra’s original art and paintings at SB Arts: a curated gallery of portrait, wildlife, design, and visual storytelling rooted in hope, dignity, and freedom.",
	keywords: ["Shubhra", "SB Arts", "art", "painting", "art gallery", "original paintings"],
	authors: [{ name: "Shubhra", url: siteUrl }],
	creator: "Shubhra / SB Arts",
	applicationName: "SB Arts",
	category: "Art and culture",
	alternates: { canonical: "/" },
	openGraph: {
		type: "website",
		url: siteUrl,
		siteName: "SB Arts",
		title: "SB Arts | Shubhra Art & Paintings",
		description:
			"Explore Shubhra’s original art, paintings, and gallery collections at SB Arts.",
		images: [{ url: "/images/hope.png", width: 1200, height: 630, alt: "SB Arts artwork" }],
	},
	twitter: {
		card: "summary_large_image",
		title: "SB Arts | Shubhra Art & Paintings",
		description: "Explore Shubhra’s original art and paintings at SB Arts.",
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
							alternateName: ["Shubhra", "SB Arts art gallery"],
							url: siteUrl,
							logo: `${siteUrl}/images/logo.png`,
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
							alternateName: "Shubhra Art",
							url: siteUrl,
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
