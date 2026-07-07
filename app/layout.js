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
    default: "Tishbite Digital | Cape Town Web Design & SEO",
    template: "%s | Tishbite Digital",
  },

  description:
    "Tishbite Digital helps small businesses and new entrepreneurs in Cape Town get more clients online with lead-generating websites, SEO, Google visibility, and growth-focused digital systems.",

  keywords: [
    "web development Cape Town",
    "SEO Cape Town",
    "small business website South Africa",
    "entrepreneur digital marketing",
    "digital marketing agency South Africa",
    "lead generation websites",
    "WhatsApp marketing",
    "startup website Cape Town",
    "Google Business Profile optimization",
  ],

  icons: {
    icon: "/assets/tishbite_digital_favicon.svg",
    shortcut: "/assets/tishbite_digital_favicon.svg",
    apple: "/assets/tishbite_digital_favicon.svg",
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Tishbite Digital | Cape Town Web Design & SEO",
    description:
      "Tishbite Digital helps Cape Town businesses get more clients online with lead-generating websites, SEO, Google visibility, and growth-focused digital systems.",
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
