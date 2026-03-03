import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { PaintingType, UpdateBody } from "@/app/_lib/customTypes";
import { processImage } from "@/server/ArtImageHandler";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

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

		const buffer = Buffer.from(await file.arrayBuffer());

		// process images
		const result = await processImage(buffer);

		// ---------- SAVE LOCALLY ----------
		const uploadDir = path.join(process.cwd(), "uploads");

		// create folder if not exists
		await fs.mkdir(uploadDir, { recursive: true });

		// file name
		const baseName = file.name.replace(/\.[^/.]+$/, "");

		await fs.writeFile(
			path.join(uploadDir, `${baseName}-original.jpg`),
			result.original,
		);

		await fs.writeFile(
			path.join(uploadDir, `${baseName}-thumbnail.jpg`),
			result.thumbnail,
		);

		await fs.writeFile(
			path.join(uploadDir, `${baseName}-watermarked.jpg`),
			result.watermarked,
		);

		// ONLY STATUS 200
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
