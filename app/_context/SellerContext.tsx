"use client";

import { onAuthStateChanged } from "@firebase/auth";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { firebaseClientAuth } from "../_firebase/clientAuth";
import { SellerType } from "../_lib/customTypes";

interface SellerContextType {
	artistData: SellerType | null;
	loading: boolean;
	authenticated: boolean;
	setSellerData: (data: SellerType | null) => void;
}

const SellerContext = createContext<SellerContextType>({
	artistData: null,
	loading: true,
	authenticated: false,
	setSellerData: () => {},
});

export function SellerProvider({ children }: { children: ReactNode }) {
	const [seller, setSeller] = useState<{
		artistData: SellerType | null;
		loading: boolean;
		authenticated: boolean;
	}>({ artistData: null, loading: true, authenticated: false });

	const setSellerData = (data: SellerType | null) => {
		setSeller((prev) => ({
			...prev,
			artistData: data,
		}));
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			firebaseClientAuth,
			async (user) => {
				if (!user) {
					setSeller({
						artistData: null,
						loading: false,
						authenticated: false,
					});
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

					if (!res.ok) {
						setSeller({
							artistData: null,
							loading: false,
							authenticated: true,
						});
						return;
					}
					const json = await res.json();
					const artistData = json.data as SellerType;
					setSeller({
						artistData,
						loading: false,
						authenticated: true,
					});
				} else {
					setSeller({
						artistData: null,
						loading: false,
						authenticated: false,
					});
				}
			},
		);

		return () => unsubscribe();
	}, []);

	return (
		<SellerContext.Provider
			value={{
				artistData: seller.artistData,
				loading: seller.loading,
				authenticated: seller.authenticated,
				setSellerData,
			}}
		>
			{children}
		</SellerContext.Provider>
	);
}

export function useSellerContext() {
	const context = useContext(SellerContext);
	return context;
}
