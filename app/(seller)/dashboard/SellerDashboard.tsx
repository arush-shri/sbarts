"use client";

import { useSellerContext } from "@/app/_context/SellerContext";
import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { SellerType } from "@/app/_lib/customTypes";
import Loading from "@/components/Loading";
import ProtectedPage from "@/components/ProtectedPage";
import {
	ListingsTable,
	SidebarProfile,
	StatsCards,
} from "@/components/SellerParts";
import { ShowToast } from "@/components/Toaster";
import { signOut } from "firebase/auth";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactElement, useEffect } from "react";

export default function SellerDashboard(): ReactElement {
	const router = useRouter();
	const {
		artistData,
		loading,
	}: { artistData: SellerType | null; loading: boolean } = useSellerContext();

	const verifyStripe = async () => {
		const res = await fetch(
			`/api/seller?accountId=${artistData?.stripeConnect}`,
		);
		const data = await res.json();

		if (!res.ok) {
			return false;
		}

		if (!data.verified) {
			ShowToast("Complete Stripe onboarding", 1);
			setTimeout(async () => {
				window.location.assign(data.onboardingUrl);
			}, 1200);
			await signOut(firebaseClientAuth);
			router.replace("/signIn");
			return false;
		}

		return true;
	};

	useEffect(() => {
		if (!loading && !artistData) {
			router.replace("/signIn");
		} else {
			verifyStripe();
		}
	}, [artistData, loading]);

	if (!artistData) return <Loading />;

	return (
		<ProtectedPage>
			<div className="min-h-screen bg-[#F8F9FA] px-5 md:px-20 pt-24 text-[#0F1724]">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Left Sidebar */}
					<SidebarProfile artistData={artistData} />

					{/* Right Content Area */}
					<main className="flex-1 space-y-8">
						<div className="flex justify-between items-center">
							<h1 className="text-2xl font-bold">
								Seller Dashboard
							</h1>
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
		</ProtectedPage>
	);
}
