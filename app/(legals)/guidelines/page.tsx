import {
	BadgeCheck,
	Brush,
	Camera,
	CreditCard,
	Download,
	FileImage,
	ListChecks,
	PackageCheck,
	Palette,
	ShieldCheck,
	Truck,
	UserRound,
} from "lucide-react";
import React from "react";

const sections = [
	"Getting Started",
	"Seller Account Requirements",
	"Stripe Payout Setup",
	"Profile Guidelines",
	"Listing Requirements",
	"Artwork Image Standards",
	"Digital Artwork Sales",
	"Physical Artwork Sales",
	"Self Portrait Commissions",
	"Pricing & Inventory",
	"Orders & Fulfillment",
	"Content Rules",
	"Best Practices",
	"Contact & Support",
];

const sectionIcons: Record<string, React.ReactNode> = {
	"Getting Started": <Palette size={18} />,
	"Seller Account Requirements": <UserRound size={18} />,
	"Stripe Payout Setup": <CreditCard size={18} />,
	"Profile Guidelines": <BadgeCheck size={18} />,
	"Listing Requirements": <ListChecks size={18} />,
	"Artwork Image Standards": <FileImage size={18} />,
	"Digital Artwork Sales": <Download size={18} />,
	"Physical Artwork Sales": <Truck size={18} />,
	"Self Portrait Commissions": <Brush size={18} />,
	"Pricing & Inventory": <PackageCheck size={18} />,
	"Orders & Fulfillment": <ShieldCheck size={18} />,
	"Content Rules": <Camera size={18} />,
	"Best Practices": <BadgeCheck size={18} />,
	"Contact & Support": <UserRound size={18} />,
};

