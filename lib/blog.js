import { visit } from "unist-util-visit";
import GithubSlugger from "github-slugger";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/* ── Cover image focus ─────────────────────────────────────────────────
   Maps the coverFocus schema value to a CSS object-position. Tailwind
   can't safely generate `object-${focus}` from a runtime value (its
   scanner only picks up class names that appear literally in source),
   so this is applied as an inline style instead. */
export function coverObjectPosition(focus) {
  const positions = { center: "center", top: "top", bottom: "bottom", left: "left", right: "right" };
  return positions[focus] || "center";
}

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
// takeaways comes from a one-per-line textarea (its sentences often
// contain commas themselves), tags/keywords from a single-line
// comma-separated input — split on newlines when present, commas
// otherwise, so one helper serves both without either admin UI
// fighting the server's parsing.
const splitList = (value) => {
  if (Array.isArray(value)) return value;
  const str = String(value || "");
  const parts = str.includes("\n") ? str.split("\n") : str.split(",");
  return parts.map((v) => v.trim()).filter(Boolean);
};

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
    authorBio: body.authorBio,
    authorAvatar: body.authorAvatar,
    metaTitle: body.metaTitle,
    metaDescription: body.metaDescription,
  };

  if (body.featured !== undefined) payload.featured = body.featured === true || body.featured === "true";
  if (body.ctaVariant) payload.ctaVariant = body.ctaVariant;
  if (body.coverFocus) payload.coverFocus = body.coverFocus;
  if (body.videoOrientation) payload.videoOrientation = body.videoOrientation;
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
    .replace(/https?:\/\/[^\s)]+/g, protect) // bare URLs
    // Directive attribute blocks (:::pullquote{cite="..."}, ::cta{title="..."}).
    // remark-directive requires literal straight quotes here to parse the
    // attributes at all — curlying them below silently breaks every
    // hand-authored directive into plain text with no error, since the
    // auto-inserted CTA (built as an mdast node directly, not parsed from
    // this syntax) was the only directive path ever exercised against the
    // real post-cleaning pipeline before this was caught.
    .replace(/(:::|::)[a-zA-Z][\w-]*\{[^}]*\}/g, protect);

  out = out
    .replace(/(?<!-)---(?!-)/g, "—")
    .replace(/(?<!-)--(?!-)/g, "–")
    .replace(/(^|[\s([{])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/(^|[\s([{])'/g, "$1‘")
    .replace(/'/g, "’");

  // remark-directive's single-colon textDirective syntax is a
  // micromark extension, so it tokenizes ":word" at PARSE time —
  // before any remark plugin in the chain runs. A scripture reference
  // like "Joshua 22:10-34" has its ":10-34" silently fragmented into
  // separate text nodes this way (harmless on its own, since adjacent
  // text nodes render identically to one — this was the same root
  // cause behind the original "Invalid tag" crash fixed elsewhere in
  // this file). That fragmentation defeats remarkScriptureRefs, which
  // needs the whole reference in one text node to match it. Standing
  // in for the colon with U+2237 here — before parsing ever sees it —
  // sidesteps the trigger entirely; remarkScriptureRefs swaps it back
  // to ":" when building the visible span.
  out = out.replace(
    /\b((?:[1-3]\s)?[A-Z][a-z]+)\s(\d{1,3}):(\d{1,3}(?:[-–]\d{1,3})?)\b/g,
    (_, book, chapter, verse) => `${book} ${chapter}∷${verse}`
  );

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

/* ── Short field cleaning (excerpt, deck, metaDescription) ─────────────
   The same cue-stripping/typography pass applied to the article body,
   for the short admin-authored fields rendered as preview text on the
   blog index, category pages, and article meta tags — kept here
   (rather than duplicated per page) after a real bug where the index
   page rendered a raw, un-cleaned excerpt straight from the DB. */
export function cleanField(text) {
  return applySmartTypography(stripProductionCues(String(text || "")));
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

/* ── Category counts ──────────────────────────────────────────────────
   Shared by the blog index (filter chips + sidebar) and category pages
   so both compute the same category list from the same posts array,
   rather than two separate groupings that could silently disagree. */
export function getCategoryCounts(posts) {
  const counts = new Map();
  for (const post of posts) {
    if (!post.category) continue;
    counts.set(post.category, (counts.get(post.category) || 0) + 1);
  }
  return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}

/* ── Pre-publish checklist ────────────────────────────────────────────
   Shared by the admin editor's live checklist panel and `npm run
   lint:post` (scripts/lint-post.mjs) — one implementation instead of
   two that could silently drift apart (the same failure mode
   pickBlogPayload's own comment warns about). Every check here is
   advisory, never blocking. Accepts a post-shaped object (DB document
   or the admin form's own state normalized to the same shape). */
export function getChecklistWarnings(post) {
  const warnings = [];
  const content = String(post.content || "");
  const hasImage = Boolean(post.image);

  const excerpt = String(post.excerpt || "");
  if (!excerpt.trim()) {
    warnings.push("No excerpt — search engines will fall back to an auto-generated snippet.");
  } else if (excerpt.length > 160) {
    warnings.push(`Excerpt is ${excerpt.length} characters — meta descriptions get cut off past ~160.`);
  }

  if (!String(post.category || "").trim()) warnings.push("No category selected.");
  if (!String(post.deck || "").trim()) warnings.push("No deck/standfirst set.");
  if (!hasImage) warnings.push("No cover image.");
  if (hasImage && !String(post.coverAlt || "").trim()) warnings.push("Cover image has no alt text.");
  if (!String(post.author || "").trim()) warnings.push("No author set.");

  const tags = Array.isArray(post.tags)
    ? post.tags
    : String(post.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
  if (!tags.length) warnings.push("No tags — related posts and filtering rely on these.");

  if (content.trim() && !/^##?\s/m.test(content)) {
    warnings.push("No headings in the content — long posts read better with section breaks.");
  }
  if (content && stripProductionCues(content) !== content) {
    warnings.push("Looks like a leftover script cue ([Pause], [B-roll]...) is still in the content.");
  }
  if (/(?<!-)--(?!-)/.test(content.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, ""))) {
    warnings.push('Contains "--" or "---" — these get auto-converted to dashes, double check it reads right.');
  }
  if (/^#\s+/m.test(content)) {
    warnings.push("Content contains a level-1 (#) heading — the page already renders the title as the H1; start section numbering at ## instead.");
  }

  const effectMatches = content.match(/:::\w+|::\w+\{|==[^=]+==/g) || [];
  if (effectMatches.length > 3) {
    warnings.push(`${effectMatches.length} editorial effects (pull quotes, callouts, highlights...) in one post — more than 2-3 can overwhelm the page.`);
  }

  return warnings;
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
/* ── Heading plain text (slug-safe) ───────────────────────────────────
   Approximates hast-util-to-string's output for a heading line: inline
   code/links/images/emphasis collapse to their inner text, same as the
   rendered DOM, so a slug computed here matches the id rehype-slug
   assigns to the real heading. Unlike markdownToPlainText, inline code
   content is KEPT (toString(<code>x</code>) is "x", not dropped). */
function headingPlainText(raw) {
  return String(raw || "")
    .replace(/\\(.)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .trim();
}

/* ── Shared "N. Heading" split ────────────────────────────────────────
   Used by both remarkMagazineHeadings (which actually restructures the
   heading node) and extractHeadings (which has to predict the id that
   restructuring will produce, without rendering anything). Keeping the
   split logic in one place means the two can never drift apart and
   silently break the sidebar ToC's anchor links. */
function splitMagazineNumber(text) {
  const match = String(text || "").match(/^(\d+)\.\s+(.*)$/);
  if (!match) return null;
  return { num: match[1].padStart(2, "0"), rest: match[2] };
}

/* ── Table of contents extraction ─────────────────────────────────────
   Walks the raw (cleaned) Markdown for heading lines and slugifies them
   with the same github-slugger instance semantics rehype-slug uses
   (one instance, reset once, every heading depth visited in document
   order) so the ids produced here line up exactly with the ids the
   real render assigns — this runs on the Markdown string, ahead of
   React rendering, so the sidebar ToC can link to anchors before the
   article body itself has rendered.

   Depth-2 headings get the same "N. " -> number-prefix split applied
   by remarkMagazineHeadings before slugifying: splitting "1. Altars…"
   into a <span>01</span> sibling changes the heading's concatenated
   text (hast-util-to-string, which rehype-slug slugifies) from
   "1. Altars…" to "01Altars…" — predicting that exact string here is
   what keeps these ids matching the real rendered ids. */
export function extractHeadings(markdown, { tocDepths = [2, 3] } = {}) {
  const slugger = new GithubSlugger();
  const lines = String(markdown || "").split("\n");
  const headings = [];
  let inFence = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!match) continue;

    const depth = match[1].length;
    const rawText = headingPlainText(match[2].trim());
    const split = depth === 2 ? splitMagazineNumber(rawText) : null;
    const slugInput = split ? `${split.num}${split.rest}` : rawText;
    const id = slugger.slug(slugInput);
    if (!tocDepths.includes(depth)) continue;

    const text = split ? split.rest : rawText;
    headings.push({ depth, id, text });
  }

  return headings;
}

/* ── Remark plugin: scripture references -> small-caps span ────────────
   Matches "Book C:V" / "Book C:V-V" (e.g. "Joshua 22:10-34", "1 Kings
   12:26-33") anywhere in body text — including inside an existing
   link, which is fine, small-caps styling on linked text is still
   valid HTML and still reads as a reference. Purely visual (not a
   validated book-name list or an auto-link), so a few false positives
   on an unrelated "Word 12:34"-shaped phrase are an acceptable
   trade-off for not hand-maintaining a list of 66+ book names. */
// Matches the placeholder applySmartTypography already substituted for
// the reference's colon (see that function for why) — not a literal
// ":", which would never reach here intact in the first place.
const SCRIPTURE_REF_PATTERN = /\b(?:[1-3]\s)?[A-Z][a-z]+\s\d{1,3}∷\d{1,3}(?:[-–]\d{1,3})?\b/g;

export function remarkScriptureRefs() {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || typeof index !== "number") return undefined;
      SCRIPTURE_REF_PATTERN.lastIndex = 0;
      if (!SCRIPTURE_REF_PATTERN.test(node.value)) return undefined;
      SCRIPTURE_REF_PATTERN.lastIndex = 0;

      const parts = [];
      let lastEnd = 0;
      let match;
      while ((match = SCRIPTURE_REF_PATTERN.exec(node.value))) {
        if (match.index > lastEnd) parts.push({ type: "text", value: node.value.slice(lastEnd, match.index) });
        parts.push({
          type: "scriptureRef",
          data: { hName: "span", hProperties: { className: ["scripture-ref"] } },
          children: [{ type: "text", value: match[0].replace("∷", ":") }],
        });
        lastEnd = match.index + match[0].length;
      }
      if (lastEnd < node.value.length) parts.push({ type: "text", value: node.value.slice(lastEnd) });

      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });
  };
}

/* ── Remark plugin: ==highlight== -> <mark> ─────────────────────────────
   Not part of CommonMark/GFM, so this is hand-rolled rather than pulled
   in as another dependency. Splits matching text nodes and gives the
   middle segment a custom node type (never "text", which remark-rehype
   always renders literally regardless of `data.hName`) so the same
   hName/hProperties bridge used for directives turns it into a real
   <mark> element. */
export function remarkHighlightMark() {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || typeof index !== "number" || !node.value.includes("==")) return undefined;
      const parts = node.value.split(/==([^=]+)==/);
      if (parts.length === 1) return undefined;

      const replacement = parts
        .map((part, i) =>
          i % 2 === 1
            ? {
                type: "highlightMark",
                data: { hName: "mark" },
                children: [{ type: "text", value: part }],
              }
            : { type: "text", value: part }
        )
        .filter((n) => n.type !== "text" || n.value !== "");

      parent.children.splice(index, 1, ...replacement);
      return index + replacement.length;
    });
  };
}

/* ── Remark plugin: numbered H2s -> split-out marker span ──────────────
   The site's articles already write their own "## 1. Heading" numbers
   by hand — this doesn't add numbering, it pulls an existing leading
   "N. " out of the heading text into its own <span class="h2-num">
   child so CSS can style the number as a magazine-style marker without
   JS. Only touches depth-2 headings. This DOES change the heading's
   concatenated text content (the "N. " separator is dropped, not just
   visually hidden) — extractHeadings predicts that exact change via
   the shared splitMagazineNumber() so its ToC ids still match what
   rehype-slug assigns here. */
export function remarkMagazineHeadings() {
  return (tree) => {
    visit(tree, "heading", (node) => {
      if (node.depth !== 2) return;
      const first = node.children?.[0];
      if (!first || first.type !== "text") return;
      const split = splitMagazineNumber(first.value);
      if (!split) return;

      first.value = split.rest;
      node.children.unshift({
        type: "magazineHeadingNumber",
        data: { hName: "span", hProperties: { className: ["h2-num"] } },
        children: [{ type: "text", value: split.num }],
      });
    });
  };
}

/* ── Rehype plugin: lone image paragraphs -> <figure>/<figcaption> ─────
   `![alt](src)` is an inline image, so remark always wraps it in a
   <p>. When that <p> contains nothing but the image, promote it to a
   block-level <figure> and surface the alt text as a visible caption
   — a <figure> inside a <p> would be invalid HTML and risks a
   hydration mismatch, so this runs on the hast tree (after
   remark-rehype), replacing the <p> itself rather than nesting inside
   it. */
export function rehypeFigureImages() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "p" || !parent || typeof index !== "number") return;
      if (node.children.length !== 1 || node.children[0].tagName !== "img") return;

      const img = node.children[0];
      const alt = img.properties?.alt;
      const children = [img];
      if (alt) {
        children.push({
          type: "element",
          tagName: "figcaption",
          properties: {},
          children: [{ type: "text", value: alt }],
        });
      }

      parent.children[index] = {
        type: "element",
        tagName: "figure",
        properties: {},
        children,
      };
    });
  };
}

