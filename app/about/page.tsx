"use client";

import { useSiteContent } from "@/app/_context/SiteContentContext";
import CountShowCard from "@/components/CountShowCard";
import PageIntro from "@/components/PageIntro";

export default function AboutPage() {
	const { getPageContent } = useSiteContent();
	const content = getPageContent("about");
	const missionLabel = content.fields?.missionLabel || "Mission";
	const missionTitle =
		content.fields?.missionTitle || "Observation can become empathy.";
	const missionSubtitle =
		content.fields?.missionSubtitle ||
		"SB Arts explores hope, dignity, freedom, nature, and the human experience through drawing, design, and visual storytelling.";
	const missionSubtext =
		content.fields?.missionSubtext ||
		"Every piece is created with the belief that art has the power to connect, inspire, and create meaningful change.";
	const artistStoryText = content.fields?.artistStoryText?.trim() || "";
	let artistStoryImages: string[] = [];
	try {
		const parsedImages = JSON.parse(content.fields?.artistStoryImages || "[]");
		if (Array.isArray(parsedImages)) {
			artistStoryImages = parsedImages.filter(
				(image): image is string => typeof image === "string" && image.length > 0,
			);
		}
	} catch {
		artistStoryImages = [];
	}

	return (
		<main className="bg-[#f7f1e6] text-[#182033]">
			<section className="bg-[#061a3d] py-10 text-white">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
					<PageIntro
						pageKey="about"
						titleClassName="mt-2 heading-font font-bold text-5xl leading-tight text-[#d6ad58] md:text-7xl"
						subtitleClassName="mt-4 max-w-3xl text-xl heading-font text-white/85"
						subtextClassName="mt-4 max-w-3xl text-lg text-white/75"
					/>
				</div>
			</section>

			<section className="bg-[#061a3d] py-20 text-white">
				<div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-center gap-10 lg:grid-cols-2">
					<div>
						<div className="text-xs font-bold uppercase tracking-[.22em] text-[#d6ad58]">
							{missionLabel}
						</div>
						<h2 className="mt-3 text-4xl leading-tight md:text-5xl">
							{missionTitle}
						</h2>
						<p className="mt-5 text-white/75">{missionSubtitle}</p>
						<p className="mt-4 text-white/75">{missionSubtext}</p>
					</div>
					<div className="relative min-h-[420px] overflow-hidden border border-[#d6ad58] bg-[#0c2a62]">
						<img
							src={
								content.fields?.featureImage ||
								"/images/wildlife.png"
							}
							alt="About SB Arts"
							className="absolute inset-0 h-full w-full object-cover"
						/>
					</div>
				</div>
			</section>

			{artistStoryText || artistStoryImages.length ? (
				<section className="py-20">
					<div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_180px] lg:gap-12">
						{artistStoryText ? (
							<div className="min-w-0 whitespace-pre-line break-words text-lg leading-relaxed text-[#6a7280] [overflow-wrap:anywhere]">
								{artistStoryText}
							</div>
						) : (
							<div />
						)}
						{artistStoryImages.length ? (
							<div className="min-w-0 grid justify-items-end gap-4">
								{artistStoryImages.map((image, index) => (
									<img
										key={`${image}-${index}`}
										src={image}
										alt=""
										className="h-32 w-[180px] object-cover"
									/>
								))}
							</div>
						) : null}
					</div>
				</section>
			) : null}

			<section className="py-20">
				<CountShowCard
					styles={
						"mx-auto grid w-[min(1180px,calc(100%-40px))] border-y border-[#d6ad58]/40 bg-[#061a3d] sm:grid-cols-2 lg:grid-cols-4"
					}
				/>
			</section>
		</main>
	);
}
