export function convertNumToDate(createdAt: number) {
	const date = new Date(createdAt);

	const formatted = `${date.getDate().toString().padStart(2, "0")}/${(
		date.getMonth() + 1
	)
		.toString()
		.padStart(2, "0")}/${date.getFullYear()}`;

	return formatted;
}
