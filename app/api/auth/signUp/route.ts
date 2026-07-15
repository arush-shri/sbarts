import { firebaseAuth } from "@/app/_firebase/firebaseAuth";
import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { firebaseStorage } from "@/app/_firebase/storage";
import { SellerType } from "@/app/_lib/customTypes";
// @ts-ignore
import { NextRequest, NextResponse } from "next/server";
// Stripe removed — onboarding disabled

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
		const selfPortrait = formData.get("selfPortrait") === "true";
		const portraitPrice = Number(formData.get("portraitPrice") ?? 0);

		const imageFile = formData.get("image") as File | null;

		if (!email || !password || !imageFile) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// ---------- LET FIRESTORE CREATE ID ----------
		const user = await firebaseAuth.createUser({
			email,
			password,
		});
		const sellerId: string = user.uid;
		// Stripe onboarding disabled — no stripeConnect created
		let stripeConnect: string | undefined;
		let onboardingUrl: string | undefined = null;
		const docRef = firebaseDB.collection("sellers").doc(sellerId);

		let imageUrl = "";
		const bucket = firebaseStorage.bucket();

		// ---------- UPLOAD IMAGE ----------
		if (imageFile) {
			const buffer = Buffer.from(await imageFile.arrayBuffer());

			const filePath = `sellers/${sellerId}/profile.jpg`;

			const file = bucket.file(filePath);

			await file.save(buffer, {
				contentType: imageFile.type,
			});

			const [url] = await file.getSignedUrl({
				action: "read",
				expires: "03-01-2500",
			});

			imageUrl = url;
		}

		const data: SellerType = {
			id: sellerId,
			name: fullName,
			image: imageUrl,
			makeSelfPortrait: selfPortrait,
			portraitPrice: portraitPrice,
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
			totalSale: 0,
			itemSold: 0,
			orderIds: [],
			// stripeConnect omitted when Stripe is disabled
		};

		await docRef.set(data);

		return NextResponse.json(
			{
				success: true,
				id: sellerId,
				onboardingUrl: onboardingUrl ?? null,
			},
			{ status: 200 },
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Registration failed" },
			{ status: 500 },
		);
	}
}
