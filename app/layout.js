import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import PublicWrapper from "@/components/PublicWrapper";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.tishbitedigital.co.za"),

  title: {
    default: "Tishbite Digital | Web Design, SEO & Digital Growth in South Africa",
    template: "%s | Tishbite Digital",
  },

  description:
    "Tishbite Digital helps small businesses and new entrepreneurs across South Africa get more clients online with lead-generating websites, SEO, Google visibility, and growth-focused digital systems.",

  keywords: [
    "web development South Africa",
    "SEO services South Africa",
    "small business website South Africa",
    "entrepreneur digital marketing South Africa",
    "digital marketing agency South Africa",
    "lead generation websites South Africa",
    "WhatsApp marketing South Africa",
    "startup website South Africa",
    "website design company South Africa",
    "Google Business Profile optimization South Africa",
    "SME digital marketing South Africa",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Tishbite Digital | Web Design, SEO & Digital Growth in South Africa",
    description:
      "Tishbite Digital helps small businesses and new entrepreneurs across South Africa get more clients online with lead-generating websites, SEO, Google visibility, and growth-focused digital systems.",
    url: "/",
    siteName: "Tishbite Digital",
    locale: "en_ZA",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="flex flex-col min-h-screen bg-bg text-text-dark">
        <PublicWrapper>{children}</PublicWrapper>
      </body>
    </html>
  );
}
