"use client";

import { notFound, useParams } from "next/navigation";
import { ReactElement } from "react";
import EditArtwork from "./EditPage";

export default function EditArtPage(): ReactElement {
	const params = useParams();

	const itemId = Array.isArray(params.itemId)
		? params.itemId[0]
		: params.itemId;

	if (!itemId) notFound();

	return <EditArtwork itemId={itemId} />;
}
