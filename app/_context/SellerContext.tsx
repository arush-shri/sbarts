"use client";

import { onAuthStateChanged } from "@firebase/auth";
import {
	Context,
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { firebaseClientAuth } from "../_firebase/clientAuth";
import { SellerType } from "../_lib/customTypes";

const SellerContext: Context<{
	artistData: SellerType | null;
	loading: boolean;
}> = createContext<{ artistData: SellerType | null; loading: boolean }>({
	artistData: null,
	loading: true,
});

export function SellerProvider({ children }: { children: ReactNode }) {
	const [seller, setSeller] = useState<{
		artistData: SellerType | null;
		loading: boolean;
	}>({ artistData: null, loading: true });

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			firebaseClientAuth,
			async (user) => {
				if (!user) {
					setSeller({ artistData: null, loading: false });
					return;
				}

				const token = await user.getIdToken();

				const res = await fetch("/api/auth/signIn", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				const data = await res.json();

				if (data.success) {
					const res = await fetch("/api/seller", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ sellerId: data.sellerId }),
					});

					if (!res.ok) return null;
					const json = await res.json();
					setSeller({
						artistData: json.data as SellerType,
						loading: false,
					});
				} else {
					setSeller({ artistData: null, loading: false });
				}
			},
		);

		return () => unsubscribe();
	}, []);

	return (
		<SellerContext.Provider value={seller}>
			{children}
		</SellerContext.Provider>
	);
}

export function useSellerContext() {
	const context = useContext(SellerContext);
	return context;
}
