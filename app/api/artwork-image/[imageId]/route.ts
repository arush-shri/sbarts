import { firebaseStorage } from "@/app/_firebase/storage";
import { NextResponse } from "next/server";

const IMAGE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
const IMAGE_HEADERS = {
	"Content-Type": "image/jpeg",
	"Cache-Control": "public, max-age=3600",
};

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ imageId: string }> },
) {
	const { imageId } = await params;

	if (!IMAGE_ID_PATTERN.test(imageId)) {
		return NextResponse.json({ error: "Invalid image id" }, { status: 400 });
	}

	try {
		const bucket = firebaseStorage.bucket();
		const originalFile = bucket.file(`originals/${imageId}/artWork.jpg`);
		const [originalExists] = await originalFile.exists();
		if (!originalExists) {
			return NextResponse.json({ error: "Image not found" }, { status: 404 });
		}

		const [originalBuffer] = await originalFile.download();
		return new NextResponse(new Uint8Array(originalBuffer), {
			headers: IMAGE_HEADERS,
		});
	} catch (error) {
		console.error("Artwork image delivery failed:", error);
		return NextResponse.json(
			{ error: "Unable to load image" },
			{ status: 500 },
		);
	}
}
