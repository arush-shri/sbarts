import { firebaseClientAuth } from "./clientAuth";

export function getCurrentUser() {
	return firebaseClientAuth.currentUser;
}
