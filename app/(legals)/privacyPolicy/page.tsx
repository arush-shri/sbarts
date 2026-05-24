import {
	AlertTriangle,
	Cookie,
	CreditCard,
	Database,
	Download,
	Eye,
	FileText,
	Fingerprint,
	Globe,
	Lock,
	Mail,
	Shield,
	Truck,
	UserCheck,
} from "lucide-react";
import React from "react";

const sections = [
	"Introduction",
	"Information We Collect",
	"Information Sellers Provide",
	"Information Buyers Provide",
	"Payment Information",
	"Device & Usage Data",
	"Cookies & Tracking Technologies",
	"How We Use Information",
	"Payment Processing via Stripe",
	"Seller Payout Information",
	"Digital File Security",
	"Data Sharing & Third Parties",
	"Shipping & Delivery Partners",
	"International Data Transfers",
	"Data Retention",
	"User Rights & Choices",
	"Account-Free / Guest Usage Data",
	"Security Measures",
	"Children's Privacy",
	"Copyright & DMCA Reporting Data",
	"Changes to Privacy Policy",
	"Contact Information",
];

const sectionIcons: Record<string, React.ReactNode> = {
	Introduction: <FileText size={18} />,
	"Information We Collect": <Database size={18} />,
	"Information Sellers Provide": <UserCheck size={18} />,
	"Information Buyers Provide": <UserCheck size={18} />,
	"Payment Information": <CreditCard size={18} />,
	"Device & Usage Data": <Fingerprint size={18} />,
	"Cookies & Tracking Technologies": <Cookie size={18} />,
	"How We Use Information": <Eye size={18} />,
	"Payment Processing via Stripe": <CreditCard size={18} />,
	"Seller Payout Information": <CreditCard size={18} />,
	"Digital File Security": <Download size={18} />,
	"Data Sharing & Third Parties": <Globe size={18} />,
	"Shipping & Delivery Partners": <Truck size={18} />,
	"International Data Transfers": <Globe size={18} />,
	"Data Retention": <Database size={18} />,
	"User Rights & Choices": <Shield size={18} />,
	"Account-Free / Guest Usage Data": <UserCheck size={18} />,
	"Security Measures": <Lock size={18} />,
	"Children's Privacy": <AlertTriangle size={18} />,
	"Copyright & DMCA Reporting Data": <FileText size={18} />,
	"Changes to Privacy Policy": <FileText size={18} />,
	"Contact Information": <Mail size={18} />,
};

