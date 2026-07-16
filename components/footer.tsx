import Link from "next/link";
import { ReactElement } from "react";

export default function Footer(): ReactElement {
	return (
		<footer className="bg-[#031126] py-9 text-white/70">
			<div className="mx-auto flex w-[min(1180px,calc(100%-40px))] flex-col gap-5 md:flex-row md:items-center md:justify-between">
				<div>
					<div className=" text-xl font-bold text-[#d6ad58]">
						SB Arts
					</div>
					<p className="mt-2 text-sm">
						Art for Hope, Dignity & Freedom
					</p>
				</div>
				<nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
					<Link href="/gallery" className="hover:text-[#d6ad58]">
						Gallery
					</Link>
					<Link href="/marketplace" className="hover:text-[#d6ad58]">
						Marketplace
					</Link>
					<Link href="/competition" className="hover:text-[#d6ad58]">
						Competition
					</Link>
					<Link href="/contact" className="hover:text-[#d6ad58]">
						Contact
					</Link>
				</nav>
				<div className="text-sm">msbart.com</div>
			</div>
		</footer>
	);
}
