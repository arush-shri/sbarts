"use client";

import { useSellerContext } from "@/app/_context/SellerContext";
import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { CompetitionManagerRef, SellerType } from "@/app/_lib/customTypes";
import Loading from "@/components/Loading";
import ProtectedPage from "@/components/ProtectedPage";
import {
	CompetitionButton,
	CompetitionManager,
	ListingsTable,
} from "@/components/SellerParts";
import { signOut } from "@firebase/auth";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactElement, useEffect, useRef } from "react";

export default function SellerDashboard(): ReactElement {
	const router = useRouter();
	const managerRef = useRef<CompetitionManagerRef>(null);
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

	const isAdmin = artistData?.admin === true || artistData?.isAdmin === true;

	const handleLogout = async () => {
		try {
			await signOut(firebaseClientAuth);
			router.replace("/signIn");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	if (!artistData) return <Loading />;

	return (
		<ProtectedPage>
			<div className="min-h-screen bg-[#f7f1e6] px-5 py-8 md:px-10 lg:px-20 lg:py-10 text-[#182033]">
				<div className="mx-auto flex max-w-7xl flex-col gap-8">
					<div className="flex justify-end">
						<div className="flex flex-col gap-3 lg:flex-row">
							<button
								onClick={() => router.push("/listing")}
								className="inline-flex items-center justify-center gap-2 bg-[#d6ad58] px-3 py-2 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:bg-[#b88d39]"
							>
								<Plus className="h-auto w-5" /> Add New Listing
							</button>
							{isAdmin ? (
								<CompetitionButton managerRef={managerRef} />
							) : null}
							<button
								onClick={handleLogout}
								className="border border-[#061a3d]/15 bg-white px-3 py-2 text-sm font-bold uppercase tracking-[.06em] text-[#061a3d] transition hover:border-[#d6ad58] hover:text-[#d6ad58]"
							>
								Sign Out
							</button>
						</div>
					</div>

					<main className="flex-1 space-y-8">
						{isAdmin ? (
							<div className="overflow-hidden border border-[#061a3d]/12 bg-white shadow-[0_20px_60px_rgba(6,26,61,.08)]">
								<CompetitionManager ref={managerRef} />
							</div>
						) : null}

						<div className="overflow-hidden border border-[#061a3d]/12 bg-white shadow-[0_20px_60px_rgba(6,26,61,.08)]">
							<ListingsTable
								artworkIds={artistData.artWorks}
								showAll={isAdmin}
							/>
						</div>
					</main>
				</div>
			</div>
		</ProtectedPage>
	);
}
