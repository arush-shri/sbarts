type ProcessResult = {
	original: Buffer;
};

export async function processImage(
	imageBuffer: Buffer,
): Promise<ProcessResult> {
	// ---------- ORIGINAL ----------
	const original = imageBuffer;

	return {
		original,
	};
}
