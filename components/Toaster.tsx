import { X } from "lucide-react";
import toast from "react-hot-toast";

export const ShowToast = (message: string, type: 0 | 1 | 2) => {
	const styles = {
		0: {
			bg: "#7f1d1d",
			color: "#fecaca",
			icon: "⚠️",
		},
		1: {
			bg: "#1e3a8a",
			color: "#bfdbfe",
			icon: "ℹ️",
		},
		2: {
			bg: "#065f46",
			color: "#a7f3d0",
			icon: "✓",
		},
	};

	const s = styles[type];

	toast(
		(t) => (
			<div className="flex items-center gap-4">
				<span>{s.icon}</span>

				<span>{message}</span>

				<button
					onClick={() => toast.dismiss(t.id)}
					className="text-sm cursor-pointer"
				>
					<X />
				</button>
			</div>
		),
		{
			duration: 4000,
			style: {
				background: s.bg,
				color: s.color,
			},
		},
	);
};
