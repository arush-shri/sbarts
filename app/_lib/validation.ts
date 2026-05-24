export type ValidationResult<T = unknown> =
	| { valid: true; value?: T }
	| { valid: false; field?: string; message: string };

const ART_CATEGORIES = [
	"Digital Art",
	"Paintings",
	"Photography",
	"Self Portrait",
] as const;
const LISTING_TYPES = ["Digital Download", "Physical Item"] as const;
const LICENSE_TYPES = ["Personal", "Commercial", "Extended"] as const;
const SHIPPING_METHODS = ["standard", "express"] as const;
const SORT_OPTIONS = [
	"Relevance",
	"Price: Low to High",
	"Price: High to Low",
	"Newest",
	"Most Popular",
] as const;

const badText = /[<>]/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+()\-\s0-9]{7,20}$/;
const nameRegex = /^[A-Za-z][A-Za-z ._'’-]{1,79}$/;

const fail = (message: string, field?: string): ValidationResult => ({
	valid: false,
	message,
	field,
});
const pass = <T>(value?: T): ValidationResult<T> => ({ valid: true, value });

export function text(value: unknown) {
	return String(value ?? "").trim();
}

export function validateRequiredText(
	value: unknown,
	label: string,
	field = label,
	min = 1,
	max = 120,
) {
	const v = text(value);
	if (!v) return fail(`${label} is required.`, field);
	if (v.length < min)
		return fail(`${label} must be at least ${min} characters.`, field);
	if (v.length > max)
		return fail(`${label} cannot exceed ${max} characters.`, field);
	if (badText.test(v))
		return fail(`${label} contains invalid characters.`, field);
	return pass(v);
}

export function validateName(value: unknown, label = "Name", field = "name") {
	const base = validateRequiredText(value, label, field, 2, 80);
	if (!base.valid) return base;
	if (!nameRegex.test(base.value as string)) {
		return fail(
			`${label} can only contain letters, spaces, apostrophes, hyphens, dots, and underscores.`,
			field,
		);
	}
	return base;
}

export function validateEmail(value: unknown, field = "email") {
	const v = text(value).toLowerCase();
	if (!v) return fail("Email is required.", field);
	if (v.length > 254 || !emailRegex.test(v))
		return fail("Please enter a valid email address.", field);
	return pass(v);
}

export function validatePassword(value: unknown, strong = true) {
	const password = String(value ?? "");
	if (!password) return fail("Password is required.", "password");
	if (!strong) return pass(password);
	if (password.length < 8)
		return fail("Password must be at least 8 characters.", "password");
	if (password.length > 32)
		return fail("Password cannot exceed 32 characters.", "password");
	if (!/[A-Z]/.test(password))
		return fail(
			"Password must contain at least one uppercase letter.",
			"password",
		);
	if (!/[a-z]/.test(password))
		return fail(
			"Password must contain at least one lowercase letter.",
			"password",
		);
	if (!/[0-9]/.test(password))
		return fail("Password must contain at least one number.", "password");
	if (!/[!@#$%^&*(),.?":{}|<>_\-[\]\\/]/.test(password))
		return fail(
			"Password must contain at least one special character.",
			"password",
		);
	return pass(password);
}

export function validateNumber(
	value: unknown,
	label: string,
	field: string,
	min = 0,
	max = Number.MAX_SAFE_INTEGER,
	integer = false,
) {
	const n = Number(value);
	if (!Number.isFinite(n))
		return fail(`${label} must be a valid number.`, field);
	if (integer && !Number.isInteger(n))
		return fail(`${label} must be a whole number.`, field);
	if (n < min) return fail(`${label} must be at least ${min}.`, field);
	if (n > max) return fail(`${label} cannot exceed ${max}.`, field);
	return pass(n);
}

export function validateSelect(
	value: unknown,
	label: string,
	field: string,
	allowed: readonly string[],
) {
	const v = text(value);
	if (!v) return fail(`${label} is required.`, field);
	if (!allowed.includes(v))
		return fail(`Please select a valid ${label.toLowerCase()}.`, field);
	return pass(v);
}

export function validatePhone(value: unknown) {
	const v = text(value);
	if (!v) return fail("Phone number is required.", "phoneNumber");
	if (!phoneRegex.test(v))
		return fail("Please enter a valid phone number.", "phoneNumber");
	return pass(v);
}

export function validatePostalCode(value: unknown) {
	const v = text(value);
	if (!v) return fail("Postal code is required.", "postalCode");
	if (v.length < 3 || v.length > 12 || badText.test(v))
		return fail("Please enter a valid postal code.", "postalCode");
	return pass(v);
}

export function firstInvalid(...checks: ValidationResult[]) {
	return checks.find((check) => !check.valid) ?? pass();
}

export async function validateImageFile(
	file: File | null | undefined,
	options: {
		label: string;
		maxMb: number;
		minWidth?: number;
		minHeight?: number;
		types?: string[];
	},
) {
	if (!file) return fail(`${options.label} is required.`);
	const allowed = options.types ?? ["image/jpeg", "image/png"];
	if (!allowed.includes(file.type))
		return fail(`${options.label} must be a JPG or PNG image.`);
	if (file.size > options.maxMb * 1024 * 1024)
		return fail(
			`${options.label} must be smaller than ${options.maxMb}MB.`,
		);

	if (
		typeof window !== "undefined" &&
		options.minWidth &&
		options.minHeight
	) {
		const url = URL.createObjectURL(file);
		const result = await new Promise<ValidationResult>((resolve) => {
			const img = new window.Image();
			img.onload = () => {
				URL.revokeObjectURL(url);
				if (
					img.width < options.minWidth! ||
					img.height < options.minHeight!
				) {
					resolve(
						fail(
							`${options.label} must be at least ${options.minWidth}x${options.minHeight}.`,
						),
					);
					return;
				}
				resolve(pass(file));
			};
			img.onerror = () => {
				URL.revokeObjectURL(url);
				resolve(fail(`${options.label} is not a valid image.`));
			};
			img.src = url;
		});
		return result;
	}

	return pass(file);
}

export function validateSellerSignUp(data: any) {
	return firstInvalid(
		validateName(data.fullName, "Full name", "fullName"),
		validateEmail(data.email),
		validateRequiredText(data.street, "Street address", "street", 3, 160),
		validateRequiredText(data.city, "City", "city", 2, 80),
		validateRequiredText(data.state, "State / Province", "state", 2, 80),
		validatePostalCode(data.zip),
		validateRequiredText(data.country, "Country", "country", 2, 80),
		validatePassword(data.password, true),
		data.selfPortrait === "true"
			? validateNumber(
					data.portraitPrice,
					"Portrait price",
					"portraitPrice",
					1,
					100000,
				)
			: pass(),
		data.uploadedFile
			? pass()
			: fail("Profile image is required.", "uploadedFile"),
	);
}

export function validateSignIn(data: any) {
	return firstInvalid(
		validateEmail(data.email),
		validatePassword(data.password, false),
	);
}

export function validateListing(data: any, requireFile = true) {
	return firstInvalid(
		validateRequiredText(data.title, "Artwork title", "title", 3, 100),
		validateSelect(data.category, "Category", "category", ART_CATEGORIES),
		validateRequiredText(data.medium, "Medium / Style", "medium", 2, 80),
		validateRequiredText(
			data.description,
			"Description",
			"description",
			20,
			1500,
		),
		validateNumber(data.price, "Price", "price", 1, 100000),
		validateNumber(data.quantity, "Quantity", "quantity", 1, 10000, true),
		validateSelect(
			data.listingType,
			"Listing type",
			"listingType",
			LISTING_TYPES,
		),
		requireFile && !data.uploadedFile
			? fail("Artwork image is required.", "uploadedFile")
			: pass(),
	);
}

export function validateProfile(data: any) {
	return firstInvalid(
		validateName(data.fullName, "Full name", "fullName"),
		validateRequiredText(data.country, "Country", "country", 2, 80),
		validateRequiredText(data.city, "City", "city", 2, 80),
		validateRequiredText(data.address, "Address", "address", 3, 160),
		validatePostalCode(data.postalCode),
		data.selfPortrait
			? validateNumber(
					data.portraitPrice,
					"Portrait price",
					"portraitPrice",
					1,
					100000,
				)
			: pass(),
	);
}

export function validateCheckout(
	data: any,
	type: "digital" | "physical" | "portrait",
) {
	return firstInvalid(
		validateName(data.firstName, "First name", "firstName"),
		validateName(data.lastName, "Last name", "lastName"),
		validateEmail(data.email),
		validatePhone(data.phoneNumber),
		validateRequiredText(
			data.address,
			type === "digital" ? "Billing address" : "Shipping address",
			"address",
			3,
			160,
		),
		validateRequiredText(data.city, "City", "city", 2, 80),
		validatePostalCode(data.postalCode),
		type === "digital"
			? validateSelect(
					data.licenseType,
					"License type",
					"licenseType",
					LICENSE_TYPES,
				)
			: pass(),
		type === "physical"
			? validateSelect(
					data.shippingMethod,
					"Shipping method",
					"shippingMethod",
					SHIPPING_METHODS,
				)
			: pass(),
		type === "portrait" && !data.uploadedFile
			? fail("Reference photo is required.", "uploadedFile")
			: pass(),
	);
}

export function validateExploreFilters(data: any) {
	const min =
		data.minPrice === undefined || data.minPrice === ""
			? undefined
			: Number(data.minPrice);
	const max =
		data.maxPrice === undefined || data.maxPrice === ""
			? undefined
			: Number(data.maxPrice);

	return firstInvalid(
		data.search
			? validateRequiredText(data.search, "Search", "search", 2, 80)
			: pass(),
		data.type
			? validateSelect(data.type, "Type", "type", [
					"digital",
					"physical",
					"all",
				])
			: pass(),
		data.sort
			? validateSelect(data.sort, "Sort option", "sort", SORT_OPTIONS)
			: pass(),
		min !== undefined
			? validateNumber(min, "Minimum price", "minPrice", 0, 100000)
			: pass(),
		max !== undefined
			? validateNumber(max, "Maximum price", "maxPrice", 1, 100000)
			: pass(),
		min !== undefined && max !== undefined && min > max
			? fail(
					"Minimum price cannot be greater than maximum price.",
					"price",
				)
			: pass(),
	);
}
