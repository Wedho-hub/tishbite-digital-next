<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Blog

The blog's magazine look comes entirely from `lib/blog.js` + `components/blog/*`
— see `docs/MAGAZINE.md`. Do not add per-post hand styling (inline styles,
one-off classes, raw HTML in post content) to make an individual post look
right; fix the pipeline instead, so every post benefits. If a block type
doesn't exist yet, add it to `components/blog/ArticleDirectives.jsx` and
`docs/MAGAZINE.md`, and to `/blog/style-guide` so it has a visual regression
reference — don't hand-style it just for the one post that needs it.
