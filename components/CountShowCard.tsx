"use client";

import { ReactElement, useEffect, useState } from "react";

export default function CountShowCard({
	styles,
}: {
	styles: string;
}): ReactElement {
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

	return (
		<div className={styles}>
			{[
				[`${stats?.paintingCount ?? 0}`, "Original Artworks"],
				[`${stats?.exhibitionCount ?? 0}`, "Exhibitions & Awards"],
				["5", "Gallery Collections"],
				["1", "Global Mission"],
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
