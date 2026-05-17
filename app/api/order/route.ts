import { firebaseDB } from "@/app/_firebase/firebaseDb";
import {
	handleDigital,
	handlePhysical,
	handlePortrait,
	validateOrder,
} from "@/server/OrderHandler";

export async function POST(req: Request) {
	try {
		return new Response("Order creation moved to Stripe webhook", {
			status: 410,
		});
		const formData = await req.formData();

		const data: Record<string, any> = {};

		formData.forEach((value, key) => {
			// ✅ Handle File vs string
			if (value instanceof File) {
				data[key] = value; // keep file as-is
			} else {
				data[key] = value.toString();
			}
		});

		// Now you can use data normally
		const painting = await validateOrder(data);

		const paymentRef = await firebaseDB.collection("payments").add({
			...data,
			stripeId: data.sessionId,
			amount: Number(data.amount),
			createdAt: Date.now(),
		});

		await firebaseDB
			.collection("paintings")
			.doc(data.id)
			.update({
				quantity: painting.quantity - 1,
			});

		if (data.orderType === "digital") {
			await handleDigital(data, paymentRef.id);
		}

		if (data.orderType === "physical") {
			await handlePhysical(data, paymentRef.id);
		}

		if (data.orderType === "portrait") {
			await handlePortrait(data, paymentRef.id);
		}

		return new Response("Success", { status: 200 });
	} catch (error) {
		console.error(error);
		return new Response("Payment error", { status: 400 });
	}
}
