import Footer from "@/components/footer";
import Header from "@/components/header";
import type { Metadata } from "next";
import { PaintingProvider } from "./_context/PaintingConext";
import { fontInter } from "./_lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
	title: "SB Arts",
	description:
		"Buy & sell your art with SB Arts, the premier online marketplace for artists and collectors. Discover unique pieces, connect with talented creators, and experience a vibrant community of art enthusiasts. Whether you're an artist looking to showcase your work or a collector seeking one-of-a-kind treasures, SB Arts is your destination for all things art. Join us today and explore the world of creativity at your fingertips.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${fontInter.className} bg-white`}>
				<PaintingProvider>
					<Header />
					{children}
					<Footer />
				</PaintingProvider>
			</body>
		</html>
	);
}
