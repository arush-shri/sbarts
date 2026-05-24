import {
	AlertTriangle,
	Ban,
	Copyright,
	CreditCard,
	Download,
	FileText,
	Gavel,
	Globe,
	Scale,
	Shield,
	Truck,
	UserCheck,
} from "lucide-react";
import React from "react";

const sections = [
	"Introduction",
	"Definitions",
	"Marketplace Nature of Service",
	"Seller Responsibilities",
	"Buyer Responsibilities",
	"Payments & Fees",
	"Stripe & Third-Party Payment Processing",
	"Digital Product Delivery",
	"Physical Product Shipping",
	"Refund & Cancellation Policy",
	"Intellectual Property & Copyright",
	"Prohibited Content",
	"DMCA / Copyright Infringement Process",
	"Limitation of Liability",
	"Account-Free / Guest Usage Policy",
	"Dispute Resolution",
	"Privacy & Data Usage",
	"Platform Rights & Content Removal",
	"International Usage",
	"Termination of Access",
	"Changes to Terms",
	"Contact Information",
];

const sectionIcons: Record<string, React.ReactNode> = {
	Introduction: <FileText size={18} />,
	Definitions: <Scale size={18} />,
	"Marketplace Nature of Service": <Globe size={18} />,
	"Seller Responsibilities": <UserCheck size={18} />,
	"Buyer Responsibilities": <Shield size={18} />,
	"Payments & Fees": <CreditCard size={18} />,
	"Stripe & Third-Party Payment Processing": <CreditCard size={18} />,
	"Digital Product Delivery": <Download size={18} />,
	"Physical Product Shipping": <Truck size={18} />,
	"Refund & Cancellation Policy": <Gavel size={18} />,
	"Intellectual Property & Copyright": <Copyright size={18} />,
	"Prohibited Content": <Ban size={18} />,
	"DMCA / Copyright Infringement Process": <AlertTriangle size={18} />,
	"Limitation of Liability": <Shield size={18} />,
	"Account-Free / Guest Usage Policy": <UserCheck size={18} />,
	"Dispute Resolution": <Scale size={18} />,
	"Privacy & Data Usage": <Shield size={18} />,
	"Platform Rights & Content Removal": <Ban size={18} />,
	"International Usage": <Globe size={18} />,
	"Termination of Access": <Ban size={18} />,
	"Changes to Terms": <FileText size={18} />,
	"Contact Information": <FileText size={18} />,
};

