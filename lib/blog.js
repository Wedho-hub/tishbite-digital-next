import { visit } from "unist-util-visit";

/* ── Slug ──────────────────────────────────────────────────────────── */
export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/* ── Shared create/update payload picker ──────────────────────────────
   Used by both POST and PUT so the two never silently drift (a past
   real bug here: the admin form collected fields the API didn't pick,
   and Mongoose silently stripped them). */
const splitList = (value) =>
  Array.isArray(value) ? value : String(value || "").split(",").map((v) => v.trim()).filter(Boolean);

export function pickBlogPayload(body = {}) {
  const payload = {
    title: body.title,
    content: body.content,
    deck: body.deck,
    excerpt: body.excerpt,
    category: body.category,
    videoUrl: body.videoUrl,
    author: body.author,
    coverAlt: body.coverAlt,
    coverCaption: body.coverCaption,
    coverCredit: body.coverCredit,
    metaTitle: body.metaTitle,
    metaDescription: body.metaDescription,
  };

  if (body.featured !== undefined) payload.featured = body.featured === true || body.featured === "true";
  if (body.ctaVariant) payload.ctaVariant = body.ctaVariant;
  if (body.tags !== undefined) payload.tags = splitList(body.tags);
  if (body.takeaways !== undefined) payload.takeaways = splitList(body.takeaways);
  if (body.keywords !== undefined) payload.keywords = splitList(body.keywords);

  return payload;
}

/* ── Unique slug generation ───────────────────────────────────────────
   Auto-generates a slug from the title (editable in the admin form).
   Appends -2, -3, ... on collision with another post. `excludeId` lets
   an update check uniqueness against every OTHER post, not itself. */
export async function generateUniqueSlug(Model, title, { preferred, excludeId } = {}) {
  const base = slugify(preferred || title) || "post";
  let candidate = base;
  let n = 2;
  for (;;) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Model.exists(query);
    if (!exists) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
}

/* ── Typographic replacement ──────────────────────────────────────────
   -- -> en dash, --- -> em dash, straight quotes -> curly quotes.
   (remark-smartypants runs but silently no-ops when wired through
   react-markdown's internally-built processor in this project's bundler
   setup — confirmed with debug logging that the plugin executes without
   transforming anything, most likely a dual-package-instance issue
   between react-markdown's dynamic import and a statically-imported
   remark plugin. A direct string transform sidesteps that entirely and
   is easy to reason about.) Applied to raw Markdown before parsing;
   skips fenced/inline code and link destinations so URLs and code
   samples are never mangled. */
