"use client";

import { useState } from "react";
import { FaCheck, FaFacebookF, FaLink, FaLinkedinIn, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { trackEvent } from "@/lib/analytics";

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { key: "whatsapp", icon: FaWhatsapp, label: "Share on WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { key: "twitter", icon: FaTwitter, label: "Share on X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { key: "linkedin", icon: FaLinkedinIn, label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { key: "facebook", icon: FaFacebookF, label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent("share_click", { channel: "copy_link", url });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (older browser, insecure context) — no-op.
    }
  };

  return (
    <div className="flex items-center gap-2">
      {links.map(({ key, icon: Icon, label, href }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          onClick={() => trackEvent("share_click", { channel: key, url })}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/8 text-primary hover:bg-primary hover:text-white transition-colors duration-200"
        >
          <Icon size={14} aria-hidden="true" />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/8 text-primary hover:bg-primary hover:text-white transition-colors duration-200"
      >
        {copied ? <FaCheck size={14} aria-hidden="true" /> : <FaLink size={14} aria-hidden="true" />}
      </button>
    </div>
  );
}
