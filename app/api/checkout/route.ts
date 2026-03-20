import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
	const body = await req.json();

	const session = await stripe.checkout.sessions.create({
		mode: "payment",
		line_items: [
			{
				price_data: {
					currency: "inr",
					product_data: {
						name: "Painting Purchase",
					},
					unit_amount: body.amount * 100, // in paise
				},
				quantity: 1,
			},
		],

		payment_intent_data: {
			application_fee_amount: 500,

			transfer_data: {
				destination: body.accountId,
			},
		},

		success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?cancelled=true`,
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
