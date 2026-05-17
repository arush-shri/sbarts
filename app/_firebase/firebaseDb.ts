import { getFirestore } from "firebase-admin/firestore";
import { firebaseApp } from "./firebaseAdmin";

export const firebaseDB = getFirestore(
	firebaseApp,
	process.env.FIRESTORE_DATABASE_ID || "(default)",
);
