import sharp from "sharp";

type ProcessResult = {
	original: Buffer;
	thumbnail: Buffer;
	watermarked: Buffer;
};

export async function processImage(
	imageBuffer: Buffer,
): Promise<ProcessResult> {
	// ---------- ORIGINAL ----------
	const original = imageBuffer;

	// Get image metadata
	const meta = await sharp(imageBuffer).metadata();
	const width = meta.width || 1920;
	const height = meta.height || 1080;

	// ---------- CREATE REPEATED WATERMARK ----------
	const watermarkSvg = `
	<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<pattern id="wm" width="300" height="200" patternUnits="userSpaceOnUse"
				patternTransform="rotate(-30)">
				<text
					x="0"
					y="100"
					font-size="48"
					fill="white"
					fill-opacity="0.18"
					font-family="Arial"
				>
					SBArts
				</text>
			</pattern>
		</defs>

		<rect width="100%" height="100%" fill="url(#wm)" />
	</svg>
	`;

	// ---------- WATERMARKED IMAGE ----------
	const watermarked = await sharp(imageBuffer)
		.composite([
			{
				input: Buffer.from(watermarkSvg),
				top: 0,
				left: 0,
			},
		])
		.jpeg({ quality: 90 })
		.toBuffer();

	// ---------- THUMBNAIL (FROM WATERMARKED) ----------
	const thumbnail = await sharp(watermarked)
		.resize(500)
		.jpeg({ quality: 50 })
		.toBuffer();

	return {
		original,
		watermarked,
		thumbnail,
	};
}
