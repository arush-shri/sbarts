import CategoryCard from "@/components/CategoryCard";
import FeaturedArtworks from "@/components/FeaturedArtworks";
import Image from "next/image";

export default function Home() {
	return (
		<div className="flex flex-col bg-white">
			<section className="flex flex-col md:flex-row items-center justify-between px-5 lg:px-20 gap-x-7">
				<div className="flex w-full md:w-1/2 flex-col justify-start pt-14 md:pt-28 order-2 md:order-1">
					<span className="font-bold text-[#0F1724] text-4xl md:text-5xl">
						Discover & Collect Extraordinary Art
					</span>
					<span className="text-[#98A0AB] text-xl pt-4 md:pt-3">
						The premier marketplace for digital art, paintings,
						photography, and portraits. Connect with creators
						worldwide.
					</span>

					<div className="flex flex-row w-full gap-x-3 pt-9 md:pt-13 items-center">
						<a
							href="/explore"
							className="px-4 py-2 rounded-lg bg-[#0061f2] text-white font-semibold hover:bg-blue-700 
                            transition-all hover:-translate-y-1 duration-200 ease-in-out text-md"
						>
							Start Exploring
						</a>
						<a
							href="/signUp"
							className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium hover:bg-gray-100 
                            transition-all hover:-translate-y-1 duration-200 ease-in-out text-md"
						>
							Sell Your Art
						</a>
					</div>
				</div>
				<div
					className="flex w-full md:w-1/2 flex-col justify-center items-center 
                    md:items-end pt-23 order-1 md:order-2"
				>
					<Image
						className="rounded-full md:rounded-xl w-full aspect-square md:aspect-auto object-cover"
						src="/images/bgHome.jpg"
						alt="My pic"
						width={1184}
						height={864}
						priority
					/>
				</div>
			</section>
			<section
				id="categories"
				className="flex flex-col justify-center px-5 lg:px-20 mt-15 md:mt-36"
			>
				<span className="font-bold text-[#0F1724] text-3xl">
					Browse by Category
				</span>
				<span className="text-[#98A0AB] text-lg mt-2 ">
					Explore our curated collection of digital art, paintings,
					photography, and portraits.
				</span>
				<div className="flex flex-wrap gap-y-3 w-full mt-10 justify-between">
					<CategoryCard
						uri="/images/digCat.jpg"
						category="Digital Art"
						path="/explore?category=Digital Art"
					/>
					<CategoryCard
						uri="/images/paiCat.jpg"
						category="Paintings"
						path="/explore?category=Paintings"
					/>
					<CategoryCard
						uri="/images/phoCat.jpg"
						category="Photography"
						path="/explore?category=Photography"
					/>
					<CategoryCard
						uri="/images/selCat.jpg"
						category="Self Portrait"
						path="/purchase?orderType=portrait"
					/>
				</div>
			</section>

			<FeaturedArtworks />

			<section className="flex flex-col sm:flex-row justify-center gap-5 py-14 px-5 lg:px-20 mt-15 md:mt-36 mb-20 bg-[#f4f7ff]">
				<div className="flex flex-col justify-center items-start gap-y-3 order-2 sm:order-1">
					<span className="font-bold text-[#0F1724] text-3xl">
						Ready to sell your art?
					</span>
					<span className="text-[#98A0AB] text-lg mt-2 ">
						Join thousands of artists selling digital and physical
						artworks. Simple setup, secure payments, and a global
						audience.
					</span>
					<a
						href="/signUp"
						className="px-4 py-2 rounded-lg bg-[#0061f2] text-white font-medium hover:bg-blue-700 
                            transition-all hover:-translate-y-1 duration-200 ease-in-out text-md"
					>
						Create Seller Account
					</a>
				</div>
				<Image
					className="rounded-lg w-full sm:w-1/3 aspect-4/2 sm:aspect-4/3 object-cover self-center sm:self-center order-1 sm:order-2"
					src="/images/phoCat.jpg"
					alt="My pic"
					width={1184}
					height={864}
					priority
				/>
			</section>
		</div>
	);
}
