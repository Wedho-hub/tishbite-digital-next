"use client";

import { useState } from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { trackEvent } from "@/lib/analytics";

// Click-to-load facade — the real <iframe> (and everything YouTube loads
// alongside it) only mounts after a genuine click, instead of on page load.
// Fixes both the LCP hit and the third-party tracking that fires the
// instant a full YouTube iframe is in the DOM.
export default function LiteYouTube({ id, title, orientation = "landscape" }) {
  const [playing, setPlaying] = useState(false);
  if (!id) return null;

  const aspectClass = orientation === "portrait" ? "aspect-[9/16]" : "aspect-video";
  const imgSizes = orientation === "portrait" ? "(max-width: 768px) 70vw, 320px" : "(max-width: 768px) 100vw, 68ch";

  if (playing) {
    return (
      <div className={`relative w-full ${aspectClass} rounded-xl overflow-hidden shadow-md`}>
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          title={title || "YouTube video"}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent("video_play", { video_id: id, title });
        setPlaying(true);
      }}
      aria-label={`Play video${title ? `: ${title}` : ""}`}
      className={`group relative w-full ${aspectClass} rounded-xl overflow-hidden shadow-md block border-0 p-0 cursor-pointer bg-surface-dark`}
    >
      <Image
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        fill
        sizes={imgSizes}
        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
      />
      <div className="absolute inset-0 bg-surface-dark/25 group-hover:bg-surface-dark/10 transition-colors duration-300" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <FaPlay className="text-primary-dark ml-1" size={22} aria-hidden="true" />
        </span>
      </span>
      {title && (
        <span className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-surface-dark/80 to-transparent text-white text-sm font-semibold text-left">
          {title}
        </span>
      )}
    </button>
  );
}
