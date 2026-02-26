"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactElement, RefObject, useEffect, useRef, useState } from "react";

export default function Header(): ReactElement {
	const [show, setShow] = useState(true);
	const lastScrollY: RefObject<number> = useRef<number>(0);
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleResume: () => void = (): void => {};
	const handleContact: () => void = (): void => {};

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > lastScrollY.current) {
				// scrolling down
				setShow(false);
			} else {
				// scrolling up
				setShow(true);
			}

			lastScrollY.current = currentScrollY;
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 text-md ${
				show ? "translate-y-0" : "-translate-y-full"
			}`}
		>
			<div className="flex flex-col px-6 lg:px-20 py-2 items-center bg-[#fbfbfd] border-b-1 border-[#0000001A]">
				<div className="flex flex-row justify-between items-center w-full">
					<Link
						href="/"
						className="flex flex-row gap-x-2 cursor-pointer items-center h-13"
					>
						<Image
							src="/images/icon.png"
							alt="My logo"
							width={500}
							height={500}
							className="h-full w-auto object-contain"
						/>
						<span className="text-[#0F1724] font-bold text-xl sm:text-2xl">
							SBArts
						</span>
					</Link>
					<div className="hidden sm:flex items-center gap-3 w-1/2 lg:w-1/3 rounded-xl bg-[#f4f7ff] px-5 py-2.5">
						<Search className="w-6 h-6 text-gray-500" />
						<input
							type="text"
							placeholder="Search for art, photography..."
							className="w-full bg-transparent text-md placeholder:text-gray-500 text-black outline-none"
						/>
					</div>
					<div className="hidden lg:flex flex-row gap-x-5 items-center">
						<Link
							href="/explore"
							className="cursor-pointer transition-all hover:-translate-y-1 duration-200 ease-in-out 
                            hover:text-[#0F1724] text-[#98A0AB] font-medium text-md"
						>
							Explore
						</Link>
						<Link
							href="/#categories"
							className="cursor-pointer transition-all hover:-translate-y-1 duration-200 ease-in-out 
                            hover:text-[#0F1724] text-[#98A0AB] font-medium text-md"
						>
							Categories
						</Link>
						<div className="h-9 w-px bg-[#0000001A]" />
						<a
							href="/signIn"
							className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium hover:bg-gray-100 
                        transition-all hover:-translate-y-1 duration-200 ease-in-out text-md"
						>
							Sign In
						</a>
						<a
							href="/signUp"
							className="px-4 py-2 rounded-lg bg-[#0061f2] text-white font-semibold hover:bg-blue-700 
                        transition-all hover:-translate-y-1 duration-200 ease-in-out text-md"
						>
							Join Now
						</a>
					</div>

					<button
						onClick={() => setMobileOpen(!mobileOpen)}
						className="lg:hidden relative w-8 h-8 flex flex-col justify-center items-center group"
					>
						<span
							className={`absolute h-0.5 w-6 bg-[#0F1724] transition-all duration-300 ${
								mobileOpen ? "rotate-45" : "-translate-y-2"
							}`}
						/>
						<span
							className={`absolute h-0.5 w-6 bg-[#0F1724] transition-all duration-300 ${
								mobileOpen ? "opacity-0" : "opacity-100"
							}`}
						/>
						<span
							className={`absolute h-0.5 w-6 bg-[#0F1724] transition-all duration-300 ${
								mobileOpen ? "-rotate-45" : "translate-y-2"
							}`}
						/>
					</button>
				</div>
			</div>
			{mobileOpen && (
				<div className="lg:hidden flex flex-col gap-4 px-6 py-4 bg-[#fbfbfd] w-full rounded-b-xl">
					<div className="flex w-full items-center gap-3 rounded-xl bg-[#f4f7ff] px-5 py-3">
						<Search className="w-6 h-6 text-gray-500" />
						<input
							type="text"
							placeholder="Search for art, photography..."
							className="w-full bg-transparent text-md placeholder:text-gray-500 text-gray-700 outline-none"
						/>
					</div>
					<Link
						href="/explore"
						className="cursor-pointer transition-all hover:-translate-y-1 duration-200 ease-in-out 
                        hover:text-[#0F1724] text-[#98A0AB] font-medium text-md"
					>
						Explore
					</Link>
					<Link
						href="/#categories"
						className="cursor-pointer transition-all hover:-translate-y-1 duration-200 ease-in-out 
                        hover:text-[#0F1724] text-[#98A0AB] font-medium text-md"
					>
						Categories
					</Link>
					<div className="h-px w-full bg-[#0000001A]" />
					<a
						href="/signIn"
						className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-[#0F1724] font-medium hover:bg-gray-100 
                        transition-all hover:-translate-y-1 duration-200 ease-in-out text-md"
					>
						Sign In
					</a>
					<a
						href="/signUp"
						className="px-4 py-2 rounded-lg bg-[#0061f2] text-white font-semibold hover:bg-blue-700 
                        transition-all hover:-translate-y-1 duration-200 ease-in-out text-md"
					>
						Join Now
					</a>
				</div>
			)}
		</div>
	);
}
