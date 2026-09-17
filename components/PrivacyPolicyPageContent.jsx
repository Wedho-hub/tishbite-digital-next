import PageHeader from "@/components/PageHeader";

const SECTIONS = [
  {
    heading: "1. Who We Are",
    body: [
      "Tishbite Digital (\"we\", \"us\", \"our\") is a Cape Town-based digital agency providing web design, SEO, advertising, and related digital services to small businesses and entrepreneurs in South Africa.",
      "Tishbite Digital is currently operated directly by its founder, Wellington Dhliwayo, who acts as the Information Officer responsible for data protection compliance under POPIA. As the business grows, staff or contractors may join to help handle client communication and project delivery — anyone who does will be bound by the same confidentiality and data protection obligations set out in this Policy.",
      "This Privacy Policy explains what personal information we collect through this website, how we use it, and the rights you have over it under the Protection of Personal Information Act 4 of 2013 (POPIA).",
    ],
  },
  {
    heading: "2. Information We Collect",
    body: [
      "We collect personal information you provide directly to us, including:",
    ],
    list: [
      "Name, email address, phone number and business details submitted via our contact form, onboarding form, or WhatsApp",
      "Project or enquiry details you share with us to request a quote or service",
      "Billing and transaction details processed when you pay for services online (handled by our payment processor, PayFast — see Section 4)",
      "Basic usage data such as pages visited and general location, collected automatically via standard web analytics",
    ],
  },
  {
    heading: "3. How We Use Your Information",
    body: ["We use the information we collect to:"],
    list: [
      "Respond to enquiries and provide quotes for our services",
      "Deliver, manage and invoice the services you have engaged us for",
      "Communicate with you about your project via email, phone or WhatsApp",
      "Improve our website and service offering",
      "Meet legal, accounting and tax obligations",
    ],
  },
  {
    heading: "4. Sharing Your Information",
    body: [
      "We do not sell your personal information. We only share it with trusted third parties where necessary to run our business, including:",
    ],
    list: [
      "PayFast (Pty) Ltd — to securely process online payments. PayFast handles your card and billing details directly under its own privacy policy; we do not store your full card details on our systems.",
      "Our hosting and database providers — to operate this website and store enquiry records securely.",
      "Where required by law, regulation, or a valid legal process.",
    ],
  },
  {
    heading: "5. Cookies & Analytics",
    body: [
      "This site may use essential cookies and basic analytics tools to understand how visitors use the site and to improve performance. These do not identify you personally beyond general usage patterns.",
    ],
  },
  {
    heading: "6. Data Security",
    body: [
      "We take reasonable technical and organisational measures to protect your personal information against loss, unauthorised access, or disclosure. All checkout traffic is encrypted (SSL/TLS), and PayFast is PCI-DSS compliant for payment handling.",
    ],
  },
  {
    heading: "7. Data Retention",
    body: [
      "We retain enquiry, project and billing records for as long as necessary to provide our services and to meet our legal and tax record-keeping obligations, after which the information is deleted or anonymised.",
    ],
  },
  {
    heading: "8. Your Rights Under POPIA",
    body: ["You have the right to:"],
    list: [
      "Request access to the personal information we hold about you",
      "Request correction of inaccurate or outdated information",
      "Request deletion of your personal information, subject to our legal retention obligations",
      "Object to the processing of your information, or withdraw consent where processing is based on consent",
      "Lodge a complaint with the Information Regulator of South Africa if you believe your information has been mishandled",
    ],
  },
  {
    heading: "9. Contact Us",
    body: [
      "For any privacy-related requests or questions, contact our Information Officer, Wellington Dhliwayo, at info@tishbitedigital.co.za or +27 79 168 4548.",
    ],
  },
  {
    heading: "10. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The \"Last updated\" date below indicates the most recent revision.",
    ],
  },
];

export default function PrivacyPolicyPageContent() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        subtitle="How Tishbite Digital collects, uses and protects your personal information"
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
                {section.list && (
                  <ul className="space-y-2 list-disc pl-5 text-text-muted text-sm leading-relaxed">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
