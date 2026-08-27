import { firebaseAuth } from "@/app/_firebase/firebaseAuth";
import { firebaseDB } from "@/app/_firebase/firebaseDb";
import { PaintingType, SellerType } from "@/app/_lib/customTypes";
import { NextRequest } from "next/server";

export async function requireFirebaseUser(req: NextRequest) {
	const authHeader = req.headers.get("authorization");

	if (!authHeader?.startsWith("Bearer ")) {
		throw new Error("Unauthorized");
	}

	const token = authHeader.slice("Bearer ".length);
	return firebaseAuth.verifyIdToken(token);
}

export function isAdminProfile(profile?: Partial<SellerType> | null) {
	return profile?.admin === true || profile?.isAdmin === true;
}

export async function getUserProfile(uid: string) {
	const profileDoc = await firebaseDB.collection("sellers").doc(uid).get();

	if (!profileDoc.exists) {
		return null;
	}

	return {
		id: profileDoc.id,
		...profileDoc.data(),
	} as SellerType;
}

export async function requireUserProfile(req: NextRequest) {
	const decoded = await requireFirebaseUser(req);
	const profile = await getUserProfile(decoded.uid);

	if (!profile) {
		throw new Error("Profile not found");
	}

	return {
		decoded,
		profile,
		isAdmin: isAdminProfile(profile),
	};
}

export async function requireAdminUser(req: NextRequest) {
	const session = await requireUserProfile(req);

	if (!session.isAdmin) {
		throw new Error("Forbidden");
	}

	return session;
}

export function canManagePainting(
	painting: Pick<PaintingType, "sellerId">,
	uid: string,
	profile?: Partial<SellerType> | null,
) {
	return isAdminProfile(profile) || painting.sellerId === uid;
}
