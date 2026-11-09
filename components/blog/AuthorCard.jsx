import Image from "next/image";

// Falls back to the site's own About page bio/photo when a post has no
// per-author override — so existing and future posts don't require
// re-entering this every time, matching how ctaVariant/coverFocus etc.
// already default rather than requiring every field on every post.
const DEFAULT_AUTHOR = {
  name: "Wellington Dhliwayo",
  bio: "Founder and lead developer at Tishbite Digital — a full-stack web developer based in Cape Town, with 10 years as a trade-tested journeyman before code. Builds websites, SEO and digital growth systems for small businesses across South Africa.",
  avatar: "/assets/profilePic.jpg",
};

export default function AuthorCard({ author, authorBio, authorAvatar }) {
  const name = author || DEFAULT_AUTHOR.name;
  const bio = authorBio || DEFAULT_AUTHOR.bio;
  const avatar = authorAvatar || DEFAULT_AUTHOR.avatar;

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-primary/10 bg-surface-tint p-5 my-10">
      <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 bg-primary/10">
        <Image src={avatar} alt={name} fill sizes="56px" className="object-cover" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-primary mb-1">Written by</p>
        <p className="font-editorial text-lg font-semibold text-primary-dark mb-1">{name}</p>
        <p className="text-text-muted text-sm leading-relaxed">{bio}</p>
      </div>
    </div>
  );
}
