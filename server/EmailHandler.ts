import { firebaseDB } from "@/app/_firebase/firebaseDb";
//@ts-ignore
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export async function sendEmail(to: string, subject: string, text: string) {
	await transporter.sendMail({
		from: `SB Arts <${process.env.EMAIL_USER}>`,
		to,
		subject,
		text,
	});
}

export async function sendEmailWithAttachment(
	sellerId: string,
	subject: string,
	file: File,
) {
	const buffer = Buffer.from(await file.arrayBuffer());

	const sellerDoc = await firebaseDB
		.collection("sellers")
		.doc(sellerId)
		.get();

	if (!sellerDoc.exists) {
		throw new Error("Seller not found");
	}

	const sellerData = sellerDoc.data();

	const sellerEmail = sellerData?.email;

	if (!sellerEmail) {
		throw new Error("Seller email missing");
	}

	await transporter.sendMail({
		from: `SB Arts <${process.env.EMAIL_USER}>`,
		to: sellerEmail,
		subject,
		text: "New portrait request received",
		attachments: [
			{
				filename: file.name,
				content: buffer,
			},
		],
	});
}

export async function sendEmailToSeller(sellerId: string, subject: string) {
	const sellerDoc = await firebaseDB
		.collection("sellers")
		.doc(sellerId)
		.get();

	if (!sellerDoc.exists) {
		throw new Error("Seller not found");
	}

	const sellerData = sellerDoc.data();

	const sellerEmail = sellerData?.email;

	if (!sellerEmail) {
		throw new Error("Seller email missing");
	}

	await transporter.sendMail({
		from: `SB Arts <${process.env.EMAIL_USER}>`,
		to: sellerEmail,
		subject,
		text: "You have received a new order",
	});
}
