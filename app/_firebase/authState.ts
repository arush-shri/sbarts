import { onAuthStateChanged, User } from "firebase/auth";
import { firebaseClientAuth } from "./clientAuth";

let currentUser: User | null = firebaseClientAuth.currentUser;
const listeners = new Set<(user: User | null) => void>();

onAuthStateChanged(firebaseClientAuth, (user) => {
	currentUser = user;
	listeners.forEach((cb) => cb(user));
});

export function getCurrentUser() {
	return currentUser;
}

export function subscribeAuth(cb: (user: User | null) => void) {
	listeners.add(cb);
	return () => listeners.delete(cb);
}
