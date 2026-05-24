import { getStorage } from "firebase-admin/storage";
import { firebaseApp } from "./firebaseAdmin";

export const firebaseStorage = getStorage(firebaseApp);
