import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { FieldValue } from "firebase-admin/firestore";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
	const rawBody = await req.text();
	const signature = req.headers.get("stripe-signature");

	if (!signature) {
		return new Response("Missing signature", { status: 400 });
	}

	const event = stripe.webhooks.constructEvent(
		rawBody,
		signature,
		process.env.STRIPE_WEBHOOK_SECRET!,
	);

	if (event.type === "checkout.session.completed") {
		const session = event.data.object as Stripe.Checkout.Session;

		await firebaseDB.runTransaction(async (tx) => {
			const paymentRef = firebaseDB
				.collection("payments")
				.doc(session.id);
			const existingPayment = await tx.get(paymentRef);

			if (existingPayment.exists) return;

			const orderType = session.metadata?.orderType;
			const sellerId = session.metadata?.sellerId;

			if (!sellerId || !orderType) {
				throw new Error("Missing order metadata");
			}

			if (orderType === "portrait") {
				const orderRef = firebaseDB.collection("orders").doc();
				const paymentRef = firebaseDB
					.collection("payments")
					.doc(session.id);

				tx.set(paymentRef, {
					stripeId: session.id,
					amount: session.amount_total,
					status: session.payment_status,
					createdAt: Date.now(),
				});

				tx.set(orderRef, {
					paymentId: paymentRef.id,
					sellerId,
					orderType: "portrait",
					createdAt: Date.now(),
				});

				tx.update(firebaseDB.collection("sellers").doc(sellerId), {
					orderIds: FieldValue.arrayUnion(orderRef.id),
					itemSold: FieldValue.increment(1),
					totalSale: FieldValue.increment(
						(session.amount_total ?? 0) / 100,
					),
				});

				return;
			}

			const paintingId = session.metadata?.paintingId;
			if (!paintingId) throw new Error("Missing paintingId");

			const paintingRef = firebaseDB
				.collection("paintings")
				.doc(paintingId);
			const paintingSnap = await tx.get(paintingRef);

			if (!paintingSnap.exists) throw new Error("Painting not found");

			const painting = paintingSnap.data()!;

			if (painting.quantity <= 0) {
				throw new Error("Out of stock");
			}

			const orderRef = firebaseDB.collection("orders").doc();

			tx.set(paymentRef, {
				stripeId: session.id,
				amount: session.amount_total,
				status: session.payment_status,
				createdAt: Date.now(),
			});

			tx.set(orderRef, {
				paymentId: paymentRef.id,
				paintingId,
				sellerId: session.metadata?.sellerId,
				orderType: session.metadata?.orderType,
				createdAt: Date.now(),
			});

			tx.update(paintingRef, {
				quantity: FieldValue.increment(-1),
				purchases: FieldValue.increment(1),
			});

			tx.update(
				firebaseDB
					.collection("sellers")
					.doc(session.metadata!.sellerId!),
				{
					orderIds: FieldValue.arrayUnion(orderRef.id),
					itemSold: FieldValue.increment(1),
					totalSale: FieldValue.increment(
						(session.amount_total ?? 0) / 100,
					),
				},
			);
		});
	}

	return new Response("ok");
}
