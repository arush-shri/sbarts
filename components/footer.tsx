import { Copyright } from "lucide-react";
import Image from "next/image";
import { ReactElement } from "react";

//TO CHANGE IN PRODUCTION
export default function Footer(): ReactElement {
	return (
		<div className="flex flex-col px-5 lg:px-20 bg-[#fbfbfd] w-full py-6 border-t-1 border-[#0000001A] justify-center">
			<div className="justify-between flex flex-col md:flex-row gap-x-2 gap-y-3">
				<section className="flex flex-col md:max-w-2/5">
					<div className="flex flex-row gap-x-2 items-center h-13">
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
					</div>
					<span className="text-[#6b7280] pt-5 text-md ">
						The world's most accessible marketplace for buying and
						selling unique digital and physical art.
					</span>
				</section>
				<section className="flex flex-wrap md:flex-row justify-between gap-3 w-full md:w-1/2">
					<div className="flex flex-col">
						<span className="text-[#0F1724] font-semibold text-lg md:text-xl">
							Marketplace
						</span>
						<div className="flex flex-col gap-y-3">
							<a
								href="/"
								className="text-[#6b7280] pt-3 text-md hover:text-[#0F1724]"
							>
								All Art
							</a>
							<a
								href="/"
								className="text-[#6b7280] text-md hover:text-[#0F1724]"
							>
								Digital Art
							</a>
							<a
								href="/"
								className="text-[#6b7280] text-md hover:text-[#0F1724]"
							>
								Painting
							</a>
							<a
								href="/"
								className="text-[#6b7280] text-md hover:text-[#0F1724]"
							>
								Photography
							</a>
						</div>
					</div>
					<div className="flex flex-col">
						<span className="text-[#0F1724] font-semibold text-lg md:text-xl">
							For Sellers
						</span>
						<div className="flex flex-col gap-y-3">
							<a
								href="/"
								className="text-[#6b7280] pt-3 text-md hover:text-[#0F1724]"
							>
								Sell Your Art
							</a>
							<a
								href="/"
								className="text-[#6b7280] text-md hover:text-[#0F1724]"
							>
								Seller Guidelines
							</a>
							<a
								href="/"
								className="text-[#6b7280] text-md hover:text-[#0F1724]"
							>
								Seller Dashboard
							</a>
						</div>
					</div>
					<div className="flex flex-col">
						<span className="text-[#0F1724] font-semibold text-lg md:text-xl">
							Legal
						</span>
						<div className="flex flex-col gap-y-3">
							<a
								href="/termsAndConditions"
								className="text-[#6b7280] pt-3 text-md hover:text-[#0F1724]"
							>
								Terms & Conditions
							</a>
							<a
								href="/privacyPolicy"
								className="text-[#6b7280] text-md hover:text-[#0F1724]"
							>
								Privacy Policy
							</a>
						</div>
					</div>
				</section>
			</div>
			<div className="flex flex-row gap-x-2 items-center self-center mt-6">
				<Copyright className="w-4 text-[#6b7280]" />
				<span className="text-[#6b7280] text-sm">
					2026 SBArts. All Rights Reserved.
				</span>
			</div>
		</div>
	);
}
