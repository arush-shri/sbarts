import { Auth, getAuth } from "firebase-admin/auth";
import { firebaseApp } from "./firebaseAdmin";

export const firebaseAuth: Auth = getAuth(firebaseApp);
