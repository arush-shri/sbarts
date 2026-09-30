import { PaintingType } from "./customTypes";

const paintingCachePrefix = "sb-arts:painting:";

export function cachePaintingForNavigation(painting: PaintingType) {
	if (typeof window === "undefined") return;

	try {
		window.localStorage.setItem(
			`${paintingCachePrefix}${painting.id}`,
			JSON.stringify(painting),
		);
	} catch (error) {
		console.warn("Unable to cache painting for navigation", error);
	}
}

export function getCachedPainting(paintingId: string): PaintingType | null {
	if (typeof window === "undefined") return null;

	try {
		const cachedPainting = window.localStorage.getItem(
			`${paintingCachePrefix}${paintingId}`,
		);

		return cachedPainting ? (JSON.parse(cachedPainting) as PaintingType) : null;
	} catch (error) {
		console.warn("Unable to read cached painting", error);
		return null;
	}
}
