import sharp from "sharp";

type ProcessResult = {
	original: Buffer;
	watermarked: Buffer;
};

export async function processImage(
	imageBuffer: Buffer,
	watermarkText = "SB ARTS",
): Promise<ProcessResult> {
	const image = sharp(imageBuffer);
	const metadata = await image.metadata();
	const width = metadata.width || 1600;
	const height = metadata.height || 1200;
	const fontSize = Math.max(28, Math.round(Math.min(width, height) / 12));
	const watermark = Buffer.from(`
		<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern id="watermark" width="${fontSize * 7}" height="${fontSize * 4}" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
					<text x="0" y="${fontSize}" fill="white" fill-opacity="0.24" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="${Math.max(2, Math.round(fontSize / 8))}">${watermarkText}</text>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#watermark)" />
		</svg>
	`);

	const watermarked = await sharp(imageBuffer)
		.composite([{ input: watermark, blend: "over" }])
		.jpeg({ quality: 100 })
		.toBuffer();

	return {
		original: imageBuffer,
		watermarked,
	};
}
