import Footer from "@/components/footer";
import Header from "@/components/header";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { PaintingProvider } from "./_context/PaintingConext";
import { fontInter } from "./_lib/fonts";
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
			<body className={`${fontInter.className} bg-[#f7f1e6]`}>
				<Toaster
					position="top-center"
					toastOptions={{
						duration: 4000,
						style: {
							borderRadius: "10px",
						},
					}}
				/>
				<PaintingProvider>
					<Header />
					{children}
					<Footer />
				</PaintingProvider>
			</body>
		</html>
	);
}
