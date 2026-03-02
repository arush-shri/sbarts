import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { SellerType } from "@/app/_lib/customTypes";
import { NextRequest, NextResponse } from "next/server";

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
