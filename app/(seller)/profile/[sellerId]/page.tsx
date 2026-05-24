"use client";

import { notFound, useParams } from "next/navigation";
import { ReactElement } from "react";
import ArtistProfile from "./ArtistProfile";

export default function ProfilePage(): ReactElement {
	const params = useParams();

	const sellerId = Array.isArray(params.sellerId)
		? params.sellerId[0]
		: params.sellerId;

	if (!sellerId) notFound();

	return <ArtistProfile sellerId={sellerId} />;
}
