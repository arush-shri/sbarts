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
	subject?: string;
};

function getFirstValue(value: FormDataEntryValue | null | undefined) {
	if (typeof value === "string") return value;
	return "";
}

export async function POST(req: NextRequest) {
	try {
		let nameValue = "";
		let emailValue = "";
		let messageValue = "";
		let subjectValue = "";
		let paintingTitleValue = "";
		let paintingIdValue = "";
		let attachment: File | null = null;

		const contentType = req.headers.get("content-type") || "";
		if (contentType.includes("multipart/form-data")) {
			const formData = await req.formData();
			nameValue = getFirstValue(formData.get("name"));
			emailValue = getFirstValue(formData.get("email"));
			messageValue = getFirstValue(formData.get("message"));
			subjectValue = getFirstValue(formData.get("subject"));
			paintingTitleValue = getFirstValue(formData.get("paintingTitle"));
			paintingIdValue = getFirstValue(formData.get("paintingId"));
			const uploadedFile = formData.get("attachment");
			attachment = uploadedFile instanceof File ? uploadedFile : null;
		} else {
			const body = (await req.json()) as InquiryBody;
			nameValue = body.name || "";
			emailValue = body.email || "";
			messageValue = body.message || "";
			subjectValue = body.subject || "";
			paintingTitleValue = body.paintingTitle || "";
			paintingIdValue = body.paintingId || "";
		}

		const name = validateName(nameValue);
		if (!name.valid) {
			return NextResponse.json({ error: name.message }, { status: 400 });
		}

		const email = validateEmail(emailValue);
		if (!email.valid) {
			return NextResponse.json({ error: email.message }, { status: 400 });
		}

		const message = validateRequiredText(
			messageValue,
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

		const subject = paintingTitleValue
			? `Artwork inquiry: ${paintingTitleValue}`
			: subjectValue || "SB Arts inquiry";

		const text = [
			`Name: ${name.value}`,
			`Email: ${email.value}`,
			paintingTitleValue ? `Artwork: ${paintingTitleValue}` : undefined,
			paintingIdValue ? `Artwork ID: ${paintingIdValue}` : undefined,
			attachment ? `Attachment: ${attachment.name}` : undefined,
			"",
			"Message:",
			message.value,
		]
			.filter((line) => line !== undefined)
			.join("\n");

		const attachments = attachment
			? [
					{
						filename: attachment.name,
						content: Buffer.from(await attachment.arrayBuffer()),
						contentType: attachment.type || undefined,
					},
				]
			: undefined;

		await sendEmail(inbox, subject, text, attachments);

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to send inquiry." },
			{ status: 500 },
		);
	}
}
