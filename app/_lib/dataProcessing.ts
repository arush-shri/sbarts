import { ShowToast } from "@/components/Toaster";

export function convertNumToDate(createdAt: number) {
	const date = new Date(createdAt);

	const formatted = `${date.getDate().toString().padStart(2, "0")}/${(
		date.getMonth() + 1
	)
		.toString()
		.padStart(2, "0")}/${date.getFullYear()}`;

	return formatted;
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
	ShowToast("Payments are disabled in this deployment.", 1);
	return;
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
	ShowToast("Payments are disabled in this deployment.", 1);
	return;
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
