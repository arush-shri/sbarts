import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { firebaseStorage } from "@/app/_firebase/storage";
import { isArtCategory } from "@/app/_lib/artCategories";
import { PaintingType, UpdateBody } from "@/app/_lib/customTypes";
import { processImage } from "@/server/ArtImageHandler";
import { requireFirebaseUser } from "@/server/Auth";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

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
		// const sellerId = formData.get("sellerId") as string;
		const decoded = await requireFirebaseUser(req);
		const sellerId = decoded.uid;

		if (!isArtCategory(category)) {
			return NextResponse.json(
				{ error: "Please select a valid artwork category" },
				{ status: 400 },
			);
		}

		const buffer = Buffer.from(await file.arrayBuffer());

		// process images
		const result = await processImage(buffer);

		// ---------- CREATE PAINTING DOC ----------
		const paintingRef = firebaseDB.collection("paintings").doc();

		// ---------- GENERATE IMAGE ID ----------
		const imageId = paintingRef.id;

		const bucket = firebaseStorage.bucket();

		// ---------- UPLOAD ORIGINAL (PRIVATE) ----------
		const originalFile = bucket.file(`originals/${imageId}/artWork.jpg`);

		await originalFile.save(result.original, {
			contentType: "image/jpeg",
		});
		await originalFile.makePublic();

		const metadata = await sharp(result.original).metadata();
		const width = metadata.width;
		const height = metadata.height;

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
			quantity: quantity,

			images: imageId,

			views: 0,
			purchases: 0,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			resolution: `${width}x${height}`,
		});

		await firebaseDB
			.collection("sellers")
			.doc(sellerId)
			.update({
				artWorks: FieldValue.arrayUnion(paintingRef.id),
				primaryCategories: FieldValue.arrayUnion(category),
			});
		return NextResponse.json({ id: paintingRef.id }, { status: 200 });
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

		const decoded = await requireFirebaseUser(req);
		if (existing.sellerId !== decoded.uid) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// ---------- PREPARE UPDATE OBJECT ----------
		const updateData: Partial<PaintingType> = {
			updatedAt: Date.now(),
		};

		if (body.title !== undefined) updateData.title = body.title;
		if (body.category !== undefined) {
			if (!isArtCategory(body.category)) {
				return NextResponse.json(
					{ error: "Please select a valid artwork category" },
					{ status: 400 },
				);
			}
			updateData.category = body.category;
		}
		if (body.description !== undefined)
			updateData.description = body.description;
		if (body.price !== undefined) updateData.price = body.price;

		// ---------- HANDLE QUANTITY ----------
		if (body.quantity !== undefined) {
			if (existing.isDigital) {
				updateData.quantity = body.quantity;
			} else if (existing.isPhysical) {
				updateData.quantity = body.quantity;
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

export async function DELETE(req: NextRequest) {
	try {
		// 1. Authorize the user using your Bearer Token helper
		const decoded = await requireFirebaseUser(req);
		const sellerId = decoded.uid;

		// 2. Extract the painting ID from the query parameters
		const { searchParams } = new URL(req.url);
		const paintingId = searchParams.get("id");

		if (!paintingId) {
			return NextResponse.json(
				{ error: "Missing listing ID" },
				{ status: 400 },
			);
		}

		// 3. Fetch the painting to verify ownership and grab context
		const paintingRef = firebaseDB.collection("paintings").doc(paintingId);
		const paintingDoc = await paintingRef.get();

		if (!paintingDoc.exists) {
			return NextResponse.json(
				{ error: "Listing not found" },
				{ status: 404 },
			);
		}

		const paintingData = paintingDoc.data();

		// Security Check: Ensure the person deleting this item is the seller who listed it
		if (paintingData?.sellerId !== sellerId) {
			return NextResponse.json(
				{ error: "Unauthorized to delete this listing" },
				{ status: 403 },
			);
		}

		const category = paintingData.category;
		const imageId = paintingData.images; // e.g., the folder name / ID string

		const bucket = firebaseStorage.bucket();

		// 4. DELETE STORAGE IMAGES
		// We delete the exact files created during the upload phase
		const filesToDelete = [`originals/${imageId}/artWork.jpg`];

		// Map them to promises and use ignoreErrors to prevent crashes if a specific file doesn't exist
		await Promise.all(
			filesToDelete.map(async (path) => {
				try {
					const file = bucket.file(path);
					const [exists] = await file.exists();
					if (exists) {
						await file.delete();
					}
				} catch (storageErr) {
					console.error(
						`Failed to delete file from storage: ${path}`,
						storageErr,
					);
				}
			}),
		);

		// 5. UPDATE SELLER DOCUMENT (Remove references)
		await firebaseDB
			.collection("sellers")
			.doc(sellerId)
			.update({
				artWorks: FieldValue.arrayRemove(paintingId),
				// Note: Removing categories via arrayRemove can be aggressive if they have other items
				// in the same category, but mirrors your arrayUnion setup.
				primaryCategories: FieldValue.arrayRemove(category),
			});

		// 6. DELETE PAINTING DOCUMENT
		await paintingRef.delete();

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (err: any) {
		console.error("Listing deletion failed:", err);

		if (err.message === "Unauthorized") {
			return NextResponse.json(
				{ error: "Authentication token invalid" },
				{ status: 401 },
			);
		}

		return NextResponse.json(
			{ error: "Internal Server Error during deletion" },
			{ status: 500 },
		);
	}
}