function hastNodeText(node) {
  if (node.type === "text") return node.value;
  if (node.children) return node.children.map(hastNodeText).join("");
  return "";
}

/* ── Rehype plugin: "Further reading" heading -> styled sources block ──
   Finds a depth-2/3 heading whose text starts with "Further reading",
   "Sources" or "References" and wraps it plus everything up to the
   next heading (or the end of the article) in a `.sources-block` div
   — pure structural promotion, same heading-detection pattern as
   remarkMagazineHeadings, just on the hast tree since it needs to
   look at a run of SIBLING nodes rather than one node's own children.
   Authors keep writing an ordinary "## Further reading" + list; no
   new directive syntax to learn. */
export function rehypeSourcesSection() {
  return (tree) => {
    const children = tree.children;
    let startIndex = -1;
    let endIndex = children.length;

    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.type !== "element" || !/^h[23]$/.test(node.tagName)) continue;

      if (startIndex === -1) {
        if (/^(further reading|sources|references)\b/i.test(hastNodeText(node).trim())) {
          startIndex = i;
        }
        continue;
      }

      endIndex = i;
      break;
    }

    if (startIndex === -1) return;

    const section = children.splice(startIndex, endIndex - startIndex);
    children.splice(startIndex, 0, {
      type: "element",
      tagName: "div",
      properties: { className: ["sources-block"] },
      children: section,
    });
  };
}

