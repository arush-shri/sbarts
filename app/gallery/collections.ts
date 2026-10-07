import { ART_CATEGORIES } from "@/app/_lib/artCategories";

export const collections = [
	{ id: "hope", title: ART_CATEGORIES[0], copy: "Art exploring resilience, identity, migration, memory, and the quiet strength of everyday lives.", image: "/images/hope.png", imageField: "categoryHopeImage" },
	{ id: "portrait", title: ART_CATEGORIES[1], copy: "Drawing character, identity, and emotion through careful observation.", image: "/images/portrait.png", imageField: "categoryPortraitImage" },
	{ id: "wildlife", title: ART_CATEGORIES[2], copy: "Celebrating the beauty and dignity of the natural world.", image: "/images/wildlife.png", imageField: "categoryWildlifeImage" },
	{ id: "high-altitude", title: ART_CATEGORIES[3], copy: "Inspired by aviation, aerospace, mountains, clouds, and exploration.", image: "/images/altitude.png", imageField: "categoryHighAltitudeImage" },
	{ id: "design", title: ART_CATEGORIES[4], copy: "Where precision, creativity, and visual storytelling come together.", image: "/images/design.png", imageField: "categoryDesignImage" },
] as const;

export const collectionIdToCategory: Record<string, string> = {
	hope: "Hope & Dignity",
	portrait: "Portrait",
	wildlife: "Wildlife",
	"high-altitude": "High Altitude",
	design: "Design",
};
