import { ReactElement } from "react";
import DigitalPurchase from "./DigitalPurchase";
import PhysicalPurchase from "./PhysicalPurchase";
import SelfPortrait from "./SelfPortrait";

export default async function Purchase({
	searchParams,
}: {
	searchParams: Promise<{
		productId: string;
		orderType: string;
	}>;
}): Promise<ReactElement> {
	const params = await searchParams;
	const productId: string = params.productId || "";

	const isSelfPurchase: boolean = params.orderType === "self";
	if (isSelfPurchase) return <SelfPortrait />;

	const isDigitalPurchase: boolean = params.orderType === "digital";
	if (isDigitalPurchase) return <DigitalPurchase productId={productId} />;

	return <PhysicalPurchase productId={productId} />;
}