/* ── Auto-inserted mid-article conversion point ─────────────────────────
   Most authors won't remember to type a `:::cta` block, so if the post's
   chosen ctaVariant isn't "none" and the raw content has no manual cta
   directive already, one is inserted automatically around the
   article's midpoint (just before the middle H2) so every post gets a
   mid-article conversion point without the author having to ask for
   one. Skipped entirely for short posts with fewer than 2 H2s — too
   short to need a mid-article break. */
const CTA_VARIANT_COPY = {
  audit: { title: "Want eyes on your own website?", button: "Get a Free Audit", href: "/contact" },
  whatsapp: {
    title: "Got a question about this? Ask us directly.",
    button: "Message us on WhatsApp",
    href: "https://wa.me/27640584229?text=Hi%20Tishbite%20Digital,%20I%20read%20your%20blog%20and%20had%20a%20question.",
  },
  newsletter: { title: "Enjoying this? Get more like it.", button: "Get in touch", href: "/contact" },
};

export function remarkAutoInsertCta(variant) {
  // Pre-migration posts in the DB predate the ctaVariant field and have
  // it as undefined, not the schema default — treat a missing value
  // the same as an explicit "audit" rather than silently skipping the
  // conversion point.
  const resolved = variant || "audit";
  return (tree) => {
    if (resolved === "none" || !CTA_VARIANT_COPY[resolved]) return;

    const hasManualCta = tree.children.some(
      (node) => (node.type === "containerDirective" || node.type === "leafDirective") && node.name === "cta"
    );
    if (hasManualCta) return;

    const headingIndexes = [];
    tree.children.forEach((node, i) => {
      if (node.type === "heading" && node.depth === 2) headingIndexes.push(i);
    });
    if (headingIndexes.length < 2) return;

    const insertAt = headingIndexes[Math.floor(headingIndexes.length / 2)];
    const copy = CTA_VARIANT_COPY[resolved];
    tree.children.splice(insertAt, 0, {
      type: "ctaBlock",
      data: { hName: "cta", hProperties: copy },
      children: [],
    });
  };
}

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

/* ── Shared ReactMarkdown plugin lists ──────────────────────────────────
   The public article page, the admin live preview, and the style guide
   all need to render Markdown through the exact same pipeline — "the
   same real renderer" only means something if there's truly one
   definition of it. Building the arrays here instead of in three
   call sites is the same drift-prevention pattern as pickBlogPayload
   and getChecklistWarnings. */
export function getArticleRemarkPlugins(ctaVariant) {
  return [
    remarkGfm,
    remarkDirective,
    [remarkAutoInsertCta, ctaVariant],
    remarkDirectiveToHast,
    remarkMagazineHeadings,
    remarkHighlightMark,
    remarkScriptureRefs,
    remarkDowngradeH1,
  ];
}

export function getArticleRehypePlugins() {
  return [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }], rehypeFigureImages, rehypeSourcesSection];
}
