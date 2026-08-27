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

				setSeller((current) => ({
					...current,
					loading: true,
					authenticated: true,
				}));

				try {
					const token = await user.getIdToken();
					const authResponse = await fetch("/api/auth/signIn", {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					const authData = await authResponse.json();
					if (!authResponse.ok || !authData.success) {
						setSeller({
							artistData: null,
							loading: false,
							authenticated: true,
						});
						return;
					}

					let sellerResponse: Response | null = null;
					for (let attempt = 0; attempt < 3; attempt += 1) {
						sellerResponse = await fetch("/api/seller", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								sellerId: authData.sellerId,
							}),
						});

						if (
							sellerResponse.ok ||
							sellerResponse.status !== 404
						) {
							break;
						}

						await new Promise((resolve) =>
							setTimeout(resolve, 250 * (attempt + 1)),
						);
					}

					if (!sellerResponse?.ok) {
						setSeller({
							artistData: null,
							loading: false,
							authenticated: true,
						});
						return;
					}

					const json = await sellerResponse.json();
					const artistData = json.data as SellerType;
					setSeller({
						artistData,
						loading: false,
						authenticated: true,
					});
				} catch (error) {
					console.error("Failed to load seller profile:", error);
					setSeller({
						artistData: null,
						loading: false,
						authenticated: true,
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
