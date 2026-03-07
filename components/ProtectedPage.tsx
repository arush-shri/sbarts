"use client";

import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ProtectedPage({ children }: { children: ReactNode }) {
	const router = useRouter();

	useEffect(() => {
		// instant check
		if (!firebaseClientAuth.currentUser) {
			router.replace("/signIn");
			return;
		}

		// listen for auth changes
		const unsubscribe = onAuthStateChanged(firebaseClientAuth, (user) => {
			if (!user) {
				router.replace("/signIn");
			}
		});

		return () => unsubscribe();
	}, [router]);

	return <>{children}</>;
}
