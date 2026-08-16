import { firebaseDB } from "@/app/_firebase/firebaseDb";
import {
	DEFAULT_SITE_CONTENT,
	SITE_CONTENT_COLLECTION,
	SITE_CONTENT_DOCUMENT,
	SiteContentMap,
	SiteContentPayload,
	SitePageKey,
	mergeSiteContent,
} from "@/app/_lib/siteContent";
import { FieldValue } from "firebase-admin/firestore";

const CACHE_TTL_MS = 1000 * 60 * 30;

let memoryCache:
	| {
			expiresAt: number;
			payload: SiteContentPayload;
	  }
	| null = null;

function contentRef() {
	return firebaseDB
		.collection(SITE_CONTENT_COLLECTION)
		.doc(SITE_CONTENT_DOCUMENT);
}

function createVersion() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function seedDefaultContent(): Promise<SiteContentPayload> {
	const version = createVersion();
	const payload: SiteContentPayload = {
		version,
		updatedAt: Date.now(),
		pages: DEFAULT_SITE_CONTENT,
	};

	await contentRef().set({
		...payload,
		createdAt: FieldValue.serverTimestamp(),
		updatedAtServer: FieldValue.serverTimestamp(),
	});

	return payload;
}

export async function getSiteContent(): Promise<SiteContentPayload> {
	const now = Date.now();

	if (memoryCache && memoryCache.expiresAt > now) {
		return memoryCache.payload;
	}

	const doc = await contentRef().get();
	const payload = doc.exists
		? ({
				version: String(doc.data()?.version || "default"),
				updatedAt: Number(doc.data()?.updatedAt || 0),
				pages: mergeSiteContent(doc.data()?.pages as Partial<SiteContentMap>),
		  } satisfies SiteContentPayload)
		: await seedDefaultContent();

	memoryCache = {
		expiresAt: now + CACHE_TTL_MS,
		payload,
	};

	return payload;
}

export async function updateSitePageContent(
	pageKey: SitePageKey,
	pageContent: SiteContentMap[SitePageKey],
) {
	const current = await getSiteContent();
	const version = createVersion();
	const payload: SiteContentPayload = {
		version,
		updatedAt: Date.now(),
		pages: {
			...current.pages,
			[pageKey]: pageContent,
		},
	};

	await contentRef().set(
		{
			...payload,
			updatedAtServer: FieldValue.serverTimestamp(),
		},
		{ merge: true },
	);

	memoryCache = {
		expiresAt: Date.now() + CACHE_TTL_MS,
		payload,
	};

	return payload;
}

export function invalidateSiteContentCache() {
	memoryCache = null;
}
