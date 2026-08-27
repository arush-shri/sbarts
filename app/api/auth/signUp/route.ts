import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { SellerType } from "@/app/_lib/customTypes";
import { validateEmail, validateName } from "@/app/_lib/validation";
import { requireFirebaseUser } from "@/server/Auth";
import { NextRequest, NextResponse } from "next/server";

type SignUpBody = {
	fullName?: string;
	email?: string;
};

export async function POST(req: NextRequest) {
	try {
		const decoded = await requireFirebaseUser(req);
		const body = (await req.json()) as SignUpBody;

		const name = validateName(body.fullName, "Full name", "fullName");
		if (!name.valid) {
			return NextResponse.json({ error: name.message }, { status: 400 });
		}

		const email = validateEmail(body.email || decoded.email || "");
		if (!email.valid) {
			return NextResponse.json({ error: email.message }, { status: 400 });
		}

		const profileRef = firebaseDB.collection("sellers").doc(decoded.uid);
		const existingProfile = await profileRef.get();

		if (existingProfile.exists) {
			return NextResponse.json(
				{ error: "Account profile already exists." },
				{ status: 409 },
			);
		}

		const now = Date.now();
		const profile: SellerType = {
			id: decoded.uid,
			name: name.value as string,
			image: "",
			makeSelfPortrait: false,
			portraitPrice: 0,
			address: {
				address: "",
				country: "",
				city: "",
				postalCode: "",
			},
			primaryCategories: [],
			createdAt: now,
			artWorks: [],
			email: email.value as string,
			totalSale: 0,
			itemSold: 0,
			orderIds: [],
			admin: false,
			isAdmin: false,
		};

		await profileRef.set(profile);

		return NextResponse.json(
			{ success: true, data: profile },
			{ status: 201 },
		);
	} catch (err) {
		console.error("SignUp error:", err);

		if (err instanceof Error && err.message === "Unauthorized") {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to create account profile." },
			{ status: 500 },
		);
	}
}
