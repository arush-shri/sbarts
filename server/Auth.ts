import { firebaseAuth } from "@/app/_firebase/firebaseAuth";
import { NextRequest } from "next/server";

export async function requireFirebaseUser(req: NextRequest) {
	const authHeader = req.headers.get("authorization");

	if (!authHeader?.startsWith("Bearer ")) {
		throw new Error("Unauthorized");
	}

	const token = authHeader.slice("Bearer ".length);
	return firebaseAuth.verifyIdToken(token);
}
