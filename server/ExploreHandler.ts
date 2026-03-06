import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { ExploreRequest, PaintingType } from "@/app/_lib/customTypes";

export async function ExploreHandler(
	params: ExploreRequest,
): Promise<PaintingType[]> {
	try {
		let query: FirebaseFirestore.Query = firebaseDB.collection("paintings");

		// ---------- CATEGORY ----------
		if (params.category && params.category.length > 0) {
			query = query.where("category", "in", params.category.slice(0, 10));
		}

		// ---------- TYPE ----------
		if (params.type === "digital") {
			query = query.where("isDigital", "==", true);
		}

		if (params.type === "physical") {
			query = query.where("isPhysical", "==", true);
		}

		// ---------- PRICE RANGE ----------
		if (params.minPrice !== undefined) {
			query = query.where("price", ">=", params.minPrice);
		}

		if (params.maxPrice !== undefined) {
			query = query.where("price", "<=", params.maxPrice);
		}

		// ---------- SORTING (Firestore supported) ----------
		switch (params.sort) {
			case "Price: Low to High":
				query = query.orderBy("price", "asc");
				break;

			case "Price: High to Low":
				query = query.orderBy("price", "desc");
				break;

			case "Newest":
				query = query.orderBy("createdAt", "desc");
				break;

			case "Most Popular":
				query = query.orderBy("views", "desc");
				break;

			default:
				query = query.orderBy("createdAt", "desc");
		}

		const snap = await query.get();

		let results: PaintingType[] = snap.docs.map(
			(doc) => doc.data() as PaintingType,
		);

		// ---------- SEARCH / RELEVANCE ----------
		// Firestore can't do true text search → do client-side filtering
		if (params.search?.trim()) {
			const search = params.search.toLowerCase();

			results = results.filter((p) => {
				return (
					p.title.toLowerCase().includes(search) ||
					p.description.toLowerCase().includes(search) ||
					p.keywords.some((k) => k.toLowerCase().includes(search))
				);
			});

			// relevance sorting
			if (params.sort === "Relevance") {
				results.sort((a, b) => {
					const score = (p: PaintingType) => {
						let s = 0;
						if (p.title.toLowerCase().includes(search)) s += 3;
						if (p.description.toLowerCase().includes(search))
							s += 2;
						if (
							p.keywords.some((k) =>
								k.toLowerCase().includes(search),
							)
						)
							s += 5;
						return s;
					};

					return score(b) - score(a);
				});
			}
		}

		return results;
	} catch (error) {
		console.log("Explore error: ", error);
		return [];
	}
}
