"use client";

import { firebaseClientAuth } from "@/app/_firebase/clientAuth";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function ProtectedPage({ children }: { children: ReactNode }) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(firebaseClientAuth, (user) => {
			if (!user) {
				router.replace("/signIn");
			} else {
				setLoading(false);
			}
		});

		return () => unsubscribe();
	}, [router]);

	if (loading) {
		return null; // or loader
	}

	return <>{children}</>;
}
