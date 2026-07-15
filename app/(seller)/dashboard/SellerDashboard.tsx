"use client";

import { useSellerContext } from "@/app/_context/SellerContext";
import { SellerType } from "@/app/_lib/customTypes";
import Loading from "@/components/Loading";
import ProtectedPage from "@/components/ProtectedPage";
import {
	CompetitionManager,
	ListingsTable,
	SidebarProfile,
} from "@/components/SellerParts";
import { useRouter } from "next/navigation";
import { ReactElement, useEffect } from "react";

export default function SellerDashboard(): ReactElement {
	const router = useRouter();
	const {
		artistData,
		loading,
	}: { artistData: SellerType | null; loading: boolean } = useSellerContext();

	useEffect(() => {
		if (!loading && !artistData) {
			router.replace("/signIn");
		}
	}, [artistData, loading, router]);

	useEffect(() => {
		if (!artistData) return;
	}, [artistData]);

	if (!artistData) return <Loading />;

	return (
		<ProtectedPage>
			<div className="min-h-screen bg-[#F8F9FA] px-5 md:px-20 pt-10 text-[#0F1724]">
				<div className="flex flex-col gap-8">
					{/* Left Sidebar */}
					<div className="flex justify-end">
						<SidebarProfile artistData={artistData} />
					</div>

					{/* Right Content Area */}
					<main className="flex-1 space-y-8">
						<div className="rounded-2xl border border-[#0000001A] bg-white p-6">
							<CompetitionManager />
						</div>

						<div className="bg-white rounded-2xl border border-[#0000001A] overflow-hidden">
							<ListingsTable artworkIds={artistData.artWorks} />
						</div>
					</main>
				</div>
			</div>
		</ProtectedPage>
	);
}
