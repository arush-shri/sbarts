export function convertNumToDate(createdAt: number) {
	const date = new Date(createdAt);

	const formatted = `${date.getDate().toString().padStart(2, "0")}/${(
		date.getMonth() + 1
	)
		.toString()
		.padStart(2, "0")}/${date.getFullYear()}`;

	return formatted;
}

export function validatePassword(password: string): string | null {
	if (!password) return "Password is required.";

	if (password.length < 8) return "Password must be at least 8 characters.";

	if (password.length > 32) return "Password cannot exceed 32 characters.";

	if (!/[A-Z]/.test(password))
		return "Password must contain at least one uppercase letter.";

	if (!/[a-z]/.test(password))
		return "Password must contain at least one lowercase letter.";

	if (!/[0-9]/.test(password))
		return "Password must contain at least one number.";

	if (!/[!@#$%^&*(),.?\":{}|<>_\-\[\]\\\/]/.test(password))
		return "Password must contain at least one special character.";

	return null;
}

export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}
