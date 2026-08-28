import { ART_CATEGORIES } from "@/app/_lib/artCategories";
import CountShowCard from "@/components/CountShowCard";
import FeaturedArtworks from "@/components/FeaturedArtworks";
import HomeHero from "@/components/HomeHero";
import { CompetetionCard } from "@/components/HomeParts";
import Poster from "@/components/Poster";
import Image from "next/image";
import Link from "next/link";

const collections = [
	{
		id: "hope",
		title: ART_CATEGORIES[0],
		image: "/images/hope.png",
		className: "from-[#d6ad58] to-[#0c2a62]",
	},
	{
		id: "portrait",
		title: ART_CATEGORIES[1],
		image: "/images/portrait.png",
		className: "from-[#b9a190] to-[#463029]",
	},
	{
		id: "wildlife",
		title: ART_CATEGORIES[2],
		image: "/images/wildlife.png",
		className: "from-[#304b36] to-[#b39250]",
	},
	{
		id: "high-altitude",
		title: ART_CATEGORIES[3],
		image: "/images/altitude.png",
		className: "from-[#a4bfd8] to-[#112957]",
	},
	{
		id: "design",
		title: ART_CATEGORIES[4],
		image: "/images/design.png",
		className: "from-[#0f2e67] to-[#d6ad58]",
	},
];

export default function Home() {
	return (
		<main className="bg-[#f7f1e6] text-[#182033]">
			<HomeHero />

			<section className="relative z-10 -mt-10">
				<CompetetionCard />
			</section>

			<Poster />

			<section className="py-20">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
					<div className="mx-auto mb-9 max-w-3xl text-center">
						<div className="text2xl md:text-3xl font-bold uppercase tracking-[.22em] text-[#b88d39]">
							Explore the Gallery
						</div>
						<h2 className="mt-2 leading-tight text-[#061a3d] text-lg md:text-xl">
							Five Collections
						</h2>
						<p className="mt-3 text-lg md:text-xl text-[#6a7280]">
							Distinct bodies of work connected by observation,
							empathy, craft, and meaning.
						</p>
					</div>

					<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
						{collections.map((collection) => (
							<Link key={collection.id} href="/gallery">
								<article className="border border-[#061a3d]/12 bg-white shadow-[0_18px_50px_rgba(6,26,61,.12)] cursor-pointer transition duration-300 hover:scale-105 origin-center h-full">
									<div
										className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${collection.className}`}
									>
										<Image
											src={collection.image}
											alt={collection.title}
											fill
											className="object-cover"
										/>
									</div>
									<div className="p-5 text-center">
										<h3 className=" text-xl font-medium text-[#061a3d]">
											{collection.title}
										</h3>
									</div>
								</article>
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className="bg-[#061a3d] py-20 text-white">
				<CountShowCard
					styles={
						"mx-auto grid w-[min(1180px,calc(100%-40px))] border-y border-[#d6ad58]/40 sm:grid-cols-2 lg:grid-cols-4"
					}
				/>
			</section>

			<FeaturedArtworks />
		</main>
	);
}