const getSectionId = (title: string) =>
	title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const PrivacyPolicyPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-white text-[#0F1724]">
			<section className="bg-[#fbfbfd] px-5 pt-28 pb-14 border-b border-[#0000001A] lg:px-20">
				<div className="max-w-5xl">
					<div className="inline-flex items-center gap-2 rounded-lg bg-[#f4f7ff] px-4 py-2 text-sm font-semibold text-[#0061f2]">
						<Shield size={16} />
						Privacy Policy
					</div>

					<h1 className="mt-5 max-w-4xl text-4xl font-bold text-[#0F1724] sm:text-5xl">
						Your Privacy & Data Protection
					</h1>

					<p className="mt-5 max-w-3xl text-lg leading-8 text-[#6b7280]">
						This Privacy Policy explains how SBArts collects, uses,
						stores, and protects information from artists, buyers,
						and visitors using the marketplace.
					</p>

					<div className="mt-8 flex flex-wrap gap-3 text-sm text-[#6b7280]">
						<span className="rounded-lg border border-[#0000001A] bg-white px-4 py-2">
							Last Updated: May 24, 2026
						</span>
						<span className="rounded-lg border border-[#0000001A] bg-white px-4 py-2">
							Worldwide Marketplace Platform
						</span>
					</div>
				</div>
			</section>

			<div className="grid grid-cols-1 gap-8 px-5 py-12 lg:grid-cols-[280px_1fr] lg:px-20">
				<aside className="hidden lg:block">
					<div className="sticky top-24 rounded-lg border border-[#0000001A] bg-[#fbfbfd] p-5">
						<h2 className="mb-4 text-sm font-semibold uppercase text-[#0F1724]">
							Table of Contents
						</h2>

						<nav className="space-y-1">
							{sections.map((section) => (
								<a
									key={section}
									href={`#${getSectionId(section)}`}
									className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#6b7280] transition hover:bg-white hover:text-[#0F1724]"
								>
									<span className="text-[#0061f2]">
										{sectionIcons[section]}
									</span>
									<span>{section}</span>
								</a>
							))}
						</nav>
					</div>
				</aside>

				<main className="space-y-6">
					<PolicySection title="Introduction">
						<p>
							We value your privacy and are committed to
							protecting your personal information. This Privacy
							Policy describes how we collect, use, disclose, and
							safeguard information related to users of our
							artwork marketplace platform.
						</p>
						<p>
							By accessing or using the platform, you agree to the
							collection and use of information in accordance with
							this Privacy Policy.
						</p>
					</PolicySection>

					<PolicySection title="Information We Collect">
						<ul className="list-disc space-y-3 pl-5">
							<li>Account registration information</li>
							<li>Artwork uploads and listing metadata</li>
							<li>Transaction and purchase information</li>
							<li>Shipping and delivery details</li>
							<li>Device, browser, and analytics data</li>
							<li>Communications with support or sellers</li>
						</ul>
					</PolicySection>

					<PolicySection title="Information Sellers Provide">
						<p>
							Sellers may provide profile details, artwork
							descriptions, uploaded files, pricing information,
							shipping settings, and tax information.
						</p>
						<p>
							Sellers using Stripe Connect may also provide
							identity, verification, banking, or payout-related
							information directly to Stripe.
						</p>
					</PolicySection>

					<PolicySection title="Information Buyers Provide">
						<p>
							Buyers may provide names, email addresses, billing
							details, shipping addresses, and transaction
							information when making purchases.
						</p>
						<p>
							Guest buyers may provide limited checkout
							information without creating an account.
						</p>
					</PolicySection>

					<PolicySection title="Payment Information">
						<p>
							Payments are securely processed through Stripe and
							affiliated payment processors.
						</p>
						<p>
							The platform does not directly store complete credit
							card or payment account details on its own servers.
						</p>
					</PolicySection>

					<PolicySection title="Device & Usage Data">
						<p>
							We may automatically collect information about
							devices, browsers, IP addresses, operating systems,
							referral sources, pages viewed, and interactions
							with the platform.
						</p>
						<p>
							This information helps improve performance,
							security, and user experience.
						</p>
					</PolicySection>

					<PolicySection title="Cookies & Tracking Technologies">
						<p>Cookies and similar technologies may be used for:</p>
						<ul className="list-disc space-y-3 pl-5">
							<li>Authentication and session management</li>
							<li>Fraud prevention and security monitoring</li>
							<li>Analytics and performance tracking</li>
							<li>Preference storage and personalization</li>
						</ul>
					</PolicySection>

					<PolicySection title="How We Use Information">
						<ul className="list-disc space-y-3 pl-5">
							<li>Provide marketplace functionality</li>
							<li>Process purchases and payouts</li>
							<li>Deliver digital products securely</li>
							<li>Facilitate shipping and communication</li>
							<li>Prevent fraud and abuse</li>
							<li>
								Improve platform performance and reliability
							</li>
							<li>Comply with legal and tax obligations</li>
						</ul>
					</PolicySection>

					<PolicySection title="Payment Processing via Stripe">
						<p>
							Stripe handles payment processing and may
							independently collect and process financial
							information in accordance with Stripe&apos;s own
							privacy policies and legal obligations.
						</p>
						<p>
							Payment information submitted during checkout is
							transmitted securely using encrypted payment
							infrastructure.
						</p>
					</PolicySection>

					<PolicySection title="Seller Payout Information">
						<p>
							Sellers receiving payouts through Stripe Connect may
							be required to provide identity verification
							documents, tax information, and banking details.
						</p>
						<p>
							Such payout information is generally processed
							directly by Stripe rather than stored by the
							platform.
						</p>
					</PolicySection>

					<PolicySection title="Digital File Security">
						<p>
							Digital purchases may generate secure or temporary
							download links to help prevent unauthorized sharing
							or access.
						</p>
						<p>
							Uploaded artwork and associated metadata may be
							stored using secure cloud infrastructure and
							protected access systems.
						</p>
					</PolicySection>

					<PolicySection title="Data Sharing & Third Parties">
						<p>
							We may share necessary information with trusted
							third-party providers involved in platform
							functionality including:
						</p>
						<ul className="list-disc space-y-3 pl-5">
							<li>Payment processors</li>
							<li>Cloud hosting providers</li>
							<li>Analytics services</li>
							<li>Fraud prevention systems</li>
							<li>Customer support platforms</li>
						</ul>
					</PolicySection>

					<PolicySection title="Shipping & Delivery Partners">
						<p>
							Buyer shipping details may be shared with sellers
							and shipping partners for fulfillment and delivery
							of physical artwork.
						</p>
						<p>
							Shipping providers may independently process
							delivery-related information according to their own
							policies.
						</p>
					</PolicySection>

					<PolicySection title="International Data Transfers">
						<p>
							Because the marketplace operates globally,
							information may be transferred to and processed in
							countries outside a user&apos;s home jurisdiction.
						</p>
						<p>
							We take reasonable measures to ensure data is
							handled securely during international transfers.
						</p>
					</PolicySection>

					<PolicySection title="Data Retention">
						<p>
							We may retain transaction records, communications,
							uploaded artwork, and related information for legal
							compliance, tax reporting, fraud prevention, dispute
							handling, and operational purposes.
						</p>
						<p>
							Retention periods may vary depending on applicable
							laws and legitimate business requirements.
						</p>
					</PolicySection>

					<PolicySection title="User Rights & Choices">
						<p>
							Depending on applicable law, users may have rights
							to:
						</p>
						<ul className="list-disc space-y-3 pl-5">
							<li>Access personal data</li>
							<li>Request corrections or updates</li>
							<li>Request deletion of eligible information</li>
							<li>
								Object to certain data processing activities
							</li>
							<li>Withdraw consent where applicable</li>
						</ul>
					</PolicySection>

					<PolicySection title="Account-Free / Guest Usage Data">
						<p>
							Buyers may make purchases as guests without creating
							an account.
						</p>
						<p>
							Guest transactions may still require collection of
							billing, shipping, payment, fraud-prevention, and
							transaction-related information.
						</p>
					</PolicySection>

					<PolicySection title="Security Measures">
						<p>
							We implement reasonable administrative, technical,
							and organizational safeguards designed to protect
							information from unauthorized access, misuse,
							alteration, or disclosure.
						</p>
						<p>
							However, no internet-based service or storage system
							can be guaranteed to be completely secure.
						</p>
					</PolicySection>

					<PolicySection title="Children's Privacy">
						<p>
							The platform is not intended for children under the
							age of 13.
						</p>
						<p>
							We do not knowingly collect personal information
							from children under 13. If such information is
							identified, we may remove it promptly.
						</p>
					</PolicySection>

					<PolicySection title="Copyright & DMCA Reporting Data">
						<p>
							Information submitted through copyright or DMCA
							reporting processes may include contact details,
							proof of ownership, supporting evidence, and
							communications relating to infringement claims.
						</p>
						<p>
							Such information may be retained for legal
							compliance and dispute resolution purposes.
						</p>
					</PolicySection>

					<PolicySection title="Changes to Privacy Policy">
						<p>
							We may update or revise this Privacy Policy from
							time to time.
						</p>
						<p>
							Continued use of the platform after changes become
							effective constitutes acceptance of the updated
							policy.
						</p>
					</PolicySection>

					<PolicySection title="Contact Information">
						<p>
							For privacy inquiries, data requests, or legal
							concerns, please contact:
						</p>
						{/* TO CHANGE IN PRODUCTION */}
						<div className="border-l-4 border-[#0061f2] pl-4">
							<p className="font-semibold text-[#0F1724]">
								SBArts
							</p>
							<p className="mt-2 text-[#6b7280]">
								Email: contact@msbart.com
							</p>
						</div>
					</PolicySection>

					<div className="rounded-lg bg-[#f4f7ff] p-6 text-center sm:p-8">
						<h3 className="text-xl font-semibold text-[#0F1724]">
							Your trust matters to us
						</h3>
						<p className="mx-auto mt-3 max-w-2xl text-[#6b7280]">
							We are committed to maintaining transparent privacy
							practices and protecting user information across our
							global marketplace.
						</p>
						<div className="mt-6 text-sm text-[#98A0AB]">
							Last Updated: May 24, 2026
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

type PolicySectionProps = {
	title: string;
	children: React.ReactNode;
};

const PolicySection: React.FC<PolicySectionProps> = ({ title, children }) => {
	return (
		<section
			id={getSectionId(title)}
			className="scroll-mt-24 rounded-lg border border-[#0000001A] bg-white p-5 shadow-sm sm:p-8"
		>
			<div className="mb-5 flex items-center gap-3">
				<div className="rounded-lg bg-[#f4f7ff] p-2 text-[#0061f2]">
					{sectionIcons[title]}
				</div>

				<h2 className="text-xl font-semibold text-[#0F1724] sm:text-2xl">
					{title}
				</h2>
			</div>

			<div className="space-y-4 leading-8 text-[#6b7280]">{children}</div>
		</section>
	);
};

export default PrivacyPolicyPage;
