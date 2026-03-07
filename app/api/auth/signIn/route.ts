import { firebaseAuth } from "@/app/_firebase/firebaseAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const authHeader = req.headers.get("authorization");

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const idToken = authHeader.split("Bearer ")[1];

		// Verify Firebase token
		const decoded = await firebaseAuth.verifyIdToken(idToken);

		const sellerId = decoded.uid;

		return NextResponse.json(
			{
				success: true,
				sellerId,
			},
			{ status: 200 },
		);
	} catch (err) {
		console.error("SignIn error:", err);

		return NextResponse.json(
			{ error: "Authentication failed" },
			{ status: 401 },
		);
	}
}
