import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { PaintingType, SellerType } from "@/app/_lib/customTypes";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CheckoutBody =
	| {
			orderType: "digital" | "physical";
			paintingId: string;
			licenseType?: "Personal" | "Commercial" | "Extended";
			shippingMethod?: "standard" | "express";
	  }
	| {
			orderType: "portrait";
			sellerId: string;
	  };

export async function POST(req: Request) {
	// const body = await req.json();

	// const session = await stripe.checkout.sessions.create({
	// 	mode: "payment",
	// 	line_items: [
	// 		{
	// 			price_data: {
	// 				currency: "inr",
	// 				product_data: {
	// 					name: "Painting Purchase",
	// 				},
	// 				unit_amount: body.amount * 100, // in paise
	// 			},
	// 			quantity: 1,
	// 		},
	// 	],

	// 	payment_intent_data: {
	// 		application_fee_amount: 500,

	// 		transfer_data: {
	// 			destination: body.accountId,
	// 		},
	// 	},

	// 	success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?session_id={CHECKOUT_SESSION_ID}`,
	// 	cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?cancelled=true`,
	// });
	const body: CheckoutBody = await req.json();

	if (body.orderType === "portrait") {
		const sellerSnap = await firebaseDB
			.collection("sellers")
			.doc(body.sellerId)
			.get();

		if (!sellerSnap.exists) {
			return Response.json(
				{ error: "Seller not found" },
				{ status: 404 },
			);
		}

		const seller = sellerSnap.data() as SellerType;

		if (!seller.makeSelfPortrait) {
			return Response.json(
				{ error: "Portraits not available" },
				{ status: 400 },
			);
		}

		if (!seller.stripeConnect) {
			return Response.json(
				{ error: "Seller payouts are not available yet" },
				{ status: 400 },
			);
		}

		const session = await stripe.checkout.sessions.create({
			mode: "payment",
			line_items: [
				{
					price_data: {
						currency: "usd",
						product_data: {
							name: `Custom portrait by ${seller.name}`,
						},
						unit_amount: Math.round(seller.portraitPrice * 100),
					},
					quantity: 1,
				},
			],
			payment_intent_data: {
				application_fee_amount: 500,
				transfer_data: { destination: seller.stripeConnect },
			},
			metadata: {
				orderType: "portrait",
				sellerId: seller.id,
			},
			success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/purchase/complete?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/purchase?cancelled=true`,
		});

		return Response.json({ url: session.url });
	}

	const paintingSnap = await firebaseDB
		.collection("paintings")
		.doc(body.paintingId)
		.get();
	if (!paintingSnap.exists) {
		return Response.json({ error: "Painting not found" }, { status: 404 });
	}

	const painting = paintingSnap.data() as PaintingType;

	const sellerSnap = await firebaseDB
		.collection("sellers")
		.doc(painting.sellerId)
		.get();

	if (!sellerSnap.exists) {
		return Response.json({ error: "Seller not found" }, { status: 404 });
	}

	const seller = sellerSnap.data() as SellerType;

	if (!seller.stripeConnect) {
		return Response.json(
			{ error: "Seller payouts are not available yet" },
			{ status: 400 },
		);
	}

	const licensePrices = {
		Personal: 45,
		Commercial: 150,
		Extended: 500,
	};

	const amount =
		body.orderType === "digital"
			? licensePrices[body.licenseType ?? "Commercial"]
			: painting.price;

	const session = await stripe.checkout.sessions.create({
		mode: "payment",
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: { name: painting.title },
					unit_amount: Math.round(amount * 100),
				},
				quantity: 1,
			},
		],
		payment_intent_data: {
			application_fee_amount: 500,
			transfer_data: {
				destination: seller.stripeConnect,
			},
		},
		metadata: {
			paintingId: painting.id,
			sellerId: painting.sellerId,
			orderType: body.orderType,
			licenseType: body.licenseType ?? "",
			shippingMethod: body.shippingMethod ?? "",
		},
		success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/purchase/complete?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/purchase?cancelled=true`,
	});

	return Response.json({
		url: session.url,
	});
}

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const sessionId = searchParams.get("session_id");

	if (!sessionId) {
		return Response.json({ error: "Missing session_id" }, { status: 400 });
	}

	const session = await stripe.checkout.sessions.retrieve(sessionId);

	return Response.json({
		status: session.payment_status,
	});
}
