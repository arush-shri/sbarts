import Link from "next/link";

export default function PurchaseComplete() {
	return (
		<main className="min-h-screen px-5 lg:px-20 pt-28 text-[#0F1724]">
			<h1 className="text-2xl font-bold">Payment received</h1>
			<p className="mt-3 text-[#98A0AB]">
				Your order is being processed. You will receive confirmation by
				email.
			</p>
			<Link
				href="/explore"
				className="mt-6 inline-block rounded-lg bg-[#0061f2] px-5 py-3 font-bold text-white"
			>
				Continue exploring
			</Link>
		</main>
	);
}
