"use client";

import { useEditablePageForPath } from "@/app/_context/SiteContentContext";
import { useSellerContext } from "@/app/_context/SellerContext";
import { Edit3, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement, useState } from "react";
import SiteContentEditor from "./SiteContentEditor";

const navItems = [
	{ href: "/", label: "Home" },
	{ href: "/gallery", label: "Gallery" },
	{ href: "/marketplace", label: "Marketplace" },
	{ href: "/competition", label: "Competition" },
	{ href: "/about", label: "About" },
	{ href: "/contact", label: "Contact" },
];

export default function Header(): ReactElement {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [editorOpen, setEditorOpen] = useState(false);
	const pageKey = useEditablePageForPath(pathname);
	const { authenticated, loading } = useSellerContext();
	const canEditPage = authenticated && !loading && pageKey;

	return (
		<header className="sticky top-0 z-50 bg-[#061a3d] backdrop-blur">
			<div className="mx-auto flex min-h-[78px] w-[min(1180px,calc(100%-40px))] items-center justify-between gap-5">
				<Link href="/" className="flex items-center gap-3 text-white">
					<Image
						src="/images/logo.png"
						alt="SB Arts logo"
						width={58}
						height={58}
						className="h-[58px] w-[58px] rounded-xl object-contain"
						priority
					/>
					<div>
						<strong className="block  text-2xl font-bold tracking-[.08em] text-[#d6ad58]">
							SB ARTS
						</strong>
						<span className="block text-[10px] uppercase tracking-[.13em] text-[#ece7dd]">
							Art for Hope, Dignity & Freedom
						</span>
					</div>
				</Link>

				<nav className="hidden items-center gap-5 text-sm text-white lg:flex">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={`relative pb-2 transition-colors duration-300 hover:text-[#d6ad58]
		after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full
		after:origin-left after:scale-x-0 after:bg-[#d6ad58]
		after:transition-transform after:duration-300 hover:after:scale-x-100
		${pathname === item.href ? "text-[#d6ad58] after:scale-x-100" : ""}`}
						>
							{item.label}
						</Link>
					))}
				</nav>

				<button
					type="button"
					onClick={() => setMobileOpen((value) => !value)}
					className="grid h-10 w-10 place-items-center text-white lg:hidden"
					aria-label="Open menu"
				>
					{mobileOpen ? (
						<X className="h-6 w-6" />
					) : (
						<Menu className="h-6 w-6" />
					)}
				</button>
			</div>

			{mobileOpen && (
				<div className="border-t border-[#d6ad58]/30 bg-[#061a3d] px-5 py-5 lg:hidden">
					<nav className="flex flex-col gap-4 text-sm text-white">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setMobileOpen(false)}
								className={
									pathname === item.href
										? "text-[#d6ad58] border-b"
										: ""
								}
							>
								{item.label}
							</Link>
						))}
					</nav>
				</div>
			)}
			{canEditPage ? (
				<button
					type="button"
					onClick={() => setEditorOpen(true)}
					className="absolute right-16 top-[19px] grid h-10 w-10 place-items-center border border-[#d6ad58]/60 bg-[#061a3d] text-[#d6ad58] shadow-[0_10px_24px_rgba(0,0,0,.2)] transition hover:bg-[#d6ad58] hover:text-[#061a3d] lg:right-4"
					aria-label="Edit page text"
					title="Edit page text"
				>
					<Edit3 className="h-4 w-4" />
				</button>
			) : null}
			<SiteContentEditor
				pageKey={pageKey}
				open={editorOpen}
				onClose={() => setEditorOpen(false)}
			/>
		</header>
	);
}
