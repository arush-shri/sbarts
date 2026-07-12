export const ART_CATEGORIES = [
	"Hope & Dignity",
	"Portrait",
	"Wildlife",
	"High Altitude",
	"Design",
] as const;

export type ArtCategory = (typeof ART_CATEGORIES)[number];

export function isArtCategory(value: unknown): value is ArtCategory {
	return (
		typeof value === "string" &&
		(ART_CATEGORIES as readonly string[]).includes(value)
	);
}
