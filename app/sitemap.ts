import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://msbart.com";

export default function sitemap(): MetadataRoute.Sitemap {
	const routes = [
		"/",
		"/about",
		"/gallery",
		"/explore",
		"/marketplace",
		"/competition",
		"/contact",
		"/gallery/hope",
		"/gallery/portrait",
		"/gallery/wildlife",
		"/gallery/high-altitude",
		"/gallery/design",
	];

	return routes.map((route) => ({
		url: `${siteUrl}${route}`,
		changeFrequency: route === "/" ? "weekly" : "monthly",
		priority: route === "/" ? 1 : route === "/gallery" ? 0.9 : 0.7,
	}));
}
