"use client";

import { useSiteContent } from "@/app/_context/SiteContentContext";
import { ReactElement, useEffect, useState } from "react";

export default function CountShowCard({
	styles,
}: {
	styles: string;
}): ReactElement {
	const { getPageContent } = useSiteContent();
	const [stats, setStats] = useState<{
		paintingCount: number;
		exhibitionCount: number;
	} | null>(null);

	useEffect(() => {
		const loadStats = async () => {
			try {
				const res = await fetch("/api/listing/helper");
				const json = await res.json();

				if (res.ok && json.success) {
					setStats(json.data);
				}
			} catch (error) {
				console.error(error);
			}
		};

		loadStats();
	}, []);

	const homeFields = getPageContent("home").fields || {};
	const exhibitionCount = homeFields.exhibitionCount?.trim()
		? homeFields.exhibitionCount
		: `${stats?.exhibitionCount ?? 0}`;

	return (
		<div className={styles}>
			{[
				[`${stats?.paintingCount ?? 0}`, "Original Artworks"],
				[exhibitionCount, "Exhibitions & Awards"],
				[homeFields.collectionCount || "5", "Gallery Collections"],
				[homeFields.missionCount || "1", "Global Mission"],
			].map(([value, label]) => (
				<div
					key={label}
					className="border-b border-[#d6ad58]/40 p-8 text-center last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0"
				>
					<strong className="block  text-5xl font-medium text-[#d6ad58]">
						{value}
					</strong>
					<span className="mt-2 block text-xs uppercase tracking-[.12em] text-white/70">
						{label}
					</span>
				</div>
			))}
		</div>
	);
}
