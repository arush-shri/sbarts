import Image from "next/image";

export default function Poster() {
	return (
		<section className="bg-[#061a3d] py-16 text-white">
			<div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-center gap-8 md:grid-cols-[.8fr_1.2fr]">
				<div>
					<div className="text-xs font-bold uppercase tracking-[.22em] text-[#d6ad58]">
						Featured Poster
					</div>
					<h2 className="mt-3 text-4xl text-[#d6ad58]">
						SB Arts International Competition
					</h2>
					<p className="mt-4 max-w-lg text-white/75">
						Discover the story behind this year&apos;s call for
						young artists.
					</p>
				</div>
				<div className="mx-auto w-full max-w-[520px] overflow-hidden border border-[#d6ad58]/50 bg-[#0b254f]">
					<Image
						src="/images/poster.jpg"
						alt="SB Arts International Competition poster"
						width={1080}
						height={1080}
						className="h-auto w-full"
					/>
				</div>
			</div>
		</section>
	);
}
