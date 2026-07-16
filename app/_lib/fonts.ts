import { Cormorant_Garamond, Montserrat } from "next/font/google";

export const fontCormorant = Cormorant_Garamond({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-heading",
});

export const fontMontserrat = Montserrat({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-body",
});
