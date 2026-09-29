import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { firebaseStorage } from "@/app/_firebase/storage";
import { PaintingType } from "@/app/_lib/customTypes";
import { canManagePainting, requireUserProfile } from "@/server/Auth";
import { NextRequest, NextResponse } from "next/server";

const IMAGE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ imageId: string }> },
) {
	const { imageId } = await params;

	if (!IMAGE_ID_PATTERN.test(imageId)) {
		return NextResponse.json({ error: "Invalid image id" }, { status: 400 });
	}

	try {
		const session = await requireUserProfile(req);
		const paintingSnapshot = await firebaseDB
			.collection("paintings")
			.where("images", "==", imageId)
			.limit(1)
			.get();

		if (paintingSnapshot.empty) {
			return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
		}

		const painting = paintingSnapshot.docs[0].data() as PaintingType;
		if (!canManagePainting(painting, session.decoded.uid, session.profile)) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const file = firebaseStorage
			.bucket()
			.file(`originals/${imageId}/artWork.jpg`);
		const [exists] = await file.exists();
		if (!exists) {
			return NextResponse.json({ error: "Original image not found" }, { status: 404 });
		}

		const [url] = await file.getSignedUrl({
			action: "read",
			expires: Date.now() + 15 * 60 * 1000,
		});

		return NextResponse.json({ url }, { status: 200 });
	} catch (error) {
		console.error("Original artwork access failed:", error);
		if (error instanceof Error && error.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (error instanceof Error && error.message === "Profile not found") {
			return NextResponse.json(
				{ error: "Account profile not found." },
				{ status: 404 },
			);
		}
		return NextResponse.json(
			{ error: "Unable to load original image" },
			{ status: 500 },
		);
	}
}
