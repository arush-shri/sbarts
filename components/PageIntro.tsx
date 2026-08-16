"use client";

import { SitePageKey } from "@/app/_lib/siteContent";
import { useSiteContent } from "@/app/_context/SiteContentContext";

type PageIntroProps = {
	pageKey: SitePageKey;
	titleClassName: string;
	subtitleClassName?: string;
	subtextClassName?: string;
};

export default function PageIntro({
	pageKey,
	titleClassName,
	subtitleClassName,
	subtextClassName,
}: PageIntroProps) {
	const { getPageContent } = useSiteContent();
	const content = getPageContent(pageKey);

	return (
		<>
			<h1 className={titleClassName} suppressHydrationWarning>
				{content.title}
			</h1>
			{content.subtitle && subtitleClassName ? (
				<p className={subtitleClassName} suppressHydrationWarning>
					{content.subtitle}
				</p>
			) : null}
			{content.subtext && subtextClassName ? (
				<p className={subtextClassName} suppressHydrationWarning>
					{content.subtext}
				</p>
			) : null}
		</>
	);
}
