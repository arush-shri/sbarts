import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { SellerType } from "@/app/_lib/customTypes";
import { requireFirebaseUser } from "@/server/Auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function createStripeAccountLink(accountId: string) {
	return stripe.accountLinks.create({
		account: accountId,
		refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
		return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
		type: "account_onboarding",
	});
}

async function getSeller(req: NextRequest) {
	const decoded = await requireFirebaseUser(req);
	const sellerRef = firebaseDB.collection("sellers").doc(decoded.uid);
	const sellerSnap = await sellerRef.get();

	if (!sellerSnap.exists) {
		return null;
	}

	return {
		ref: sellerRef,
		data: sellerSnap.data() as SellerType,
	};
}

async function getAccountStatus(accountId: string) {
	try {
		const account = await stripe.accounts.retrieve(accountId);

		return {
			verified: Boolean(
				account.charges_enabled && account.payouts_enabled,
			),
		};
	} catch (err) {
		if (
			err instanceof Stripe.errors.StripeInvalidRequestError &&
			err.code === "resource_missing"
		) {
			return null;
		}

		throw err;
	}
}

export async function GET(req: NextRequest) {
	try {
		const seller = await getSeller(req);

		if (!seller) {
			return NextResponse.json(
				{ error: "Seller not found" },
				{ status: 404 },
			);
		}

		if (!seller.data.stripeConnect) {
			return NextResponse.json({
				hasAccount: false,
				verified: false,
				onboardingUrl: null,
			});
		}

		const status = await getAccountStatus(seller.data.stripeConnect);

		if (!status) {
			return NextResponse.json({
				hasAccount: false,
				verified: false,
				onboardingUrl: null,
			});
		}

		if (status.verified) {
			return NextResponse.json({
				hasAccount: true,
				verified: true,
				onboardingUrl: null,
			});
		}

		const accountLink = await createStripeAccountLink(
			seller.data.stripeConnect,
		);

		return NextResponse.json({
			hasAccount: true,
			verified: false,
			onboardingUrl: accountLink.url,
		});
	} catch (err) {
		console.error("Stripe status error:", err);

		return NextResponse.json(
			{ error: "Failed to check Stripe status" },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const stripeOnboardingEnabled =
			process.env.STRIPE_ONBOARDING_ENABLED === "true";

		if (!stripeOnboardingEnabled) {
			return NextResponse.json(
				{
					hasAccount: false,
					verified: false,
					onboardingUrl: null,
					onboardingEnabled: false,
				},
				{ status: 200 },
			);
		}

		const seller = await getSeller(req);

		if (!seller) {
			return NextResponse.json(
				{ error: "Seller not found" },
				{ status: 404 },
			);
		}

		let accountId = seller.data.stripeConnect;

		if (accountId) {
			const status = await getAccountStatus(accountId);

			if (status?.verified) {
				return NextResponse.json({
					hasAccount: true,
					verified: true,
					onboardingUrl: null,
				});
			}
			if (!status) accountId = undefined;
		}

		if (!accountId) {
			const account = await stripe.accounts.create({
				type: "express",
				email: seller.data.email,
				capabilities: {
					card_payments: { requested: true },
					transfers: { requested: true },
				},
			});

			accountId = account.id;

			await seller.ref.update({
				stripeConnect: account.id,
			});
		}

		const accountLink = await createStripeAccountLink(accountId);

		return NextResponse.json({
			hasAccount: true,
			verified: false,
			onboardingUrl: accountLink.url,
		});
	} catch (err) {
		console.error("Stripe onboarding error:", err);

		return NextResponse.json(
			{ error: "Failed to start Stripe onboarding" },
			{ status: 500 },
		);
	}
}
