import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { PaintingType } from "@/app/_lib/customTypes";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
	id?: string;
	ids?: string[];
	incrementView?: boolean;
};

export async function POST(req: NextRequest) {
	try {
		const body: RequestBody = await req.json();

		//TO CHANGE IN PRODUCTION
		// ---------- SINGLE ----------
		// if (body.id) {
		// 	const doc = await firebaseDB
		// 		.collection("paintings")
		// 		.doc(body.id)
		// 		.get();

		// 	if (!doc.exists) {
		// 		return NextResponse.json(
		// 			{ error: "Painting not found" },
		// 			{ status: 404 },
		// 		);
		// 	}

		// 	const data = doc.data() as PaintingType;

		// 	return NextResponse.json({ success: true, data }, { status: 200 });
		// }
		if (body.id) {
			const docRef = firebaseDB.collection("paintings").doc(body.id);
			const doc = await docRef.get();

			if (!doc.exists) {
				return NextResponse.json(
					{ error: "Painting not found" },
					{ status: 404 },
				);
			}

			if (body.incrementView) {
				await docRef.update({
					views: FieldValue.increment(1),
					updatedAt: Date.now(),
				});

				const updatedDoc = await docRef.get();
				const data = updatedDoc.data() as PaintingType;

				return NextResponse.json(
					{ success: true, data },
					{ status: 200 },
				);
			}

			const data = doc.data() as PaintingType;

			return NextResponse.json({ success: true, data }, { status: 200 });
		}

		// ---------- MULTIPLE ----------
		if (body.ids && body.ids.length > 0) {
			const promises = body.ids.map((id) =>
				firebaseDB.collection("paintings").doc(id).get(),
			);

			const docs = await Promise.all(promises);

			const data: PaintingType[] = docs
				.filter((d) => d.exists)
				.map((d) => d.data() as PaintingType);

			return NextResponse.json({ success: true, data }, { status: 200 });
		}

		return NextResponse.json(
			{ error: "No id or ids provided" },
			{ status: 400 },
		);
	} catch (err) {
		console.error(err);

		return NextResponse.json(
			{ error: "Failed to fetch painting data" },
			{ status: 500 },
		);
	}
}
