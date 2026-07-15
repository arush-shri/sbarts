import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { CompetitionEntry } from "@/app/_lib/customTypes";
import { requireFirebaseUser } from "@/server/Auth";
import { NextRequest, NextResponse } from "next/server";

async function fetchLatestCompetition() {
	const snap = await firebaseDB
		.collection("competetion")
		.orderBy("createdAt", "desc")
		.limit(1)
		.get();

	if (snap.empty) {
		return null;
	}

	return snap.docs[0].data() as CompetitionEntry;
}

async function fetchAllCompetitions() {
	const snap = await firebaseDB
		.collection("competetion")
		.orderBy("createdAt", "desc")
		.get();

	return snap.docs.map((doc) => doc.data() as CompetitionEntry);
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const all = searchParams.get("all");

		if (all === "1") {
			const data = await fetchAllCompetitions();
			return NextResponse.json({ success: true, data }, { status: 200 });
		}

		const data = await fetchLatestCompetition();
		return NextResponse.json({ success: true, data }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to fetch competition data." },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		await requireFirebaseUser(req);
		const body = (await req.json()) as Partial<CompetitionEntry>;

		const entriesOpen = String(body.entriesOpen);
		const finalDeadline = String(body.finalDeadline);
		const winnersAnnouncement = String(body.winnersAnnouncement);
		const exhibitionOpen = String(body.exhibitionOpen);
		const status = body.status?.trim();
		const title = body.title?.trim() || "SB Arts Competition";

		if (
			!entriesOpen ||
			!finalDeadline ||
			!winnersAnnouncement ||
			!exhibitionOpen ||
			!status
		) {
			return NextResponse.json(
				{ error: "All competition dates and status are required." },
				{ status: 400 },
			);
		}

		const competitionRef = firebaseDB.collection("competetion").doc();
		const now = Date.now();

		const document: CompetitionEntry = {
			id: competitionRef.id,
			entriesOpen,
			finalDeadline,
			winnersAnnouncement,
			exhibitionOpen,
			status,
			title,
			createdAt: now,
			updatedAt: now,
		};

		await competitionRef.set(document);
		return NextResponse.json(
			{ success: true, data: document },
			{ status: 200 },
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to create competition." },
			{ status: 500 },
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		await requireFirebaseUser(req);
		const body = (await req.json()) as Partial<CompetitionEntry> & {
			id?: string;
		};

		if (!body.id) {
			return NextResponse.json(
				{ error: "Competition id is required." },
				{ status: 400 },
			);
		}

		const competitionRef = firebaseDB
			.collection("competetion")
			.doc(body.id);
		const competitionDoc = await competitionRef.get();

		if (!competitionDoc.exists) {
			return NextResponse.json(
				{ error: "Competition not found." },
				{ status: 404 },
			);
		}

		const updateData: Partial<CompetitionEntry> = {
			updatedAt: Date.now(),
		};

		if (body.entriesOpen !== undefined)
			updateData.entriesOpen = String(body.entriesOpen);
		if (body.finalDeadline !== undefined)
			updateData.finalDeadline = String(body.finalDeadline);
		if (body.winnersAnnouncement !== undefined)
			updateData.winnersAnnouncement = String(body.winnersAnnouncement);
		if (body.exhibitionOpen !== undefined)
			updateData.exhibitionOpen = String(body.exhibitionOpen);
		if (body.status !== undefined) updateData.status = body.status.trim();
		if (body.title !== undefined) updateData.title = body.title.trim();

		await competitionRef.update(updateData);
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to update competition." },
			{ status: 500 },
		);
	}
}
