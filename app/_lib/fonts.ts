import localFont from "next/font/local";

export const fontCormorant = localFont({
	src: "../../public/fonts/CormorantGaramond-Variable.ttf",
	variable: "--font-heading",
	weight: "300 700",
	display: "swap",
});

export const fontMontserrat = localFont({
	src: "../../public/fonts/Montserrat-Variable.ttf",
	variable: "--font-body",
	weight: "100 900",
	display: "swap",
});
