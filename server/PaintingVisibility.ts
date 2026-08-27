import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { PaintingType } from "@/app/_lib/customTypes";
import { isAdminProfile } from "./Auth";

export type PaintingSurface = "marketplace" | "gallery" | "all";

async function getSellerAdminMap(sellerIds: string[]) {
	const uniqueIds = Array.from(new Set(sellerIds.filter(Boolean)));
	const adminBySellerId = new Map<string, boolean>();

	for (let index = 0; index < uniqueIds.length; index += 10) {
		const chunk = uniqueIds.slice(index, index + 10);
		const snap = await firebaseDB
			.collection("sellers")
			.where("__name__", "in", chunk)
			.get();

		snap.docs.forEach((doc) => {
			adminBySellerId.set(doc.id, isAdminProfile(doc.data()));
		});
	}

	return adminBySellerId;
}

function getStoredMarketplaceVisibility(painting: PaintingType) {
	if (typeof painting.marketplaceVisible === "boolean") {
		return painting.marketplaceVisible;
	}

	if (typeof painting.createdByAdmin === "boolean") {
		return !painting.createdByAdmin;
	}

	return undefined;
}

export async function filterPaintingsBySurface(
	paintings: PaintingType[],
	surface: PaintingSurface = "marketplace",
) {
	if (surface === "all") return paintings;

	const adminBySellerId = await getSellerAdminMap(
		paintings.map((painting) => painting.sellerId),
	);

	return paintings.filter((painting) => {
		const storedVisibility = getStoredMarketplaceVisibility(painting);
		const marketplaceVisible =
			adminBySellerId.has(painting.sellerId)
				? !adminBySellerId.get(painting.sellerId)
				: (storedVisibility ?? false);

		return surface === "marketplace"
			? marketplaceVisible
			: !marketplaceVisible;
	});
}
