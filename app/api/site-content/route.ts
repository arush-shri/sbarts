import {
	SITE_CONTENT_EXTRA_FIELDS,
	SitePageKey,
	isSitePageKey,
	mergeSiteContent,
} from "@/app/_lib/siteContent";
import {
	getSiteContent,
	invalidateSiteContentCache,
	updateSitePageContent,
} from "@/app/_lib/siteContentServer";
import { requireFirebaseUser } from "@/server/Auth";
import { NextRequest, NextResponse } from "next/server";

const MAX_FIELD_LENGTH = 600;

function cleanText(value: unknown) {
	if (typeof value !== "string") return "";
	return value.trim().slice(0, MAX_FIELD_LENGTH);
}

function cleanFields(pageKey: string, fields: unknown) {
	if (!fields || typeof fields !== "object") return {};

	const safePageKey = pageKey as SitePageKey;
	const allowedFields = SITE_CONTENT_EXTRA_FIELDS[safePageKey] || [];
	const incoming = fields as Record<string, unknown>;

	return allowedFields.reduce<Record<string, string>>((nextFields, field) => {
		nextFields[field.key] = cleanText(incoming[field.key]);
		return nextFields;
	}, {});
}

export async function GET(req: NextRequest) {
	try {
		const current = await getSiteContent();
		const requestedVersion = req.nextUrl.searchParams.get("version");

		if (requestedVersion && requestedVersion === current.version) {
			return NextResponse.json(
				{
					success: true,
					unchanged: true,
					version: current.version,
					updatedAt: current.updatedAt,
				},
				{
					status: 200,
					headers: {
						"Cache-Control": "private, max-age=0, must-revalidate",
					},
				},
			);
		}

		return NextResponse.json(
			{
				success: true,
				unchanged: false,
				...current,
			},
			{
				status: 200,
				headers: {
					"Cache-Control": "private, max-age=0, must-revalidate",
				},
			},
		);
	} catch (error) {
		console.error("Site content fetch error:", error);

		return NextResponse.json(
			{ error: "Failed to fetch site content" },
			{ status: 500 },
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		await requireFirebaseUser(req);

		const body = await req.json();
		const pageKey = String(body.pageKey || "");

		if (!isSitePageKey(pageKey)) {
			return NextResponse.json(
				{ error: "Invalid page key" },
				{ status: 400 },
			);
		}

		const pages = mergeSiteContent();
		const pageContent = {
			...pages[pageKey],
			title: cleanText(body.title),
			subtitle: cleanText(body.subtitle),
			subtext: cleanText(body.subtext),
			fields: {
				...(pages[pageKey].fields || {}),
				...cleanFields(pageKey, body.fields),
			},
		};

		if (!pageContent.title) {
			return NextResponse.json(
				{ error: "Title is required" },
				{ status: 400 },
			);
		}

		invalidateSiteContentCache();
		const payload = await updateSitePageContent(pageKey, pageContent);

		return NextResponse.json(
			{ success: true, ...payload },
			{
				status: 200,
				headers: {
					"Cache-Control": "no-store",
				},
			},
		);
	} catch (error) {
		console.error("Site content update error:", error);

		if (error instanceof Error && error.message === "Unauthorized") {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to update site content" },
			{ status: 500 },
		);
	}
}
