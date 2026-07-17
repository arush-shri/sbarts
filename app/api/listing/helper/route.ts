import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { CompetitionEntry } from "@/app/_lib/customTypes";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const paintingCountSnapshot = await firebaseDB
			.collection("paintings")
			.count()
			.get();

		const competitionSnapshot = await firebaseDB
			.collection("competetion")
			.orderBy("createdAt", "desc")
			.get();

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const exhibitionCount = competitionSnapshot.docs.filter((doc) => {
			const competition = doc.data() as CompetitionEntry;

			const [day, month, year] = competition.exhibitionOpen
				.split("/")
				.map(Number);

			const exhibitionDate = new Date(year, month - 1, day);
			exhibitionDate.setHours(0, 0, 0, 0);

			return exhibitionDate < today;
		}).length;

		return NextResponse.json(
			{
				success: true,
				data: {
					paintingCount: paintingCountSnapshot.data().count - 1,
					exhibitionCount,
				},
			},
			{ status: 200 },
		);
	} catch (err) {
		console.error(err);

		return NextResponse.json(
			{
				success: false,
				error: "Failed to fetch dashboard counts",
			},
			{ status: 500 },
		);
	}
}
