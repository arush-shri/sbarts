import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { PaintingType } from "@/app/_lib/customTypes";
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
