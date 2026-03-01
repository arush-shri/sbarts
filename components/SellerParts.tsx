import { usePaintingContext } from "@/app/_context/PaintingConext";
import { PaintingType, SellerType } from "@/app/_lib/customTypes";
import { convertNumToDate } from "@/app/_lib/dataProcessing";
import { Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { ReactElement, useMemo } from "react";

export function SidebarProfile({
	artistData,
}: {
	artistData: SellerType;
}): ReactElement {
	return (
		<aside className="w-full lg:w-80 bg-white rounded-2xl p-8 border border-[#0000001A] h-fit">
			<div className="flex flex-col items-center text-center border-b border-[#0000000D] pb-6 mb-6">
				<div className="w-20 h-20 rounded-full overflow-hidden mb-4 relative ring-4 ring-blue-50">
					<Image
						src="/images/selCat.jpg"
						alt="Profile"
						fill
						className="object-cover"
					/>
				</div>
				<h2 className="text-xl font-bold">{artistData.name}</h2>
			</div>

			<div className="space-y-4 mb-8">
				{[
					{ label: "Email", value: artistData.email },
					{
						label: "Location",
						value: `${artistData.address.city}, ${artistData.address.country}`,
					},
					{
						label: "Joined",
						value: convertNumToDate(artistData.createdAt),
					},
				].map((item) => (
					<div
						key={item.label}
						className="flex justify-between text-sm"
					>
						<span className="text-[#98A0AB]">{item.label}</span>
						<span className="font-semibold text-right max-w-[140px] truncate">
							{item.value}
						</span>
					</div>
				))}
			</div>

			<button
				className="w-full py-2.5 border border-[#0000001A] rounded-lg text-sm font-bold hover:bg-gray-50 
                transition-colors"
			>
				Edit Profile
			</button>
		</aside>
	);
}

export function ListingsTable({
	artworkIds,
}: {
	artworkIds: string[];
}): ReactElement {
	const paintings: PaintingType[] = usePaintingContext();
	const displayedArtworks = useMemo(() => {
		return artworkIds
			.map((id) => paintings.find((p) => p.id === id))
			.filter((p): p is PaintingType => p !== undefined);
	}, [artworkIds, paintings]);

	return (
		<div>
			<div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
				<h3 className="font-bold text-lg">Your Listings</h3>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-[#F8F9FA] border-y border-[#0000000D] text-[#98A0AB] text-[11px] font-bold uppercase tracking-wider">
							<th className="px-6 py-4">Item</th>
							<th className="px-6 py-4">Price</th>
							<th className="px-6 py-4">Stock</th>
							{/* <th className="px-6 py-4">Status</th> */}
							<th className="px-6 py-4 text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[#0000000D]">
						{displayedArtworks.map((item) => (
							<tr
								key={item.id}
								className="group hover:bg-gray-50 transition-colors"
							>
								<td className="px-6 py-4 flex items-center gap-3">
									<Image
										src={item.images}
										alt={`${item.title} image`}
										width={864}
										height={1184}
										className="object-cover rounded-lg aspect-square w-10 h-10 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0"
									/>
									<div>
										<p className="font-bold text-sm">
											{item.title}
										</p>
									</div>
								</td>
								<td className="px-6 py-4 text-sm font-medium text-[#0F1724]">
									${item.price.toFixed(2)}
								</td>
								<td className="px-6 py-4 text-sm text-[#98A0AB]">
									{item.quantityDigital} •{" "}
									{item.quantityPhysical}
								</td>
								<td className="px-6 py-4 text-right">
									<div className="flex justify-end gap-2">
										<button
											className="p-2 hover:bg-white rounded-md border border-transparent 
                                            hover:border-[#0000001A] text-[#98A0AB] hover:text-[#0F1724] transition-all"
										>
											<Edit2 className="h-auto w-4" />
										</button>
										<button
											className="p-2 hover:bg-red-50 rounded-md border border-transparent 
                                            hover:border-red-100 text-[#98A0AB] hover:text-red-500 transition-all"
										>
											<Trash2 className="h-auto w-4" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export function StatsCards({
	totalSale,
	itemSold,
	totalListing,
}: {
	totalSale: number;
	itemSold: number;
	totalListing: number;
}): ReactElement {
	const stats = [
		{ label: "Total Sales", value: totalSale },
		{ label: "Active Listings", value: totalListing },
		{ label: "Items Sold", value: itemSold },
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{stats.map((stat) => (
				<div
					key={stat.label}
					className="bg-[#F0F7FF] border border-[#0000001A] p-8 rounded-2xl"
				>
					<p className="text-[#98A0AB] text-sm font-semibold mb-2">
						{stat.label}
					</p>
					<p className="text-3xl font-bold text-[#0F1724]">
						{stat.value}
					</p>
				</div>
			))}
		</div>
	);
}
