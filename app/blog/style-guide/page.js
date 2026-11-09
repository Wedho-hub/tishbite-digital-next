import dynamic from "next/dynamic";
import PageHeader from "@/components/PageHeader";
import AuthorCard from "@/components/blog/AuthorCard";
import { Pullquote, Callout, Keypoints, Cta, DirectiveYoutube } from "@/components/blog/ArticleDirectives";
import { getArticleRemarkPlugins, getArticleRehypePlugins, applySmartTypography } from "@/lib/blog";

// Same lazy-loaded react-markdown as the real article page — this
// page exists to prove the pipeline, so it has to be the real
// pipeline, not an approximation of it.
const ReactMarkdown = dynamic(() => import("react-markdown"));

export const metadata = {
  title: "Blog Style Guide",
  robots: { index: false, follow: false },
};

// Exercises every block a post can use — drop cap, numbered headings,
// directives, highlight marks, scripture refs, and a sources section —
// so this page is both documentation and a visual regression check:
// if any of these stop rendering correctly, it shows up here first.
const SAMPLE_MARKDOWN = `
This is the opening paragraph, and it gets an automatic drop cap because it's the first paragraph in an article body with the \`has-dropcap\` class — no markup needed, it's purely CSS off \`:first-of-type::first-letter\`.

## 1. Numbered headings split automatically

Any heading written as \`## 1. Heading text\` has its number pulled out into its own styled marker — this one too, just by writing the number.

Ordinary **bold** and *italic* work as usual. A highlighter mark looks like this: ==this phrase is highlighted==. A scripture reference like Joshua 22:10-34 gets small-caps styling automatically, with no markup required.

:::pullquote{cite="Example source"}
A pull quote breaks out toward the margin on desktop, with an oversized quote mark behind it.
:::

## 2. Callouts and key takeaways

:::callout{type="tip" title="Heads up"}
A callout reads as a boxed aside — useful for a note, warning, or tip that shouldn't interrupt the main flow of the article.
:::

:::keypoints{title="Key takeaways"}
- First takeaway
- Second takeaway
- Third takeaway
:::

## 3. Embeds and calls to action

::youtube{id="dQw4w9WgXcQ" title="Example video"}

::cta{title="Want help with something like this?" button="Get a Free Audit" href="/contact"}

## Further reading

1. [Example source one](https://example.com/one)
2. [Example source two](https://example.com/two)
`.trim();

export default function BlogStyleGuidePage() {
  return (
    <>
      <PageHeader
        title="Blog Style Guide"
        subtitle="Every block type a post can use, with sample content — the visual reference for this blog's editorial pipeline."
        background="dark"
      />

      <article className="py-14 bg-bg">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-[68ch] mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary mb-3">Reference</p>
            <h1 className="editorial-gradient-text font-editorial text-display font-bold leading-[1.05] mb-4">
              Every block, one page
            </h1>
            <p className="font-editorial text-deck text-text-muted italic leading-snug">
              See docs/MAGAZINE.md for how to write each of these — this page just proves they render.
            </p>
          </div>

          <div className="max-w-[68ch] mx-auto">
            <div className="prose prose-tishbite prose-lg has-dropcap max-w-none prose-img:rounded-xl">
              <ReactMarkdown
                remarkPlugins={getArticleRemarkPlugins("audit")}
                rehypePlugins={getArticleRehypePlugins()}
                components={{
                  pullquote: Pullquote,
                  callout: Callout,
                  keypoints: Keypoints,
                  cta: Cta,
                  youtube: DirectiveYoutube,
                }}
              >
                {applySmartTypography(SAMPLE_MARKDOWN)}
              </ReactMarkdown>
            </div>

            <AuthorCard />
          </div>
        </div>
      </article>
    </>
  );
}
