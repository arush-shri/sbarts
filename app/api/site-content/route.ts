import {
	SITE_CONTENT_EXTRA_FIELDS,
	SitePageKey,
	isSitePageKey,
} from "@/app/_lib/siteContent";
import {
	getSiteContent,
	invalidateSiteContentCache,
	updateSitePageContent,
} from "@/app/_lib/siteContentServer";
import { firebaseStorage } from "@/app/_firebase/storage";
import { requireAdminUser } from "@/server/Auth";
import { NextRequest, NextResponse } from "next/server";

const MAX_FIELD_LENGTH = 600;


function cleanText(value: unknown, maxLength = MAX_FIELD_LENGTH) {
	if (typeof value !== "string") return "";
	return value.trim().slice(0, maxLength);
}

function cleanFields(pageKey: string, fields: unknown) {
	if (!fields || typeof fields !== "object") return {};

	const safePageKey = pageKey as SitePageKey;
	const allowedFields = SITE_CONTENT_EXTRA_FIELDS[safePageKey] || [];
	const incoming = fields as Record<string, unknown>;

	return allowedFields.reduce<Record<string, string>>((nextFields, field) => {
		nextFields[field.key] = cleanText(
			incoming[field.key],
			field.type === "image-list" ? 30000 : MAX_FIELD_LENGTH,
		);
		return nextFields;
	}, {});
}

function getManagedImageUrls(fields?: Record<string, string>) {
	const urls = new Set<string>();
	for (const [key, value] of Object.entries(fields || {})) {
		if (key === "heroSlides") {
			try {
				const slides = JSON.parse(value);
				if (Array.isArray(slides)) {
					for (const slide of slides) {
						if (typeof slide?.image === "string") urls.add(slide.image);
					}
				}
			} catch {
				// Invalid legacy slideshow values do not contain managed paths.
			}
		} else if (key.toLowerCase().includes("image")) {
			urls.add(value);
		}
	}
	return urls;
}

async function removeManagedImage(url: string) {
	try {
		const parsed = new URL(url);
		const bucket = firebaseStorage.bucket();
		if (
			parsed.hostname !== "storage.googleapis.com" ||
			parsed.pathname.split("/")[1] !== bucket.name
		) {
			return;
		}
		const encodedPath = parsed.pathname.split("/").slice(2).join("/");
		if (encodedPath) {
			await bucket.file(decodeURIComponent(encodedPath)).delete({
				ignoreNotFound: true,
			});
		}
	} catch (error) {
		console.error("Failed to remove deleted site content image:", error);
	}
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
		await requireAdminUser(req);

		const body = await req.json();
		const pageKey = String(body.pageKey || "");

		if (!isSitePageKey(pageKey)) {
			return NextResponse.json(
				{ error: "Invalid page key" },
				{ status: 400 },
			);
		}

		const current = await getSiteContent();
		const pages = current.pages;
		const previousImageUrls = getManagedImageUrls(
			pages[pageKey].fields,
		);
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
		const nextImageUrls = getManagedImageUrls(pageContent.fields);
		await Promise.all(
			[...previousImageUrls]
				.filter((url) => !nextImageUrls.has(url))
				.map(removeManagedImage),
		);

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

		if (
			error instanceof Error &&
			(error.message === "Unauthorized" ||
				error.message === "Forbidden" ||
				error.message === "Profile not found")
		) {
			return NextResponse.json(
				{
					error:
						error.message === "Profile not found"
							? "Account profile not found."
							: error.message,
				},
				{
					status:
						error.message === "Unauthorized"
							? 401
							: error.message === "Profile not found"
								? 404
								: 403,
				},
			);
		}

		return NextResponse.json(
			{ error: "Failed to update site content" },
			{ status: 500 },
		);
	}
}
