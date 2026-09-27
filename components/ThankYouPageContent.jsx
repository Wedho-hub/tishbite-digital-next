"use client";

import Script from "next/script";
import Link from "next/link";
import { FaWhatsapp, FaArrowRight } from "react-icons/fa";
import { getOfferBySlug } from "@/lib/leadOffers";

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Both look like real IDs but aren't wired to a real Meta/Google account —
// swap them in .env.local (see .env.example) once you have real ones.
const isPlaceholder = (id) => !id || id.startsWith("REPLACE_");

export default function ThankYouPageContent({ offerSlug }) {
  const offer = getOfferBySlug(offerSlug);
  const offerLabel = offer?.offerLabel || "resource";
  const headline = offer?.thankYouHeadline || "You're all set!";
  const body = offer?.thankYouBody || "Check your inbox shortly.";
  const offerLabelJson = JSON.stringify(offerLabel);

  const waMessage = `Hi Tishbite, I just requested my free ${offerLabel}`;
  const waHref = `https://wa.me/27791684548?text=${encodeURIComponent(waMessage)}`;

  return (
    <>
      {!isPlaceholder(FB_PIXEL_ID) && (
        <Script id="fb-pixel-lead" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB_PIXEL_ID}');
          fbq('track', 'PageView');
          fbq('track', 'Lead', { content_name: ${offerLabelJson} });`}
        </Script>
      )}

      {!isPlaceholder(GA_MEASUREMENT_ID) && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
          <Script id="ga-lead" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
            gtag('event', 'generate_lead', { event_category: 'lead', event_label: ${offerLabelJson} });`}
          </Script>
        </>
      )}

      <section className="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl border border-primary/10 shadow-lg p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-200 flex items-center justify-center mx-auto mb-6">
            <FaWhatsapp size={34} className="text-[#25d366]" aria-hidden="true" />
          </div>

          <h1
            className="text-2xl font-extrabold text-primary-dark mb-3"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {headline}
          </h1>

          <p className="text-text-muted text-sm leading-relaxed mb-8">{body}</p>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-[#25d366] text-white font-bold text-base no-underline hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 mb-4"
          >
            <FaWhatsapp size={20} aria-hidden="true" /> Chat on WhatsApp Now
          </a>

          <Link href="/" className="inline-flex items-center justify-center gap-2 text-primary font-semibold text-sm no-underline">
            Back to Home <FaArrowRight size={11} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
