// assume this exists
// import PaintingCard from "./PaintingCard";
// make api call for paintings

import { ReactElement } from "react";
import ExplorePage from "./ExplorePage";

export default async function Explore({
	searchParams,
}: {
	searchParams: Promise<{
		category?: string;
		keyword?: string;
	}>;
}): Promise<ReactElement> {
	const params = await searchParams;
	const category: string = params.category || "";
	const keyword: string = params.keyword || "";

	return <ExplorePage category={category} keyword={keyword} />;
}
