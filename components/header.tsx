"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, ReactElement, useState } from "react";

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
	const router = useRouter();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [keyword, setKeyword] = useState("");

	const handleSearch = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const value = keyword.trim();
		if (!value) return;
		setMobileOpen(false);
		router.push(`/marketplace?keyword=${encodeURIComponent(value)}`);
	};

	return (
		<header className="sticky top-0 z-50 border-b border-[#d6ad58]/40 bg-[#061a3d]/95 backdrop-blur">
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
							className={`transition hover:text-[#d6ad58] ${
								pathname === item.href ? "text-[#d6ad58]" : ""
							}`}
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
										? "text-[#d6ad58]"
										: ""
								}
							>
								{item.label}
							</Link>
						))}
					</nav>
				</div>
			)}
		</header>
	);
}
