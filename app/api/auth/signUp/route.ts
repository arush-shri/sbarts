import { firebaseDB } from "@/app/_firebase/firebaseDb";
// @ts-ignore
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();

		const fullName = formData.get("fullName") as string;
		const email = formData.get("email") as string;
		const street = formData.get("street") as string;
		const city = formData.get("city") as string;
		const zip = formData.get("zip") as string;
		const country = formData.get("country") as string;
		const password = formData.get("password") as string;
		const stripeConnected = formData.get("stripeConnected") === "true";

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// ---------- HASH PASSWORD ----------
		const hashedPassword = await bcrypt.hash(password, 12);

		// ---------- LET FIRESTORE CREATE ID ----------
		const docRef = firebaseDB.collection("sellers").doc();
		const id = docRef.id;

		await docRef.set({
			id,
			name: fullName,
			image: "",
			makeSelfPortrait: false,
			portraitPrice: 0,
			address: {
				address: street,
				country,
				city,
				postalCode: zip,
			},
			primaryCategories: [],
			createdAt: Date.now(),
			artWorks: [],
			email,
			password: hashedPassword,
			totalSale: 0,
			itemSold: 0,
			stripeConnected,
		});

		return NextResponse.json({ success: true, id }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Registration failed" },
			{ status: 500 },
		);
	}
}
