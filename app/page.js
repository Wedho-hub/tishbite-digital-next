import HomePageContent from "@/components/HomePageContent";

export const metadata = {
  title: "Cape Town Web Design, SEO & Lead Generation | Tishbite Digital",
  description:
    "Websites, SEO, and digital systems built for small businesses and new entrepreneurs in Cape Town — turn online traffic into real leads and sales.",
  keywords: [
    "Cape Town web design",
    "Cape Town SEO",
    "small business website Cape Town",
    "new entrepreneur digital marketing",
    "lead generation",
    "WhatsApp marketing",
    "startup website South Africa",
    "digital marketing Cape Town",
  ],
  alternates: {
    canonical: "https://www.tishbitedigital.co.za/",
  },
  openGraph: {
    title: "Digital Growth for Cape Town Small Businesses & Entrepreneurs",
    description:
      "Websites. SEO. Ads. Built to generate leads, sales, and WhatsApp enquiries for small businesses and new entrepreneurs.",
    url: "https://www.tishbitedigital.co.za/",
    images: [
      {
        url: "https://www.tishbitedigital.co.za/assets/tishbiteHero.png",
        width: 1200,
        height: 630,
        alt: "Tishbite Digital — Cape Town Digital Marketing Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.tishbitedigital.co.za/assets/tishbiteHero.png"],
  },
};

const SOCIAL_PROFILES = [
  "https://web.facebook.com/profile.php?id=61584656188539",
  "https://www.instagram.com/tishbitedigital/",
  "https://za.pinterest.com/Tishbite_Digital/",
  "https://g.page/r/CcbaVAYMBDDAEBM",
];

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.tishbitedigital.co.za/#website",
      name: "Tishbite Digital",
      alternateName: "Tishbite Digital Cape Town",
      url: "https://www.tishbitedigital.co.za/",
    },
    {
      "@type": "Organization",
      "@id": "https://www.tishbitedigital.co.za/#organization",
      name: "Tishbite Digital",
      url: "https://www.tishbitedigital.co.za/",
      logo: {
        "@type": "ImageObject",
        url: "https://www.tishbitedigital.co.za/assets/tishbite_digital_logo.svg",
        caption: "Tishbite Digital Logo",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+27791684548",
        contactType: "customer service",
        availableLanguage: ["English"],
        areaServed: "ZA",
      },
      sameAs: SOCIAL_PROFILES,
    },
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": "https://www.tishbitedigital.co.za/#localbusiness",
      name: "Tishbite Digital",
      url: "https://www.tishbitedigital.co.za/",
      telephone: "+27791684548",
      priceRange: "R2500 – R30000+",
      currenciesAccepted: "ZAR",
      paymentAccepted: "Cash, EFT, Installment Plans",
      areaServed: [
        { "@type": "City", name: "Cape Town" },
        { "@type": "City", name: "Bellville" },
        { "@type": "City", name: "Claremont" },
        { "@type": "City", name: "Stellenbosch" },
        { "@type": "City", name: "Somerset West" },
        { "@type": "City", name: "Paarl" },
        { "@type": "State", name: "Western Cape" },
        { "@type": "Country", name: "South Africa" },
      ],
      description:
        "Tishbite Digital helps small businesses and new entrepreneurs in Cape Town get more clients online through websites, SEO, ads, WhatsApp lead generation, and automation.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cape Town",
        addressRegion: "Western Cape",
        addressCountry: "ZA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -33.9249,
        longitude: 18.4241,
      },
      hasMap: "https://g.page/r/CcbaVAYMBDDAEBM",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
      image: "https://www.tishbitedigital.co.za/assets/tishbiteHero.png",
      sameAs: SOCIAL_PROFILES,
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />
      <HomePageContent />
    </>
  );
}
