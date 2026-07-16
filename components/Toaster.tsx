import { X } from "lucide-react";
import toast from "react-hot-toast";

export const ShowToast = (message: string, type: 0 | 1 | 2) => {
	const styles = {
		0: {
			bg: "#7f1d1d",
			color: "#fecaca",
			icon: "!",
		},
		1: {
			bg: "#F7F8DC",
			color: "#D5AF37",
			icon: "i",
		},
		2: {
			bg: "#D5AF37",
			color: "#0A1830",
			icon: "OK",
		},
	};

	const s = styles[type];

	toast(
		(t) => (
			<div className="flex items-center gap-4">
				{/* <span className="font-bold">{s.icon}</span> */}
				<span>{message}</span>
				<button
					type="button"
					onClick={() => toast.dismiss(t.id)}
					className="cursor-pointer text-sm"
					aria-label="Dismiss notification"
				>
					<X className="h-4 w-4" />
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
