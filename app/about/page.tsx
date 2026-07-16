export default function AboutPage() {
	return (
		<main className="bg-[#f7f1e6] text-[#182033]">
			<section className="bg-[radial-gradient(circle_at_82%_20%,rgba(214,173,88,.2),transparent_30%),linear-gradient(135deg,#061a3d,#0b2b63)] py-10 text-white">
				<div className="mx-auto w-[min(1180px,calc(100%-40px))]">
					<h1 className="mt-2 heading-font font-bold text-5xl leading-tight text-[#d6ad58] md:text-7xl">
						About SB Arts
					</h1>
					<p className="mt-4 max-w-3xl text-lg text-white/75">
						Art rooted in careful observation, empathy,
						craftsmanship, and imagination.
					</p>
				</div>
			</section>

			<section className="bg-[#061a3d] py-20 text-white">
				<div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-center gap-10 lg:grid-cols-2">
					<div>
						<div className="text-xs font-bold uppercase tracking-[.22em] text-[#d6ad58]">
							Mission
						</div>
						<h2 className="mt-3  text-4xl leading-tight md:text-5xl">
							Observation can become empathy.
						</h2>
						<p className="mt-5 text-white/75">
							SB Arts explores hope, dignity, freedom, nature, and
							the human experience through drawing, design, and
							visual storytelling.
						</p>
						<p className="mt-4 text-white/75">
							Every piece is created with the belief that art has
							the power to connect, inspire, and create meaningful
							change.
						</p>
					</div>
					<div className="min-h-[420px] border border-[#d6ad58] bg-gradient-to-br from-[#d6ad58] to-[#0c2a62]" />
				</div>
			</section>

			<section className="py-20">
				<div className="mx-auto grid w-[min(1180px,calc(100%-40px))] border-y border-[#d6ad58]/40 bg-[#061a3d] sm:grid-cols-2 lg:grid-cols-4">
					{[
						["40+", "Original Artworks"],
						["10+", "Exhibitions & Awards"],
						["5", "Gallery Collections"],
						["1", "Global Mission"],
					].map(([value, label]) => (
						<div
							key={label}
							className="border-b border-[#d6ad58]/40 p-8 text-center text-white last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0"
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
			</section>
		</main>
	);
}
