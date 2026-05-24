"use client";

import { useSellerContext } from "@/app/_context/SellerContext";
import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { SellerType } from "@/app/_lib/customTypes";
import { BUYING_ENABLED } from "@/app/_lib/featureFlags";
import Loading from "@/components/Loading";
import ProtectedPage from "@/components/ProtectedPage";
import {
	ListingsTable,
	SidebarProfile,
	StatsCards,
} from "@/components/SellerParts";
import { ShowToast } from "@/components/Toaster";
import { CreditCard, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactElement, useCallback, useEffect, useState } from "react";

type StripeStatus = {
	hasAccount: boolean;
	verified: boolean;
	onboardingUrl: string | null;
};

export default function SellerDashboard(): ReactElement {
	const router = useRouter();
	const {
		artistData,
		loading,
	}: { artistData: SellerType | null; loading: boolean } = useSellerContext();
	const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null);
	const [stripePromptDismissed, setStripePromptDismissed] = useState(false);
	const [stripeLoading, setStripeLoading] = useState(false);

	const stripePromptKey = artistData
		? `stripePromptDismissed:${artistData.id}:${artistData.stripeConnect || "missing"}`
		: "";

	const fetchStripeStatus = useCallback(async () => {
		const token = await firebaseClientAuth.currentUser?.getIdToken();

		if (!token) {
			setStripeStatus(null);
			return;
		}

		const res = await fetch("/api/seller/stripe", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!res.ok) {
			setStripeStatus(null);
			return;
		}

		const data = (await res.json()) as StripeStatus;
		setStripeStatus(data);
	}, []);

	const startStripeOnboarding = async () => {
		setStripeLoading(true);

		try {
			const token = await firebaseClientAuth.currentUser?.getIdToken();

			if (!token) {
				ShowToast("Please sign in again to connect Stripe", 1);
				return;
			}

			const res = await fetch("/api/seller/stripe", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data = (await res.json()) as StripeStatus;

			if (!res.ok) {
				ShowToast("Unable to start Stripe onboarding", 1);
				return;
			}

			setStripeStatus(data);

			if (data.onboardingUrl) {
				window.location.assign(data.onboardingUrl);
			}
		} finally {
			setStripeLoading(false);
		}
	};

	const dismissStripePrompt = () => {
		setStripePromptDismissed(true);

		if (stripePromptKey) {
			window.localStorage.setItem(stripePromptKey, "true");
		}
	};

	useEffect(() => {
		if (!loading && !artistData) {
			router.replace("/signIn");
		}
	}, [artistData, loading, router]);

	useEffect(() => {
		if (!artistData || !stripePromptKey) return;

		setStripePromptDismissed(
			window.localStorage.getItem(stripePromptKey) === "true",
		);
		fetchStripeStatus();
	}, [artistData, fetchStripeStatus, stripePromptKey]);

	if (!artistData) return <Loading />;

	const showStripePrompt =
		BUYING_ENABLED &&
		Boolean(stripeStatus) &&
		!stripeStatus?.verified &&
		!stripePromptDismissed;

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

						{showStripePrompt && (
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[#BFD7FF] bg-[#F0F7FF] p-5">
								<div className="flex gap-3">
									<div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#0066FF]">
										<CreditCard className="h-auto w-5" />
									</div>
									<div>
										<h2 className="text-sm font-bold">
											{stripeStatus?.hasAccount
												? "Finish Stripe setup"
												: "Create Stripe account"}
										</h2>
										<p className="mt-1 text-sm text-[#64748B]">
											Connect Stripe when you are ready to
											accept payments and receive payouts.
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2 self-start sm:self-center">
									<button
										type="button"
										onClick={startStripeOnboarding}
										disabled={stripeLoading}
										className="rounded-lg bg-[#0066FF] px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
									>
										{stripeLoading
											? "Starting..."
											: stripeStatus?.hasAccount
												? "Continue"
												: "Create"}
									</button>
									<button
										type="button"
										onClick={dismissStripePrompt}
										aria-label="Dismiss Stripe prompt"
										className="rounded-lg border border-[#0000001A] bg-white p-2 text-[#64748B] transition hover:text-[#0F1724]"
									>
										<X className="h-auto w-5" />
									</button>
								</div>
							</div>
						)}

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
