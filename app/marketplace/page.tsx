import { ReactElement } from "react";
import ExplorePage from "../explore/ExplorePage";

export default async function Marketplace({
	searchParams,
}: {
	searchParams: Promise<{
		category?: string;
		keyword?: string;
	}>;
}): Promise<ReactElement> {
	const params = await searchParams;

	return (
		<ExplorePage
			category={params.category || ""}
			keyword={params.keyword || ""}
			title="Marketplace"
		/>
	);
}
