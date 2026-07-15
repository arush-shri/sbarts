import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { firebaseStorage } from "@/app/_firebase/storage";
import { SellerType } from "@/app/_lib/customTypes";
import { requireFirebaseUser } from "@/server/Auth";
import { NextRequest, NextResponse } from "next/server";
// Stripe integration removed

type RequestBody = {
	sellerId?: string;
};

export async function POST(req: NextRequest) {
	try {
		const body: RequestBody = await req.json();

		// ---------- SINGLE SELLER ----------
		if (body.sellerId) {
			const doc = await firebaseDB
				.collection("sellers")
				.doc(body.sellerId)
				.get();

			if (!doc.exists) {
				return NextResponse.json(
					{ error: "Seller not found" },
					{ status: 404 },
				);
			}

			const data = doc.data() as SellerType;

			return NextResponse.json({ success: true, data }, { status: 200 });
		}

		// ---------- ALL SELLERS ----------
		const snap = await firebaseDB.collection("sellers").get();

		const data: SellerType[] = snap.docs.map(
			(doc) => doc.data() as SellerType,
		);

		return NextResponse.json({ success: true, data }, { status: 200 });
	} catch (err) {
		console.error(err);

		return NextResponse.json(
			{ error: "Failed to fetch sellers" },
			{ status: 500 },
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const formData = await req.formData();

		// const id = formData.get("id") as string;
		const decoded = await requireFirebaseUser(req);
		const id = decoded.uid;

		const fullName = formData.get("fullName") as string;
		const country = formData.get("country") as string;
		const city = formData.get("city") as string;
		const address = formData.get("address") as string;
		const postalCode = formData.get("postalCode") as string;
		const selfPortrait = formData.get("selfPortrait") === "true";
		const portraitPrice = Number(formData.get("portraitPrice") || 0);

		const imageFile = formData.get("image") as File | null;

		if (!id) {
			return NextResponse.json(
				{ error: "Missing seller id" },
				{ status: 400 },
			);
		}

		let imageUrl: string | undefined;

		// ---------- HANDLE IMAGE ----------
		// if (imageFile) {
		// 	const buffer = Buffer.from(await imageFile.arrayBuffer());

		// 	// For now just log image size
		// 	console.log("Uploaded image size:", buffer.length);

		// 	// TODO: upload to firebase storage later
		// 	// imageUrl = uploadedUrl
		// }

		if (imageFile && imageFile.size > 0) {
			const buffer = Buffer.from(await imageFile.arrayBuffer());
			const filePath = `sellers/${id}/profile.jpg`;
			const file = firebaseStorage.bucket().file(filePath);
			// QnA: WILL IT OVERRIDE?
			await file.save(buffer, {
				contentType: imageFile.type,
			});

			const [url] = await file.getSignedUrl({
				action: "read",
				expires: "03-01-2500",
			});

			imageUrl = url;
		}

		// ---------- UPDATE FIRESTORE ----------
		const sellerRef = firebaseDB.collection("sellers").doc(id);

		await sellerRef.update({
			name: fullName,
			makeSelfPortrait: selfPortrait,
			portraitPrice,
			address: {
				address,
				city,
				country,
				postalCode,
			},
			...(imageUrl && { image: imageUrl }),
		});

		const freshSnapshot = await sellerRef.get();
		const updatedSellerData = {
			id: freshSnapshot.id,
			...freshSnapshot.data(),
		};

		return NextResponse.json(
			{ success: true, data: updatedSellerData },
			{ status: 200 },
		);
	} catch (err) {
		console.error("Seller update error:", err);

		return NextResponse.json(
			{ error: "Failed to update seller" },
			{ status: 500 },
		);
	}
}

export async function GET(req: NextRequest) {
	return NextResponse.json(
		{ error: "Stripe integration disabled on this deployment." },
		{ status: 410 },
	);
}
