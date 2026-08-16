"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageIntro from "./PageIntro";

const slides = [
	{
		title: "Hope & Dignity",
		copy: "Resilience, memory, and belonging.",
		image: "/images/hope.png",
	},
	{
		title: "Portrait",
		copy: "Character, identity, and emotion.",
		image: "/images/portrait.png",
	},
	{
		title: "Wildlife",
		copy: "The beauty and dignity of nature.",
		image: "/images/wildlife.png",
	},
];

export default function HomeHero() {
	const [active, setActive] = useState(0);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setActive((value) => (value + 1) % slides.length);
		}, 8000);

		return () => window.clearInterval(interval);
	}, []);

	const slide = slides[active];

	return (
		<section className="overflow-hidden bg-[#061a3d] text-white">
			<div className="mx-auto grid min-h-[650px] w-[min(1180px,calc(100%-40px))] items-center gap-12 py-18 lg:grid-cols-[1.02fr_.98fr] lg:py-22">
				<div>
					<PageIntro
						pageKey="home"
						titleClassName="heading-font font-bold text-5xl leading-[1.02] text-[#d6ad58] md:text-9xl"
						subtitleClassName="heading-font mt-4 text-2xl italic md:text-3xl"
						subtextClassName="heading-font mt-6 max-w-2xl text-xl md:text-2xl text-white/85"
					/>
					<div className="mt-8 flex flex-wrap gap-4">
						<Link
							href="/gallery"
							className="inline-flex items-center justify-center bg-[#d6ad58] px-6 py-4 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39]"
						>
							Explore Gallery
						</Link>
						<Link
							href="/competition"
							className="inline-flex items-center justify-center border border-[#d6ad58] px-6 py-4 text-sm font-bold uppercase tracking-[.06em] text-[#d6ad58] transition hover:bg-[#d6ad58] hover:text-[#061a3d]"
						>
							Enter Competition
						</Link>
					</div>
				</div>

				<div className="relative min-h-[430px] overflow-hidden border border-[#d6ad58]/40 shadow-[0_30px_80px_rgba(0,0,0,.35)] md:min-h-[480px]">
					<Image
						key={slide.image}
						src={slide.image}
						alt={`${slide.title} artwork`}
						fill
						sizes="(min-width: 1024px) 48vw, 100vw"
						className="object-cover"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#061a3d]/15 to-[#061a3d]/85" />
					<div className="absolute bottom-7 left-7 right-7">
						<h2 className=" text-3xl text-white">{slide.title}</h2>
						<p className="mt-1 text-white/75">{slide.copy}</p>
					</div>
					<div className="absolute bottom-6 right-6 flex gap-2">
						{slides.map((item, index) => (
							<button
								key={item.title}
								type="button"
								onClick={() => setActive(index)}
								className={`h-2.5 w-2.5 rounded-full border border-[#d6ad58] ${
									index === active
										? "bg-[#d6ad58]"
										: "bg-transparent"
								}`}
								aria-label={`Show ${item.title}`}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
