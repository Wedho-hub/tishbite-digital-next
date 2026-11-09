# Writing a magazine-ready blog post

The blog's design comes entirely from the rendering pipeline (`lib/blog.js` +
`components/blog/*`), not from per-post styling. Write plain Markdown using the
conventions below and it comes out magazine-ready automatically — see
`/blog/style-guide` for a live render of every block described here, and
`content/TEMPLATE.md` for a copy-pasteable starting post.

**Never add inline styles, custom classes, or raw HTML to a post's content.**
If something doesn't look right, fix the pipeline (`lib/blog.js` /
`components/blog/*`), not the post.

## Admin fields

Set these in the admin editor (`/admin/blogs`), not in the Markdown body:

- **Title** — becomes the page's one `<h1>`. Don't also write `# Title` in the
  body; a leading `# ` that duplicates the title is stripped automatically
  anyway, but it's cleaner not to write it.
- **Slug** — auto-follows the title until you edit it directly. Don't change
  it on a post that's already been shared/indexed.
- **Deck** — the one-line standfirst shown under the headline.
- **Category** — pick from existing categories or add a new one.
- **Excerpt** — used for the meta description and preview cards. Keep it
  under 160 characters (the admin shows a live counter).
- **Tags**, **Author**, **Cover image** (+ alt text, caption, credit, and a
  **focus point** if the photo has text or an off-center subject that
  shouldn't get cropped out), **Featured**, **Mid-article CTA**, **Key
  takeaways** — all self-explanatory in the editor.
- **Video URL** + **orientation** — set orientation to Portrait/Shorts for a
  vertical video; it renders as a 9:16 frame beside the text on desktop
  instead of a letterboxed 16:9 box.
- **Author bio / avatar** — optional per-post override; defaults to the site
  author bio if left blank.

## Automatic body styling (no markup needed)

- The **first paragraph** gets a drop cap automatically.
- Any heading written as `## 1. Section title` has its number pulled into a
  styled marker — just write the number, nothing else.
- `==highlighted text==` becomes a highlighter-style mark.
- A scripture-style reference like `Joshua 22:10-34` gets small-caps styling
  automatically — no markup, just write it normally.
- A `## Further reading` (or `## Sources` / `## References`) heading followed
  by a list is automatically promoted into a styled, hanging-indent sources
  block.
- A lone image on its own line (`![alt](url)`) becomes a captioned figure
  using its alt text as the caption.
- If you don't manually add a `::cta` block and the post's CTA variant isn't
  "none", one is inserted automatically around the midpoint of the article.

## Directive blocks (type these directly into the Markdown)

```
:::pullquote{cite="Source name"}
A striking line worth pulling out on its own.
:::

:::callout{type="tip" title="Heads up"}
A short, useful note. `type` is one of: tip, warning, note, success.
:::

:::keypoints{title="Key takeaways"}
- First point
- Second point
:::

::cta{title="Want help with this?" button="Get a Free Audit" href="/contact"}

::youtube{id="VIDEO_ID" title="Video title"}
```

**Use straight double quotes (`"`) inside `{...}` attributes, not curly
quotes.** The admin editor's "Insert block" toolbar buttons already do this
correctly — if you're typing directives by hand, don't let your editor
autocorrect the quotes.

## Effects budget

Keep it to 2-3 editorial effects (pull quotes, callouts, highlights) per
post — more than that starts to overwhelm the page. The admin's pre-publish
checklist (and `npm run lint:post`) will warn you if a post goes over.

## Pre-publish checks

- The admin editor shows a live, non-blocking checklist (missing excerpt/
  category/cover alt/tags/author, no headings, leftover script cues like
  `[Pause]`, stray `--`/`---`, too many effects).
- Run `npm run lint:post` to check every post in the database at once —
  useful before a release or in CI. Same checks, same `lib/blog.js`
  implementation, so the two can never silently disagree.
- Use the live preview pane in the admin editor — it's the exact same
  renderer and CSS as the public page, not an approximation.
