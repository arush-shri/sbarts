import CountShowCard from "@/components/CountShowCard";
import CategoryCollectionCards from "@/components/CategoryCollectionCards";
import FeaturedArtworks from "@/components/FeaturedArtworks";
import HomeHero from "@/components/HomeHero";
import { CompetetionCard } from "@/components/HomeParts";
import Poster from "@/components/Poster";

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

					<CategoryCollectionCards />
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
