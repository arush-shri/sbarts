export default function Loading() {
	return (
		<div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
			<div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
				{/* Spinner */}
				<div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />

				<p className="text-sm font-medium text-gray-700">Loading...</p>
			</div>
		</div>
	);
}