const getSectionId = (title: string) =>
	title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const SellerGuidelinesPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-white text-[#0F1724]">
			<section className="bg-[#fbfbfd] px-5 pt-28 pb-14 border-b border-[#0000001A] lg:px-20">
				<div className="max-w-5xl">
					<div className="inline-flex items-center gap-2 rounded-lg bg-[#f4f7ff] px-4 py-2 text-sm font-semibold text-[#0061f2]">
						<Palette size={16} />
						Seller Guidelines
					</div>

					<h1 className="mt-5 max-w-4xl text-4xl font-bold text-[#0F1724] sm:text-5xl">
						Selling Your Artwork on SBArts
					</h1>

					<p className="mt-5 max-w-3xl text-lg leading-8 text-[#6b7280]">
						These guidelines explain how sellers can create a
						trusted profile, publish digital or physical artwork,
						handle orders, and offer self portrait commissions on
						SBArts.
					</p>

					<div className="mt-8 flex flex-wrap gap-3 text-sm text-[#6b7280]">
						<span className="rounded-lg border border-[#0000001A] bg-white px-4 py-2">
							For Artists & Independent Sellers
						</span>
						<span className="rounded-lg border border-[#0000001A] bg-white px-4 py-2">
							Digital Art, Paintings, Photography & Portraits
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
					<GuidelineSection title="Getting Started">
						<p>
							SBArts lets sellers publish artwork for collectors
							to buy as digital downloads or physical items.
							Sellers can also choose to offer self portrait
							commissions from their profile.
						</p>
						<p>
							To begin, create a seller account, complete Stripe
							onboarding, upload a profile image, and add your
							first listing from the seller dashboard.
						</p>
					</GuidelineSection>

					<GuidelineSection title="Seller Account Requirements">
						<ul className="list-disc space-y-3 pl-5">
							<li>Use your real name or public artist name.</li>
							<li>Provide a valid email address.</li>
							<li>
								Add a complete physical address for seller
								verification and fulfillment.
							</li>
							<li>
								Create a secure password with at least 8
								characters.
							</li>
							<li>
								Upload a seller profile image before submitting
								your account.
							</li>
						</ul>
					</GuidelineSection>

					<GuidelineSection title="Stripe Payout Setup">
						<p>
							SBArts uses Stripe Connect for seller payouts. After
							registration, you may be redirected to Stripe to
							complete onboarding.
						</p>
						<p>
							If Stripe onboarding is incomplete, the dashboard
							will ask you to finish setup before continuing.
							Stripe may request identity, banking, tax, or
							business information depending on your country.
						</p>
					</GuidelineSection>

					<GuidelineSection title="Profile Guidelines">
						<ul className="list-disc space-y-3 pl-5">
							<li>
								Use a clear square profile photo of at least 720
								x 720 pixels.
							</li>
							<li>
								Keep your name, city, country, and postal
								address accurate.
							</li>
							<li>
								Enable self portraits only if you actively
								accept custom portrait work.
							</li>
							<li>
								Set a portrait price that reflects the time and
								quality of the commission.
							</li>
						</ul>
					</GuidelineSection>

					<GuidelineSection title="Listing Requirements">
						<p>Every listing should include:</p>
						<ul className="list-disc space-y-3 pl-5">
							<li>A clear artwork title.</li>
							<li>
								A category such as Digital Art, Paintings,
								Photography, or Self Portrait.
							</li>
							<li>
								A medium or style, such as Oil on Canvas,
								Vector, Watercolor, or Digital Illustration.
							</li>
							<li>
								A useful description explaining the artwork,
								inspiration, technique, or included file.
							</li>
							<li>A price greater than 0.</li>
							<li>An available quantity greater than 0.</li>
							<li>
								A listing type: Digital Download or Physical
								Item.
							</li>
						</ul>
					</GuidelineSection>

					<GuidelineSection title="Artwork Image Standards">
						<p>
							Listing images are used to generate marketplace
							thumbnails and watermarked previews. Upload only
							high quality images that represent the artwork
							accurately.
						</p>
						<ul className="list-disc space-y-3 pl-5">
							<li>Accepted formats: JPEG and PNG.</li>
							<li>Maximum file size: 50MB.</li>
							<li>Minimum resolution: 1920 x 1080 pixels.</li>
							<li>Allowed aspect ratios: 1:1, 4:3, or 16:9.</li>
							<li>
								Avoid blurry, dark, heavily cropped, or
								misleading previews.
							</li>
						</ul>
					</GuidelineSection>

					<GuidelineSection title="Digital Artwork Sales">
						<p>
							For digital download listings, SBArts stores the
							original artwork privately and shows buyers a
							watermarked preview before purchase.
						</p>
						<p>
							After successful payment, the buyer receives a
							temporary secure download link. Do not upload files
							you do not own or cannot legally sell.
						</p>
					</GuidelineSection>

					<GuidelineSection title="Physical Artwork Sales">
						<p>
							For physical item listings, sellers are responsible
							for packaging, shipping, and delivery coordination.
							Make sure your quantity reflects real available
							stock.
						</p>
						<ul className="list-disc space-y-3 pl-5">
							<li>Use accurate photos of the actual item.</li>
							<li>
								Mention important details in the description,
								such as size, medium, condition, and framing.
							</li>
							<li>
								Ship items carefully and communicate promptly if
								any issue arises.
							</li>
						</ul>
					</GuidelineSection>

					<GuidelineSection title="Self Portrait Commissions">
						<p>
							Sellers can enable self portrait commissions from
							their profile and set a custom portrait price. When
							a buyer places a portrait order, the seller receives
							the request and uploaded reference image.
						</p>
						<p>
							Only enable this option if you are ready to accept
							custom work, follow buyer requirements, and deliver
							within a reasonable timeline.
						</p>
					</GuidelineSection>

					<GuidelineSection title="Pricing & Inventory">
						<ul className="list-disc space-y-3 pl-5">
							<li>
								Set prices in USD and make sure each price is
								greater than 0.
							</li>
							<li>
								Use quantity to represent available inventory or
								available purchase slots.
							</li>
							<li>
								Update listing details if price, availability,
								or fulfillment expectations change.
							</li>
							<li>
								Keep portrait commission pricing separate from
								standard artwork listing prices.
							</li>
						</ul>
					</GuidelineSection>

					<GuidelineSection title="Orders & Fulfillment">
						<p>
							Your dashboard tracks total sales, active listings,
							items sold, and seller orders. New physical and
							portrait orders may also trigger seller email
							notifications.
						</p>
						<ul className="list-disc space-y-3 pl-5">
							<li>
								Review new orders from your dashboard as soon as
								possible.
							</li>
							<li>
								For physical products, prepare and ship the
								artwork securely.
							</li>
							<li>
								For portrait requests, review the buyer&apos;s
								reference image and requirements.
							</li>
							<li>
								Keep your profile and email address current so
								you do not miss order updates.
							</li>
						</ul>
					</GuidelineSection>

					<GuidelineSection title="Content Rules">
						<ul className="list-disc space-y-3 pl-5">
							<li>
								Only upload artwork you created or have legal
								rights to sell.
							</li>
							<li>
								Do not upload stolen, copyrighted, illegal,
								hateful, misleading, or exploitative content.
							</li>
							<li>
								Do not use listings to sell malware, deceptive
								files, or unrelated products.
							</li>
							<li>
								Do not misrepresent digital files as physical
								items, or physical items as digital downloads.
							</li>
						</ul>
					</GuidelineSection>

					<GuidelineSection title="Best Practices">
						<ul className="list-disc space-y-3 pl-5">
							<li>
								Use descriptive titles that buyers can search
								for easily.
							</li>
							<li>
								Write descriptions that explain the artwork, not
								just the category.
							</li>
							<li>
								Use sharp, well-lit images with the approved
								aspect ratios.
							</li>
							<li>Price consistently across similar works.</li>
							<li>
								Keep your seller profile polished and current.
							</li>
							<li>
								Respond quickly to order or commission-related
								communication.
							</li>
						</ul>
					</GuidelineSection>

					<GuidelineSection title="Contact & Support">
						<p>
							For seller account issues, payout questions, listing
							concerns, or order support, contact SBArts support.
						</p>
						{/* TO CHANGE IN PRODUCTION */}
						<div className="border-l-4 border-[#0061f2] pl-4">
							<p className="font-semibold text-[#0F1724]">
								SBArts Seller Support
							</p>
							<p className="mt-2 text-[#6b7280]">
								Email: support@exampleartmarketplace.com
							</p>
							<p className="text-[#6b7280]">
								Legal: legal@exampleartmarketplace.com
							</p>
						</div>
					</GuidelineSection>

					<div className="rounded-lg bg-[#f4f7ff] p-6 text-center sm:p-8">
						<h3 className="text-xl font-semibold text-[#0F1724]">
							Build a trustworthy seller presence
						</h3>
						<p className="mx-auto mt-3 max-w-2xl text-[#6b7280]">
							Clear listings, accurate images, fair pricing, and
							prompt fulfillment help collectors feel confident
							buying your work.
						</p>
						<div className="mt-6 text-sm text-[#98A0AB]">
							SBArts Seller Guidelines
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

type GuidelineSectionProps = {
	title: string;
	children: React.ReactNode;
};

const GuidelineSection: React.FC<GuidelineSectionProps> = ({
	title,
	children,
}) => {
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

export default SellerGuidelinesPage;
