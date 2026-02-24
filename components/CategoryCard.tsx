import Image from "next/image";
import { ReactElement } from "react";

export default function CategoryCard({
	uri,
	category,
	path,
}: {
	uri: string;
	category: string;
	path: string;
}): ReactElement {
	return (
		<a
			href={path}
			className="sm:w-[20dvw] rounded-lg overflow-hidden relative group cursor-pointer"
		>
			<Image
				src={uri}
				alt={`${category} Image`}
				width={864}
				height={1184}
				className="h-full w- object-contain"
			/>
			<div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition" />

			{/* Text */}
			<div className="absolute bottom-4 left-4">
				<h3 className="text-white text-lg font-semibold">{category}</h3>
			</div>
		</a>
	);
}
