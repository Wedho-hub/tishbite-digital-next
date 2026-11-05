import Link from "next/link";
import { slugify } from "@/lib/blog";

export default function CategoryChips({ categories, activeCategory }) {
  if (!categories?.length) return null;

  return (
    <nav className="flex flex-wrap gap-2 mb-10" aria-label="Filter by category">
      <Link
        href="/blog"
        className={`px-4 py-2 rounded-full text-sm font-semibold no-underline transition-colors ${
          !activeCategory ? "bg-primary-dark text-white" : "bg-primary/8 text-primary hover:bg-primary/15"
        }`}
      >
        All
      </Link>
      {categories.map(({ name, count }) => (
        <Link
          key={name}
          href={`/blog/category/${slugify(name)}`}
          className={`px-4 py-2 rounded-full text-sm font-semibold no-underline transition-colors ${
            activeCategory === name ? "bg-primary-dark text-white" : "bg-primary/8 text-primary hover:bg-primary/15"
          }`}
        >
          {name} <span className="opacity-60">({count})</span>
        </Link>
      ))}
    </nav>
  );
}
