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
			<div className="min-h-screen bg-[#f7f1e6] px-5 py-8 md:px-10 lg:px-20 lg:py-10 text-[#182033]">
				<div className="mx-auto flex max-w-7xl flex-col gap-8">
					<div className="flex justify-end">
						<SidebarProfile artistData={artistData} />
					</div>

					<main className="flex-1 space-y-8">
						<div className="rounded-[28px] border border-[#061a3d]/12 bg-[radial-gradient(circle_at_top_left,rgba(214,173,88,.16),transparent_40%),white] p-6 shadow-[0_20px_60px_rgba(6,26,61,.08)]">
							<CompetitionManager />
						</div>

						<div className="overflow-hidden rounded-[28px] border border-[#061a3d]/12 bg-white shadow-[0_20px_60px_rgba(6,26,61,.08)]">
							<ListingsTable artworkIds={artistData.artWorks} />
						</div>
					</main>
				</div>
			</div>
		</ProtectedPage>
	);
}
