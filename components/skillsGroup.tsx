import { ReactElement } from "react";

export default function SkillsGroup({
	title,
	subText,
	skills,
	extra,
}: {
	title: string;
	subText: string;
	skills: string[];
	extra: string | undefined;
}): ReactElement {
	return (
		<div className={`flex flex-col gap-y-1.5 w-full ${extra}`}>
			<div className="flex flex-col gap-y-1 md:gap-x-4 md:flex-row md:justify-between md:items-center">
				<span className="font-bold text-[#0F1724] text-2xl">
					{title}
				</span>
				<span className="text-[#98A0AB] text-md">{subText}</span>
			</div>
			<div className="flex flex-wrap items-center gap-x-2 gap-y-2">
				{skills.map((skill, index) => (
					<div
						key={index}
						className="px-5 py-2 bg-white rounded-md border-1 border-[#0000001F]"
					>
						<span>{skill}</span>
					</div>
				))}
			</div>
		</div>
	);
}
