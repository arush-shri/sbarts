import {
	validateEmail,
	validateName,
	validateRequiredText,
} from "@/app/_lib/validation";
import { sendEmail } from "@/server/EmailHandler";
import { NextRequest, NextResponse } from "next/server";

type InquiryBody = {
	name?: string;
	email?: string;
	message?: string;
	paintingId?: string;
	paintingTitle?: string;
};

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as InquiryBody;
		const name = validateName(body.name);
		if (!name.valid) {
			return NextResponse.json({ error: name.message }, { status: 400 });
		}

		const email = validateEmail(body.email);
		if (!email.valid) {
			return NextResponse.json({ error: email.message }, { status: 400 });
		}

		const message = validateRequiredText(
			body.message,
			"Message",
			"message",
			10,
			1500,
		);
		if (!message.valid) {
			return NextResponse.json(
				{ error: message.message },
				{ status: 400 },
			);
		}

		const inbox = process.env.INQUIRY_EMAIL || process.env.EMAIL_USER;
		if (!inbox) {
			return NextResponse.json(
				{ error: "Inquiry inbox is not configured." },
				{ status: 500 },
			);
		}

		const subject = body.paintingTitle
			? `Artwork inquiry: ${body.paintingTitle}`
			: "SB Arts inquiry";

		const text = [
			`Name: ${name.value}`,
			`Email: ${email.value}`,
			body.paintingTitle ? `Artwork: ${body.paintingTitle}` : undefined,
			body.paintingId ? `Artwork ID: ${body.paintingId}` : undefined,
			"",
			"Message:",
			message.value,
		]
			.filter((line) => line !== undefined)
			.join("\n");

		await sendEmail(inbox, subject, text);

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to send inquiry." },
			{ status: 500 },
		);
	}
}
