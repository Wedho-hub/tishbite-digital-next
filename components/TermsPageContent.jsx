import PageHeader from "@/components/PageHeader";

const SECTIONS = [
  {
    heading: "1. Introduction",
    body: [
      "These Terms of Service (\"Terms\") govern your use of the Tishbite Digital website and any services you engage us to provide. By using this website, submitting an enquiry, or purchasing a service, you agree to these Terms.",
      "Tishbite Digital is currently operated directly by its founder, Wellington Dhliwayo, based in Cape Town, South Africa. As the business grows, staff or contractors may act on our behalf to handle client communication, project delivery, or support — any such team members remain bound by these same Terms.",
    ],
  },
  {
    heading: "2. Our Services",
    body: [
      "We provide web design and development, SEO, paid advertising, branding, CRM/automation setup, and related digital growth services. The specific scope, deliverables, timeline and pricing for any project are agreed in writing (via a proposal, quote, or onboarding form) before work begins.",
    ],
  },
  {
    heading: "3. Quotes, Payments & Refunds",
    body: [
      "Quoted prices are valid for the period stated in the quote and are in South African Rand (ZAR) unless otherwise agreed. Online payments made through our checkout are processed securely by PayFast.",
      "Deposits and installment payments are non-refundable once work has commenced, as they cover time and resources already committed to your project. Refunds for services not yet started may be considered at our discretion, on a case-by-case basis.",
    ],
  },
  {
    heading: "4. Client Responsibilities",
    body: [
      "You agree to provide accurate information, timely feedback, and any content (text, images, logins, or access) reasonably required for us to deliver the agreed service. Delays in providing this may affect project timelines.",
    ],
  },
  {
    heading: "5. Intellectual Property",
    body: [
      "Upon full payment, ownership of the final deliverables (e.g. website code, designs) created specifically for your project transfers to you, excluding any third-party tools, licenses, stock assets, or pre-existing Tishbite Digital frameworks and code libraries used to build it, which remain licensed for your use but not owned by you.",
      "We reserve the right to showcase completed work in our portfolio, case studies, and marketing materials unless you request otherwise in writing.",
    ],
  },
  {
    heading: "6. Third-Party Services",
    body: [
      "Some services (e.g. hosting, domain registration, PayFast payment processing, Google/Meta advertising platforms) are provided by third parties under their own terms. We are not liable for outages, policy changes, or issues arising from third-party platforms outside our control.",
    ],
  },
  {
    heading: "7. Limitation of Liability",
    body: [
      "While we work to deliver measurable results, we cannot guarantee specific business outcomes (e.g. rankings, sales volume, or lead numbers), as these depend on factors outside our control such as market conditions and third-party platform algorithms.",
      "To the extent permitted by law, our liability for any claim relating to our services is limited to the amount you paid us for the specific service giving rise to the claim.",
    ],
  },
  {
    heading: "8. Cancellations",
    body: [
      "Either party may cancel an ongoing project by giving written notice. You remain responsible for payment of work completed up to the cancellation date. Retainer or subscription-based services may be cancelled per the notice period agreed at signup.",
    ],
  },
  {
    heading: "9. Governing Law",
    body: [
      "These Terms are governed by the laws of the Republic of South Africa. Any disputes will be subject to the jurisdiction of the South African courts.",
    ],
  },
  {
    heading: "10. Changes to These Terms",
    body: [
      "We may update these Terms from time to time. Continued use of our website or services after changes are posted constitutes acceptance of the updated Terms.",
    ],
  },
  {
    heading: "11. Contact Us",
    body: [
      "Questions about these Terms can be sent to info@tishbitedigital.co.za or +27 79 168 4548.",
    ],
  },
];

export default function TermsPageContent() {
  return (
    <>
      <PageHeader
        title="Terms of Service"
        subtitle="The terms that apply when you use this website or engage Tishbite Digital's services"
      />
      <section className="py-14 bg-bg">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-text-muted text-sm mb-10">
            Last updated: 17 September 2026
          </p>

          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <div key={section.heading}>
                <h2
                  className="text-xl font-bold text-primary-dark mb-3"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {section.heading}
                </h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-text-muted text-sm leading-relaxed mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
