import { useSellerContext } from "@/app/_context/SellerContext";
import { SellerType } from "@/app/_lib/customTypes";
import {
	ListingsTable,
	SidebarProfile,
	StatsCards,
} from "@/components/SellerParts";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { ReactElement } from "react";

export default function SellerDashboard({
	sellerId,
}: {
	sellerId: string;
}): ReactElement {
	const sellers: SellerType[] = useSellerContext();

	const artistData: SellerType | undefined = sellers.find(
		(seller) => seller.id === sellerId,
	);

	if (!artistData) notFound();

	return (
		<div className="min-h-screen bg-[#F8F9FA] px-5 md:px-20 pt-24 text-[#0F1724]">
			<div className="flex flex-col lg:flex-row gap-8">
				{/* Left Sidebar */}
				<SidebarProfile artistData={artistData} />

				{/* Right Content Area */}
				<main className="flex-1 space-y-8">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-bold">Seller Dashboard</h1>
						<a
							href="/listing"
							className="bg-[#007AFF] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 
                            hover:bg-blue-600 transition-colors shadow-sm text-sm"
						>
							<Plus className="h-auto w-6" /> Add New Listing
						</a>
					</div>

					<StatsCards
						totalSale={artistData.totalSale}
						totalListing={artistData.artWorks.length}
						itemSold={artistData.itemSold}
					/>

					<div className="bg-white rounded-2xl border border-[#0000001A] overflow-hidden">
						<ListingsTable artworkIds={artistData.artWorks} />
					</div>
				</main>
			</div>
		</div>
	);
}