export function applySmartTypography(markdown) {
  const text = String(markdown || "");
  const protectedSegments = [];
  const protect = (match) => {
    protectedSegments.push(match);
    return `\u0000${protectedSegments.length - 1}\u0000`;
  };

  let out = text
    .replace(/```[\s\S]*?```/g, protect) // fenced code
    .replace(/`[^`]*`/g, protect) // inline code
    .replace(/\(https?:\/\/[^\s)]+\)/g, protect) // markdown link destinations
    .replace(/https?:\/\/[^\s)]+/g, protect); // bare URLs

  out = out
    .replace(/(?<!-)---(?!-)/g, "—")
    .replace(/(?<!-)--(?!-)/g, "–")
    .replace(/(^|[\s([{])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/(^|[\s([{])'/g, "$1‘")
    .replace(/'/g, "’");

  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => protectedSegments[Number(i)]);
}

/* ── Production/script cues ───────────────────────────────────────────
   Strips [Pause], \[Pause\], [B-roll: ...], [Music], [SFX], etc. — both
   the plain and backslash-escaped forms, since authors pasting from a
   script doc often bring the escaped version in. Collapses the
   whitespace left behind so the following text flows naturally. */
const CUE_PATTERN = /\*{0,2}\\?\[\s*(pause|b-?roll[^\]]*|music|sfx|sound effect|cut to|voice ?over|narrator)\s*\\?\]\*{0,2}\s*/gi;

export function stripProductionCues(markdown) {
  return String(markdown || "").replace(CUE_PATTERN, "").replace(/[ \t]{2,}/g, " ");
}

/* ── Leading H1 that duplicates the page title ────────────────────────
   The page's own <h1> is the post title; a Markdown body that also
   opens with "# <same title>" produces two H1s. Strip it when it
   matches (normalized, case/punctuation-insensitive). */
export function stripDuplicateLeadingH1(markdown, title) {
  const text = String(markdown || "");
  const lines = text.split("\n");
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  const match = lines[i]?.match(/^#\s+(.+?)\s*$/);
  if (!match) return text;

  const normalize = (s) => s.trim().toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
  if (normalize(match[1]) !== normalize(title || "")) return text;

  lines.splice(0, i + 1);
  return lines.join("\n").replace(/^\s+/, "");
}

/* ── Plain-text conversion (for excerpts, read time, search) ──────────── */
export function markdownToPlainText(markdown) {
  return String(markdown || "")
    .replace(/\\(.)/g, "$1") // unescape \X -> X
    .replace(/```[\s\S]*?```/g, " ") // fenced code
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images -> alt text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/^>\s?/gm, "") // blockquote markers
    .replace(/^[-*+]\s+/gm, "") // bullet markers
    .replace(/^\d+\.\s+/gm, "") // numbered list markers
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1") // bold/italic
    .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1") // strikethrough
    .replace(/==([^=]+)==/g, "$1") // ==highlight==
    .replace(/^-{3,}\s*$/gm, " ") // hr
    .replace(/:::\w*(\{[^}]*\})?/g, " ") // directive fences
    .replace(CUE_PATTERN, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ── Excerpt / meta description ───────────────────────────────────────
   Clean plain text, cut at a word boundary, max `max` chars. */
export function cleanExcerpt(markdown, max = 155) {
  const plain = markdownToPlainText(markdown);
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 20 ? lastSpace : max)}…`;
}

/* ── Read time ─────────────────────────────────────────────────────── */
export function estimateReadTime(markdown, wpm = 220) {
  const words = markdownToPlainText(markdown).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wpm));
}

/* ── Remark plugin: downgrade any remaining H1 to H2 ───────────────────
   Belt-and-braces alongside stripDuplicateLeadingH1 — even an H1 that
   doesn't match the title (e.g. an unrelated subtitle) must never
   render as a second <h1> on the page. */
export function remarkDowngradeH1() {
  return (tree) => {
    visit(tree, "heading", (node) => {
      if (node.depth === 1) node.depth = 2;
    });
  };
}

/* ── Remark plugin: remark-directive containers -> hast tag names ──────
   remark-directive parses `:::name{attrs}` (container) and `::name{attrs}`
   (leaf) into mdast nodes — this tells mdast-util-to-hast (which
   remark-rehype/react-markdown use internally) to treat each directive's
   `name` as the output tag, so `:::pullquote` becomes a `<pullquote>`
   element react-markdown's `components` map can intercept, same as any
   real HTML tag.

   remark-directive ALSO parses a single-colon ":name" inline form
   ("textDirective"), which none of this site's blocks use — but that
   syntax false-positives on ordinary prose containing a colon followed
   by a word, e.g. a Bible reference like "Joshua 22:10--34" parses
   "10--34" as a directive name, which then fails further down as an
   invalid tag. Since nothing here intentionally uses that form, any
   textDirective node is un-parsed back into plain text instead of being
   converted, so prose round-trips exactly as written. */
export function remarkDirectiveToHast() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (node.type === "containerDirective" || node.type === "leafDirective") {
        node.data = node.data || {};
        node.data.hName = node.name;
        node.data.hProperties = node.attributes || {};
        return;
      }
      if (node.type === "textDirective" && parent && typeof index === "number") {
        const prefix = { type: "text", value: `:${node.name}` };
        parent.children.splice(index, 1, prefix, ...(node.children || []));
        return index; // re-visit from the same index after the splice
      }
    });
  };
}
