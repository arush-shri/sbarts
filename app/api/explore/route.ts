import { ExploreRequest, PaintingType } from "@/app/_lib/customTypes";
import { ExploreHandler } from "@/server/ExploreHandler";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const body: ExploreRequest = await req.json();
		console.log(body);
		const data: PaintingType[] = await ExploreHandler(body);

		return NextResponse.json({ success: true, data }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to fetch explore data" },
			{ status: 500 },
		);
	}
}
