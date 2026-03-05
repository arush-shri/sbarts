"use client";

import { notFound, useParams } from "next/navigation";
import { ReactElement } from "react";
import SellerDashboard from "./SellerDashboard";

export default function Dashboard(): ReactElement {
	const params = useParams();

	const sellerId = Array.isArray(params.sellerId)
		? params.sellerId[0]
		: params.sellerId;

	if (!sellerId) notFound();

	return <SellerDashboard />;
}

// Read seller id from context
