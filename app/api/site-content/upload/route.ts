import { firebaseStorage } from "@/app/_firebase/storage";
import { requireAdminUser } from "@/server/Auth";
import { NextRequest, NextResponse } from "next/server";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
]);

async function removeManagedImage(url: string) {
	try {
		const parsed = new URL(url);
		const bucket = firebaseStorage.bucket();
		if (
			parsed.hostname !== "storage.googleapis.com" ||
			parsed.pathname.split("/")[1] !== bucket.name
		) {
			return;
		}

		const encodedPath = parsed.pathname.split("/").slice(2).join("/");
		if (!encodedPath) return;
		await bucket.file(decodeURIComponent(encodedPath)).delete({
			ignoreNotFound: true,
		});
	} catch (error) {
		console.error("Failed to remove replaced site content image:", error);
	}
}

export async function POST(req: NextRequest) {
	try {
		await requireAdminUser(req);
		const formData = await req.formData();
		const file = formData.get("file");
		const previousUrl = String(formData.get("previousUrl") || "");

		if (!(file instanceof File)) {
			return NextResponse.json({ error: "No image provided." }, { status: 400 });
		}
		if (!ALLOWED_TYPES.has(file.type)) {
			return NextResponse.json({ error: "Please upload a JPG, PNG, WEBP, or GIF image." }, { status: 400 });
		}
		if (file.size > MAX_IMAGE_SIZE) {
			return NextResponse.json({ error: "Image must be smaller than 10MB." }, { status: 400 });
		}

		const extension = file.type.split("/")[1].replace("jpeg", "jpg");
		const filePath = `site-content/${Date.now()}-${crypto.randomUUID()}.${extension}`;
		const storedFile = firebaseStorage.bucket().file(filePath);
		await storedFile.save(Buffer.from(await file.arrayBuffer()), {
			contentType: file.type,
			metadata: { cacheControl: "public,max-age=31536000,immutable" },
		});
		await storedFile.makePublic();
		if (previousUrl) await removeManagedImage(previousUrl);

		return NextResponse.json({
			success: true,
			url: `https://storage.googleapis.com/${firebaseStorage.bucket().name}/${encodeURIComponent(filePath)}`,
		});
	} catch (error) {
		console.error("Site content image upload error:", error);
		if (error instanceof Error && ["Unauthorized", "Forbidden", "Profile not found"].includes(error.message)) {
			return NextResponse.json({ error: error.message }, { status: error.message === "Unauthorized" ? 401 : error.message === "Profile not found" ? 404 : 403 });
		}
		return NextResponse.json({ error: "Image upload failed." }, { status: 500 });
	}
}
