import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { firebaseStorage } from "@/app/_firebase/storage";
import { PaintingType, UpdateBody } from "@/app/_lib/customTypes";
import { processImage } from "@/server/ArtImageHandler";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const file = formData.get("uploadedFile") as File | null;

		if (!file) {
			return NextResponse.json(
				{ error: "No image provided" },
				{ status: 400 },
			);
		}

		// ---------- READ OTHER DATA ----------
		const title = formData.get("title") as string;
		const category = formData.get("category") as string;
		const medium = formData.get("medium") as string;
		const description = formData.get("description") as string;
		const price = Number(formData.get("price"));
		const quantity = Number(formData.get("quantity"));
		const listingType = formData.get("listingType") as string;
		const sellerId = formData.get("sellerId") as string;

		const buffer = Buffer.from(await file.arrayBuffer());

		// process images
		const result = await processImage(buffer);

		// ---------- CREATE PAINTING DOC ----------
		const paintingRef = firebaseDB.collection("paintings").doc();

		// ---------- GENERATE IMAGE ID ----------
		const imageId = paintingRef.id;

		const bucket = firebaseStorage.bucket();

		// ---------- UPLOAD THUMBNAIL ----------
		const thumbFile = bucket.file(`paintings/${imageId}-thumbnail.jpg`);

		await thumbFile.save(result.thumbnail, {
			contentType: "image/jpeg",
			public: true,
		});

		// ---------- UPLOAD WATERMARK ----------
		const watermarkFile = bucket.file(
			`paintings/${imageId}-watermarked.jpg`,
		);

		await watermarkFile.save(result.watermarked, {
			contentType: "image/jpeg",
			public: true,
		});

		// ---------- UPLOAD ORIGINAL (PRIVATE) ----------
		const originalFile = bucket.file(`originals/${imageId}.jpg`);

		await originalFile.save(result.original, {
			contentType: "image/jpeg",
		});

		await paintingRef.set({
			id: paintingRef.id,
			title,
			description,
			category,
			keywords: [title, category, medium],
			sellerId: sellerId,

			price,
			isDigital: listingType === "Digital Download",
			isPhysical: listingType === "Physical Item",
			quantityDigital: listingType === "Digital Download" ? quantity : 0,
			quantityPhysical: listingType === "Physical Item" ? quantity : 0,

			images: imageId,

			views: 0,
			purchases: 0,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});

		return new NextResponse(null, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Upload failed" }, { status: 500 });
	}
}

export async function GET() {
	try {
		const snap = await firebaseDB
			.collection("paintings")
			.orderBy("views", "desc") // top paintings
			.limit(4)
			.get();

		const data: PaintingType[] = snap.docs.map(
			(doc) => doc.data() as PaintingType,
		);

		return NextResponse.json(
			{
				success: true,
				data,
			},
			{ status: 200 },
		);
	} catch (err) {
		console.error(err);

		return NextResponse.json(
			{ error: "Failed to fetch listings" },
			{ status: 500 },
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const body: UpdateBody = await req.json();

		// ---------- VALIDATION ----------
		if (!body.id) {
			return NextResponse.json(
				{ error: "Painting id is required" },
				{ status: 400 },
			);
		}

		const docRef = firebaseDB.collection("paintings").doc(body.id);
		const docSnap = await docRef.get();

		if (!docSnap.exists) {
			return NextResponse.json(
				{ error: "Painting not found" },
				{ status: 404 },
			);
		}

		const existing = docSnap.data() as PaintingType;

		// ---------- PREPARE UPDATE OBJECT ----------
		const updateData: Partial<PaintingType> = {
			updatedAt: Date.now(),
		};

		if (body.title !== undefined) updateData.title = body.title;
		if (body.category !== undefined) updateData.category = body.category;
		if (body.description !== undefined)
			updateData.description = body.description;
		if (body.price !== undefined) updateData.price = body.price;

		// ---------- HANDLE QUANTITY ----------
		if (body.quantity !== undefined) {
			if (existing.isDigital) {
				updateData.quantityDigital = body.quantity;
			} else if (existing.isPhysical) {
				updateData.quantityPhysical = body.quantity;
			}
		}

		// ---------- UPDATE FIRESTORE ----------
		await docRef.update(updateData);

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (err) {
		console.error(err);

		return NextResponse.json(
			{ error: "Failed to update painting" },
			{ status: 500 },
		);
	}
}
