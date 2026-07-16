"use client";

import { CompetitionEntry } from "@/app/_lib/customTypes";
import Image from "next/image";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";

export function CompetetionCard(): ReactElement {
	const [competition, setCompetition] = useState<CompetitionEntry | null>(
		null,
	);
	const [compLoading, setCompLoading] = useState(true);

	const isFutureDate = (dateStr: string) => {
		const [day, month, year] = dateStr.split("/").map(Number);

		const date = new Date(year, month - 1, day);
		date.setHours(0, 0, 0, 0);

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return date > today;
	};

	useEffect(() => {
		const loadCompetition = async () => {
			try {
				const res = await fetch("/api/competition");
				const json = await res.json();
				console.log("Data: ", json.data);
				if (res.ok && json.data) {
					if (isFutureDate(json.data.entriesOpen)) {
						setCompetition(json.data);
					}
				}
			} catch (error) {
				console.error(error);
			} finally {
				setCompLoading(false);
			}
		};

		loadCompetition();
	}, []);
	console.log(competition);
	return competition ? (
		<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
			<div className="grid items-center gap-6 border border-[#d6ad58] bg-[#061a3d] p-7 text-white shadow-[0_18px_50px_rgba(6,26,61,.15)] md:grid-cols-[auto_1fr_auto]">
				<div className="grid h-24 w-24 place-items-center">
					<Image
						src="/svg/globe.svg"
						alt="SB Arts"
						width={88}
						height={88}
					/>
				</div>
				<div>
					<div className="text-xs font-bold uppercase tracking-[.22em] text-[#d6ad58]">
						Entries Now Open
					</div>
					<h2 className="mt-1  text-3xl leading-tight">
						SB Arts International Juried Competition
					</h2>
					<p className="mt-1 text-white/75">
						Arts for Hope, Dignity & Freedom, for high school
						students worldwide.
					</p>
				</div>
				<Link
					href="/competition"
					className="inline-flex items-center justify-center bg-[#d6ad58] px-6 py-4 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39]"
				>
					Learn More
				</Link>
			</div>
		</div>
	) : (
		<></>
	);
}
