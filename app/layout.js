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
  title: {
    default: "Tishbite Digital | Cape Town Web Design & SEO",
    template: "%s | Tishbite Digital",
  },
  icons: {
    icon: "/assets/tishbite_digital_favicon.svg",
    shortcut: "/assets/tishbite_digital_favicon.svg",
    apple: "/assets/tishbite_digital_favicon.svg",
  },
  description:
    "Tishbite Digital helps Cape Town businesses get more clients online with lead-generating websites, SEO, Google visibility, WhatsApp funnels, and growth-focused digital systems.",
  metadataBase: new URL("https://tishbitedigital.co.za"),
  openGraph: {
    siteName: "Tishbite Digital",
    locale: "en_ZA",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="flex flex-col min-h-screen bg-bg text-text-dark">
        <PublicWrapper>{children}</PublicWrapper>
      </body>
    </html>
  );
}
