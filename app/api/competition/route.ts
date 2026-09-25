import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { CompetitionEntry } from "@/app/_lib/customTypes";
import { requireAdminUser } from "@/server/Auth";
import { NextRequest, NextResponse } from "next/server";

const CURRENT_COMPETITION_ID = "current";

function authErrorResponse(err: unknown) {
	if (!(err instanceof Error)) return null;
	if (err.message === "Unauthorized") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	if (err.message === "Forbidden") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}
	if (err.message === "Profile not found") {
		return NextResponse.json(
			{ error: "Account profile not found." },
			{ status: 404 },
		);
	}
	return null;
}

async function fetchLatestCompetition() {
	const current = await firebaseDB
		.collection("competetion")
		.doc(CURRENT_COMPETITION_ID)
		.get();

	if (current.exists) return current.data() as CompetitionEntry;

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

export async function GET() {
	try {
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
		await requireAdminUser(req);
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

		const competitionRef = firebaseDB
			.collection("competetion")
			.doc(CURRENT_COMPETITION_ID);
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
		const authResponse = authErrorResponse(err);
		if (authResponse) return authResponse;

		return NextResponse.json(
			{ error: "Failed to create competition." },
			{ status: 500 },
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		await requireAdminUser(req);
		const body = (await req.json()) as Partial<CompetitionEntry> & {
			id?: string;
		};

		let competitionRef = firebaseDB
			.collection("competetion")
			.doc(body.id || CURRENT_COMPETITION_ID);
		const initialDoc = await competitionRef.get();

		if (!body.id && !initialDoc.exists) {
			const latest = await firebaseDB
				.collection("competetion")
				.orderBy("createdAt", "desc")
				.limit(1)
				.get();
			if (!latest.empty) {
				competitionRef = latest.docs[0].ref;
			}
		}

		const currentDoc = await competitionRef.get();

		if (!currentDoc.exists && body.id) {
			return NextResponse.json(
				{ error: "Competition not found." },
				{ status: 404 },
			);
		}

		const bodyValues = {
			title: body.title?.trim() || "SB Arts International Juried Competition",
			entriesOpen: String(body.entriesOpen || "").trim(),
			finalDeadline: String(body.finalDeadline || "").trim(),
			winnersAnnouncement: String(body.winnersAnnouncement || "").trim(),
			exhibitionOpen: String(body.exhibitionOpen || "").trim(),
			status: body.status?.trim() || "registration open",
		};

		if (
			!bodyValues.entriesOpen ||
			!bodyValues.finalDeadline ||
			!bodyValues.winnersAnnouncement ||
			!bodyValues.exhibitionOpen
		) {
			return NextResponse.json(
				{ error: "All competition dates are required." },
				{ status: 400 },
			);
		}

		const updateData: Partial<CompetitionEntry> = {
			...bodyValues,
			updatedAt: Date.now(),
		};

		if (currentDoc.exists) {
			await competitionRef.update(updateData);
		} else {
			const now = Date.now();
			await competitionRef.set({
				id: competitionRef.id,
				...bodyValues,
				createdAt: now,
				updatedAt: now,
			} satisfies CompetitionEntry);
		}

		const saved = await competitionRef.get();
		return NextResponse.json(
			{ success: true, data: saved.data() as CompetitionEntry },
			{ status: 200 },
		);
	} catch (err) {
		console.error(err);
		const authResponse = authErrorResponse(err);
		if (authResponse) return authResponse;

		return NextResponse.json(
			{ error: "Failed to update competition." },
			{ status: 500 },
		);
	}
}
