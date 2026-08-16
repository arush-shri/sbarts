"use client";

import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import {
	DEFAULT_SITE_CONTENT,
	EDITABLE_SITE_ROUTES,
	SITE_CONTENT_CACHE_KEY,
	SiteContentMap,
	SiteContentPayload,
	SitePageContent,
	SitePageKey,
	mergeSiteContent,
} from "@/app/_lib/siteContent";
import { ShowToast } from "@/components/Toaster";
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

type CachedSiteContent = SiteContentPayload & {
	cachedAt: number;
};

type SiteContentContextType = {
	pages: SiteContentMap;
	version: string;
	loading: boolean;
	getPageContent: (pageKey: SitePageKey) => SitePageContent;
	updatePageContent: (
		pageKey: SitePageKey,
		content: SitePageContent,
	) => Promise<boolean>;
};

const SiteContentContext = createContext<SiteContentContextType>({
	pages: DEFAULT_SITE_CONTENT,
	version: "default",
	loading: true,
	getPageContent: (pageKey) => DEFAULT_SITE_CONTENT[pageKey],
	updatePageContent: async () => false,
});

function readCachedContent(): CachedSiteContent | null {
	if (typeof window === "undefined") return null;

	try {
		const raw = window.localStorage.getItem(SITE_CONTENT_CACHE_KEY);
		if (!raw) return null;

		const parsed = JSON.parse(raw) as Partial<CachedSiteContent>;
		if (!parsed.version || !parsed.pages) return null;

		return {
			version: String(parsed.version),
			updatedAt: Number(parsed.updatedAt || 0),
			cachedAt: Number(parsed.cachedAt || 0),
			pages: mergeSiteContent(
				parsed.pages as Partial<Record<SitePageKey, Partial<SitePageContent>>>,
			),
		};
	} catch (error) {
		console.error("Failed to read content cache:", error);
		return null;
	}
}

function writeCachedContent(payload: SiteContentPayload) {
	if (typeof window === "undefined") return;

	const nextCache: CachedSiteContent = {
		...payload,
		pages: mergeSiteContent(payload.pages),
		cachedAt: Date.now(),
	};

	window.localStorage.setItem(
		SITE_CONTENT_CACHE_KEY,
		JSON.stringify(nextCache),
	);
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
	const [pages, setPages] = useState<SiteContentMap>(DEFAULT_SITE_CONTENT);
	const [version, setVersion] = useState("default");
	const [loading, setLoading] = useState(true);

	const applyPayload = useCallback((payload: SiteContentPayload) => {
		const mergedPages = mergeSiteContent(payload.pages);
		setPages(mergedPages);
		setVersion(payload.version);
		writeCachedContent({
			...payload,
			pages: mergedPages,
		});
	}, []);

	const refreshContent = useCallback(async () => {
		const cached = readCachedContent();
		const cachedVersion = cached?.version || "default";

		try {
			const res = await fetch(
				`/api/site-content?version=${encodeURIComponent(cachedVersion)}`,
				{
					method: "GET",
					cache: "no-store",
				},
			);

			if (!res.ok) return;

			const json = await res.json();
			if (json.unchanged) {
				if (cached) {
					setPages(cached.pages);
					setVersion(cached.version);
				}
				return;
			}

			if (json.pages && json.version) {
				applyPayload({
					version: String(json.version),
					updatedAt: Number(json.updatedAt || Date.now()),
					pages: mergeSiteContent(json.pages),
				});
			}
		} catch (error) {
			console.error("Failed to refresh site content:", error);
		} finally {
			setLoading(false);
		}
	}, [applyPayload]);

	useEffect(() => {
		const cached = readCachedContent();
		if (cached) {
			setPages(cached.pages);
			setVersion(cached.version);
		}

		refreshContent();
	}, [refreshContent]);

	useEffect(() => {
		const handleStorage = (event: StorageEvent) => {
			if (event.key !== SITE_CONTENT_CACHE_KEY) return;

			const cached = readCachedContent();
			if (!cached) return;

			setPages(cached.pages);
			setVersion(cached.version);
		};

		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	const getPageContent = useCallback(
		(pageKey: SitePageKey) => pages[pageKey] || DEFAULT_SITE_CONTENT[pageKey],
		[pages],
	);

	const updatePageContent = useCallback(
		async (pageKey: SitePageKey, content: SitePageContent) => {
			const user = firebaseClientAuth.currentUser;
			if (!user) {
				ShowToast("Please sign in again to edit content.", 1);
				return false;
			}

			try {
				const token = await user.getIdToken();
				const res = await fetch("/api/site-content", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						pageKey,
						...content,
					}),
				});

				const json = await res.json();

				if (!res.ok) {
					ShowToast(json.error || "Unable to save page content.", 0);
					return false;
				}

				applyPayload({
					version: String(json.version),
					updatedAt: Number(json.updatedAt || Date.now()),
					pages: mergeSiteContent(json.pages),
				});
				ShowToast("Page content updated.", 2);
				return true;
			} catch (error) {
				console.error("Failed to save site content:", error);
				ShowToast("Unable to save page content.", 0);
				return false;
			}
		},
		[applyPayload],
	);

	const value = useMemo(
		() => ({
			pages,
			version,
			loading,
			getPageContent,
			updatePageContent,
		}),
		[pages, version, loading, getPageContent, updatePageContent],
	);

	return (
		<SiteContentContext.Provider value={value}>
			{children}
		</SiteContentContext.Provider>
	);
}

export function useSiteContent() {
	return useContext(SiteContentContext);
}

export function useEditablePageForPath(pathname: string | null) {
	if (!pathname) return null;
	return EDITABLE_SITE_ROUTES[pathname] || null;
}
