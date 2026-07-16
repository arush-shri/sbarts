import Footer from "@/components/footer";
import Header from "@/components/header";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { PaintingProvider } from "./_context/PaintingConext";
import { SellerProvider } from "./_context/SellerContext";
import { fontCormorant, fontMontserrat } from "./_lib/fonts";
//@ts-ignore
import "./globals.css";

export const metadata: Metadata = {
	title: "SB Arts",
	description:
		"SB Arts presents artwork for hope, dignity, and freedom through a gallery-style catalogue and simple inquiry experience.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${fontCormorant.className} ${fontMontserrat.className} bg-[#f7f1e6]`}
			>
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
					<PaintingProvider>
						<Header />
						{children}
						<Footer />
					</PaintingProvider>
				</SellerProvider>
			</body>
		</html>
	);
}
