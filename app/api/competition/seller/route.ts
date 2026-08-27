import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { CompetitionEntry } from "@/app/_lib/customTypes";
import { requireAdminUser } from "@/server/Auth";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(req: NextRequest) {
	try {
		await requireAdminUser(req);
		const snap = await firebaseDB
			.collection("competetion")
			.orderBy("createdAt", "desc")
			.get();

		const data = snap.docs.map((doc) => doc.data() as CompetitionEntry);
		return NextResponse.json({ success: true, data }, { status: 200 });
	} catch (err) {
		console.error(err);
		const authResponse = authErrorResponse(err);
		if (authResponse) return authResponse;

		return NextResponse.json(
			{ error: "Failed to fetch competitions." },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		await requireAdminUser(req);
		const body = (await req.json()) as Partial<CompetitionEntry>;

		const title = body.title?.trim();
		const entriesOpen = String(body.entriesOpen);
		const finalDeadline = String(body.finalDeadline);
		const winnersAnnouncement = String(body.winnersAnnouncement);
		const exhibitionOpen = String(body.exhibitionOpen);
		const status = body.status?.trim();

		if (
			!title ||
			!entriesOpen ||
			!finalDeadline ||
			!winnersAnnouncement ||
			!exhibitionOpen ||
			!status
		) {
			return NextResponse.json(
				{ error: "All competition details are required." },
				{ status: 400 },
			);
		}

		const competitionRef = firebaseDB.collection("competetion").doc();
		const now = Date.now();
		const data: CompetitionEntry = {
			id: competitionRef.id,
			title,
			entriesOpen,
			finalDeadline,
			winnersAnnouncement,
			exhibitionOpen,
			status,
			createdAt: now,
			updatedAt: now,
		};

		await competitionRef.set(data);
		return NextResponse.json({ success: true, data }, { status: 200 });
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

		if (body.title !== undefined) updateData.title = body.title.trim();
		if (body.entriesOpen !== undefined)
			updateData.entriesOpen = String(body.entriesOpen);
		if (body.finalDeadline !== undefined)
			updateData.finalDeadline = String(body.finalDeadline);
		if (body.winnersAnnouncement !== undefined)
			updateData.winnersAnnouncement = String(body.winnersAnnouncement);
		if (body.exhibitionOpen !== undefined)
			updateData.exhibitionOpen = String(body.exhibitionOpen);
		if (body.status !== undefined) updateData.status = body.status.trim();

		await competitionRef.update(updateData);
		return NextResponse.json({ success: true }, { status: 200 });
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

export async function DELETE(req: NextRequest) {
	try {
		await requireAdminUser(req);

		const { id } = (await req.json()) as { id?: string };

		if (!id) {
			return NextResponse.json(
				{ error: "Competition id is required." },
				{ status: 400 },
			);
		}

		const competitionRef = firebaseDB.collection("competetion").doc(id);

		const competitionDoc = await competitionRef.get();

		if (!competitionDoc.exists) {
			return NextResponse.json(
				{ error: "Competition not found." },
				{ status: 404 },
			);
		}

		await competitionRef.delete();

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (err) {
		console.error(err);
		const authResponse = authErrorResponse(err);
		if (authResponse) return authResponse;

		return NextResponse.json(
			{ error: "Failed to delete competition." },
			{ status: 500 },
		);
	}
}
