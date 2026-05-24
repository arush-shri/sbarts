import { ShowToast } from "@/components/Toaster";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export function convertNumToDate(createdAt: number) {
	const date = new Date(createdAt);

	const formatted = `${date.getDate().toString().padStart(2, "0")}/${(
		date.getMonth() + 1
	)
		.toString()
		.padStart(2, "0")}/${date.getFullYear()}`;

	return formatted;
}

export function validatePassword(password: string): string | null {
	if (!password) return "Password is required.";

	if (password.length < 8) return "Password must be at least 8 characters.";

	if (password.length > 32) return "Password cannot exceed 32 characters.";

	if (!/[A-Z]/.test(password))
		return "Password must contain at least one uppercase letter.";

	if (!/[a-z]/.test(password))
		return "Password must contain at least one lowercase letter.";

	if (!/[0-9]/.test(password))
		return "Password must contain at least one number.";

	if (!/[!@#$%^&*(),.?\":{}|<>_\-\[\]\\\/]/.test(password))
		return "Password must contain at least one special character.";

	return null;
}

export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export const buyDigital = (data: any) => {
	InitPayment({
		...data,
		orderType: "digital",
	});
};

export const buyPhysical = (data: any) => {
	InitPayment({
		...data,
		orderType: "physical",
	});
};

export const buyPortrait = (data: any) => {
	InitPayment({
		...data,
		orderType: "portrait",
	});
};

const InitPayment = async (payload: any) => {
	// ✅ Save full payload (including File)
	await saveToIndexedDB("pendingOrder", payload);

	const res = await fetch("/api/checkout", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			amount: payload.amount,
			accountId: payload.accountId,
		}),
	});

	const data = await res.json();

	if (data.url) {
		window.location.href = data.url;
	}
};

export const saveToIndexedDB = (key: string, data: any) => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open("appDB", 1);

		request.onupgradeneeded = () => {
			request.result.createObjectStore("store");
		};

		request.onsuccess = () => {
			const db = request.result;
			const tx = db.transaction("store", "readwrite");
			tx.objectStore("store").put(data, key);
			tx.oncomplete = () => resolve(true);
		};

		request.onerror = reject;
	});
};

export const getFromIndexedDB = (key: string) => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open("appDB", 1);

		request.onupgradeneeded = () => {
			request.result.createObjectStore("store");
		};

		request.onsuccess = () => {
			const db = request.result;
			const tx = db.transaction("store", "readwrite");
			const store = tx.objectStore("store");

			const getReq = store.get(key);

			getReq.onsuccess = () => {
				const data = getReq.result;

				// ✅ Try deleting, but DON'T block response
				const deleteReq = store.delete(key);

				deleteReq.onerror = (err) => {
					console.warn("IndexedDB delete failed:", err);
				};

				// ✅ Return data immediately
				resolve(data);
			};

			getReq.onerror = reject;
		};

		request.onerror = reject;
	});
};

export const completeOrder = async (sessionId: string) => {
	const res = await fetch(`/api/checkout?session_id=${sessionId}`);
	const data = await res.json();

	if (data.status !== "paid") {
		ShowToast("Payment failed ❌", 0);
		return;
	}
	ShowToast("Order placed successfully ✅", 2);
	const payload: any = await getFromIndexedDB("pendingOrder");

	if (!payload) {
		console.warn("No pending order found (maybe already processed)");
		return;
	}

	const formData = new FormData();

	// append all fields
	Object.keys(payload).forEach((key) => {
		formData.append(key, payload[key]);
	});
	formData.append("sessionId", sessionId);

	await fetch("/api/order", {
		method: "POST",
		body: formData,
	});
};

export function thumbnailUrlGenerator(imageId: string): string {
	const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
	const imagePath: string = `paintings/${imageId}/thumbnail.jpg`;
	return `https://storage.googleapis.com/${bucket}/${encodeURIComponent(imagePath)}`;
}

export function watermarkedUrlGenerator(imageId: string): string {
	const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
	const imagePath: string = `paintings/${imageId}/watermarked.jpg`;
	return `https://storage.googleapis.com/${bucket}/${encodeURIComponent(imagePath)}`;
}
