import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { firebaseStorage } from "@/app/_firebase/storage";
import { FieldValue } from "firebase-admin/firestore";
import {
	sendEmail,
	sendEmailToSeller,
	sendEmailWithAttachment,
} from "./EmailHandler";

export async function validateOrder(data: any) {
	const painting = await firebaseDB
		.collection("paintings")
		.doc(data.paintingId)
		.get();

	if (!painting.exists) throw new Error("Painting not found");

	const p = painting.data();

	if (!p) throw new Error("Out of stock");
	// stock check
	if (data.orderType === "physical" && p.quantity <= 0)
		throw new Error("Out of stock");

	if (data.orderType === "digital" && p.quantity <= 0)
		throw new Error("Out of stock");

	// type mismatch
	if (data.orderType === "digital" && !p.isDigital)
		throw new Error("Invalid purchase");

	if (data.orderType === "physical" && !p.isPhysical)
		throw new Error("Invalid purchase");

	// portrait validation
	if (data.orderType === "portrait" && !p.makeSelfPortrait)
		throw new Error("Seller doesn't offer portrait");

	return p;
}

export async function handleDigital(data: any, paymentId: string) {
	await firebaseDB.collection("orders").add({
		...data,
		paymentId,
		type: "digital",
	});
	await pushToSeller(data.sellerId, paymentId);

	// generate signed URL
	const [url] = await firebaseStorage
		.bucket()
		.file(`originals/${data.paintingId}/artWork.jpg`)
		.getSignedUrl({
			action: "read",
			expires: Date.now() + 5 * 60 * 1000,
		});

	await sendEmail(data.email, "Download your art", url);
}

//TO CHANGE. Email Text Improvement. For sellers add check dashboard for order.

export async function handlePhysical(data: any, paymentId: string) {
	await firebaseDB.collection("orders").add({
		...data,
		paymentId,
		type: "physical",
	});
	await pushToSeller(data.sellerId, paymentId);

	await sendEmail(data.email, "Order confirmed", "Thank you for purchasing!");
	await sendEmailToSeller(data.sellerId, "New order received");
}

export async function handlePortrait(data: any, paymentId: string) {
	await firebaseDB.collection("orders").add({
		...data,
		paymentId,
		type: "portrait",
	});
	await pushToSeller(data.sellerId, paymentId);

	await sendEmail(data.email, "Portrait order placed", "We’ll contact you");

	await sendEmailWithAttachment(
		data.sellerId,
		"New portrait request",
		data.imageFile,
	);
}

async function pushToSeller(sellerId: string, orderId: string) {
	await firebaseDB
		.collection("sellers")
		.doc(sellerId)
		.update({
			orderIds: FieldValue.arrayUnion(orderId),
		});
}