const getSectionId = (title: string) =>
	title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const TermsAndConditionsPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-white text-[#0F1724]">
			<section className="bg-[#fbfbfd] px-5 pt-28 pb-14 border-b border-[#0000001A] lg:px-20">
				<div className="max-w-5xl">
					<div className="inline-flex items-center gap-2 rounded-lg bg-[#f4f7ff] px-4 py-2 text-sm font-semibold text-[#0061f2]">
						<Shield size={16} />
						Terms & Conditions
					</div>

					<h1 className="mt-5 max-w-4xl text-4xl font-bold text-[#0F1724] sm:text-5xl">
						Marketplace Terms & Conditions
					</h1>

					<p className="mt-5 max-w-3xl text-lg leading-8 text-[#6b7280]">
						These Terms & Conditions govern access to and use of
						SBArts, a marketplace where artists and collectors buy
						and sell digital and physical artwork.
					</p>

					<div className="mt-8 flex flex-wrap gap-3 text-sm text-[#6b7280]">
						<span className="rounded-lg border border-[#0000001A] bg-white px-4 py-2">
							Last Updated: May 24, 2026
						</span>
						<span className="rounded-lg border border-[#0000001A] bg-white px-4 py-2">
							Worldwide Marketplace
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
					<TermsSection title="Introduction">
						<p>
							Welcome to SBArts. By accessing or using the
							platform, you agree to comply with these Terms &
							Conditions. These terms apply to artists, sellers,
							buyers, guests, and visitors.
						</p>
						<p>
							Our platform enables independent creators to list
							and sell digital and physical artwork to buyers
							worldwide.
						</p>
					</TermsSection>

					<TermsSection title="Definitions">
						<ul className="list-disc space-y-3 pl-5">
							<li>
								<strong>Platform</strong> refers to the SBArts
								website and marketplace services.
							</li>
							<li>
								<strong>Seller</strong> refers to any artist or
								creator listing artwork.
							</li>
							<li>
								<strong>Buyer</strong> refers to any individual
								purchasing artwork.
							</li>
							<li>
								<strong>Digital Artwork</strong> includes
								downloadable digital files, illustrations, or
								media.
							</li>
							<li>
								<strong>Physical Artwork</strong> includes
								paintings, prints, photographs, and shipped
								products.
							</li>
						</ul>
					</TermsSection>

					<TermsSection title="Marketplace Nature of Service">
						<p>
							The platform acts as an intermediary marketplace
							between buyers and sellers. We do not own,
							manufacture, inspect, or guarantee listed artwork.
						</p>
						<p>
							Sellers are independently responsible for their
							listings, shipping, taxes, intellectual property
							rights, and buyer obligations.
						</p>
					</TermsSection>

					<TermsSection title="Seller Responsibilities">
						<ul className="list-disc space-y-3 pl-5">
							<li>
								Sellers must own or possess all legal rights
								necessary to upload and sell artwork.
							</li>
							<li>
								Sellers are responsible for accurate
								descriptions, pricing, taxes, and fulfillment.
							</li>
							<li>
								Sellers must not upload stolen, copyrighted,
								illegal, hateful, misleading, or prohibited
								content.
							</li>
							<li>
								Sellers are responsible for shipping physical
								items within reasonable timelines.
							</li>
							<li>
								Sellers must comply with applicable local and
								international laws.
							</li>
						</ul>
					</TermsSection>

					<TermsSection title="Buyer Responsibilities">
						<ul className="list-disc space-y-3 pl-5">
							<li>
								Buyers agree to provide accurate payment and
								delivery information.
							</li>
							<li>
								Purchased digital artwork may not be
								redistributed, resold, or commercially reused
								unless explicitly permitted.
							</li>
							<li>
								Buyers must review listing details carefully
								before purchasing.
							</li>
						</ul>
					</TermsSection>

					<TermsSection title="Payments & Fees">
						<p>
							Payments are securely processed through Stripe and
							affiliated payment providers.
						</p>
						<p>
							The platform may charge commission fees, transaction
							fees, or service fees on purchases and seller
							payouts.
						</p>
						<p>
							Sellers authorize the platform to deduct applicable
							fees before Stripe Connect payouts are issued.
						</p>
					</TermsSection>

					<TermsSection title="Stripe & Third-Party Payment Processing">
						<p>
							Payment processing services are provided by Stripe
							and may be subject to Stripe&apos;s own agreements,
							policies, and compliance requirements.
						</p>
						<p>
							The platform does not store complete payment card
							information on its servers.
						</p>
					</TermsSection>

					<TermsSection title="Digital Product Delivery">
						<p>
							Digital products are delivered electronically
							through secure download systems after successful
							payment confirmation.
						</p>
						<ul className="list-disc space-y-3 pl-5">
							<li>Downloads may include expiration periods.</li>
							<li>Download limits may apply.</li>
							<li>
								Buyers are responsible for maintaining backups
								of purchased files.
							</li>
						</ul>
					</TermsSection>

					<TermsSection title="Physical Product Shipping">
						<p>
							Sellers are responsible for packaging, shipping,
							customs declarations, and delivery of physical
							artwork.
						</p>
						<p>
							Delivery timelines may vary based on location,
							shipping carrier, customs processing, and seller
							handling time.
						</p>
						<p>
							The platform is not responsible for delays caused by
							shipping partners, customs authorities, or external
							logistics providers.
						</p>
					</TermsSection>

					<TermsSection title="Refund & Cancellation Policy">
						<p>
							Refund eligibility may vary depending on the artwork
							type and seller policies.
						</p>
						<ul className="list-disc space-y-3 pl-5">
							<li>
								Digital downloads are generally non-refundable
								once accessed or downloaded.
							</li>
							<li>
								Physical product disputes should first be
								resolved directly between buyer and seller.
							</li>
							<li>
								The platform may intervene in cases involving
								fraud or policy violations.
							</li>
						</ul>
					</TermsSection>

					<TermsSection title="Intellectual Property & Copyright">
						<p>
							Sellers retain ownership of their original artwork
							unless otherwise stated.
						</p>
						<p>
							Buyers receive only the usage rights explicitly
							granted by the seller or listing license terms.
						</p>
						<p>
							Unauthorized reproduction, redistribution, minting,
							or resale of digital artwork is prohibited.
						</p>
					</TermsSection>

					<TermsSection title="Prohibited Content">
						<ul className="list-disc space-y-3 pl-5">
							<li>Illegal or fraudulent material</li>
							<li>Copyright-infringing content</li>
							<li>Hateful or abusive content</li>
							<li>NSFW or exploitative material</li>
							<li>
								Malware, harmful files, or deceptive downloads
							</li>
							<li>
								Content promoting violence or illegal activities
							</li>
						</ul>
					</TermsSection>

					<TermsSection title="DMCA / Copyright Infringement Process">
						<p>
							We respect intellectual property rights and respond
							to valid copyright complaints.
						</p>
						<p>
							Rights holders may submit takedown requests
							including proof of ownership and identification of
							infringing material.
						</p>
						<p>
							We reserve the right to suspend or permanently
							remove repeat infringers.
						</p>
					</TermsSection>

					<TermsSection title="Limitation of Liability">
						<p>
							The platform is provided on an &quot;as is&quot; and
							&quot;as available&quot; basis without warranties of
							any kind.
						</p>
						<p>We are not liable for:</p>
						<ul className="list-disc space-y-3 pl-5">
							<li>Seller conduct or buyer disputes</li>
							<li>Loss of revenue or profits</li>
							<li>Shipping delays or damaged items</li>
							<li>Unauthorized access caused by third parties</li>
							<li>Temporary platform interruptions</li>
						</ul>
					</TermsSection>

					<TermsSection title="Account-Free / Guest Usage Policy">
						<p>
							Buyers may purchase artwork as guests without
							creating an account.
						</p>
						<p>
							Guest users remain fully subject to these Terms &
							Conditions and applicable purchase policies.
						</p>
					</TermsSection>

					<TermsSection title="Dispute Resolution">
						<p>
							Users agree to attempt good-faith resolution of
							disputes before initiating legal proceedings.
						</p>
						<p>
							The platform may offer mediation assistance for
							certain disputes but is not obligated to resolve
							every transaction disagreement.
						</p>
					</TermsSection>

					<TermsSection title="Privacy & Data Usage">
						<p>
							User information is processed according to our
							Privacy Policy.
						</p>
						<p>
							We may collect information necessary for account
							management, payments, fraud prevention, analytics,
							and marketplace functionality.
						</p>
					</TermsSection>

					<TermsSection title="Platform Rights & Content Removal">
						<p>
							We reserve the right to remove listings, suspend
							sellers, or restrict access where fraud, abuse,
							infringement, policy violations, or suspicious
							activity is detected.
						</p>
						<p>
							Content moderation decisions may be made at our sole
							discretion.
						</p>
					</TermsSection>

					<TermsSection title="International Usage">
						<p>
							The platform is accessible internationally. Users
							are responsible for complying with laws applicable
							in their jurisdiction.
						</p>
						<p>
							Cross-border purchases may involve customs duties,
							taxes, or import restrictions outside our control.
						</p>
					</TermsSection>

					<TermsSection title="Termination of Access">
						<p>
							We may suspend or terminate platform access at any
							time for policy violations, fraudulent activity,
							abuse, or legal compliance reasons.
						</p>
						<p>
							Termination may result in removal of listings,
							withholding of payouts pending investigation, or
							permanent account restrictions.
						</p>
					</TermsSection>

					<TermsSection title="Changes to Terms">
						<p>
							We reserve the right to update or modify these Terms
							& Conditions at any time.
						</p>
						<p>
							Continued use of the platform after changes become
							effective constitutes acceptance of the revised
							terms.
						</p>
					</TermsSection>

					<TermsSection title="Contact Information">
						<p>
							For legal inquiries, copyright concerns, or support
							requests, please contact:
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
					</TermsSection>

					<div className="rounded-lg bg-[#f4f7ff] p-6 text-center sm:p-8">
						<h3 className="text-xl font-semibold text-[#0F1724]">
							Thank you for using SBArts
						</h3>
						<p className="mx-auto mt-3 max-w-2xl text-[#6b7280]">
							By continuing to use the platform, you acknowledge
							that you have read, understood, and agreed to these
							Terms & Conditions.
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

type TermsSectionProps = {
	title: string;
	children: React.ReactNode;
};

const TermsSection: React.FC<TermsSectionProps> = ({ title, children }) => {
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

export default TermsAndConditionsPage;
