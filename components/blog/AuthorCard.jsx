import Image from "next/image";
import { DEFAULT_AUTHOR } from "@/lib/blog";

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
