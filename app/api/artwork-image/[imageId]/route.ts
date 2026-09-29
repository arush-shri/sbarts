import { firebaseStorage } from "@/app/_firebase/storage";
import { processImage } from "@/server/ArtImageHandler";
import { NextResponse } from "next/server";

const IMAGE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
const IMAGE_HEADERS = {
	"Content-Type": "image/jpeg",
	"Cache-Control": "public, max-age=31536000, immutable",
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
		const watermarkedFile = bucket.file(
			`watermarked/${imageId}/artWork.jpg`,
		);
		const [watermarkedExists] = await watermarkedFile.exists();

		if (watermarkedExists) {
			const [imageBuffer] = await watermarkedFile.download();
			return new NextResponse(new Uint8Array(imageBuffer), {
				headers: IMAGE_HEADERS,
			});
		}

		// Support artwork uploaded before watermarking was enabled.
		const originalFile = bucket.file(`originals/${imageId}/artWork.jpg`);
		const [originalExists] = await originalFile.exists();
		if (!originalExists) {
			return NextResponse.json({ error: "Image not found" }, { status: 404 });
		}

		const [originalBuffer] = await originalFile.download();
		try {
			await originalFile.makePrivate();
		} catch (privacyError) {
			console.warn("Unable to make legacy artwork private:", privacyError);
		}

		const result = await processImage(originalBuffer);
		await watermarkedFile.save(result.watermarked, {
			contentType: "image/jpeg",
		});

		return new NextResponse(new Uint8Array(result.watermarked), {
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
