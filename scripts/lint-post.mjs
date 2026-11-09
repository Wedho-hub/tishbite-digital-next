// npm run lint:post — runs the same pre-publish checklist the admin
// editor shows live (lib/blog.js's getChecklistWarnings) against every
// post actually in the DB, so issues can be caught in CI/local review
// without opening the admin UI for each one. Relative imports (not the
// `@/` alias) since this runs as a plain Node script outside Next's
// bundler, which is what resolves that alias.
//
// Requires MONGO_URI — run with `node --env-file=.env.local` (see the
// "lint:post" script in package.json) or export it in the shell first.
import connectDB from "../lib/db.js";
import BlogPost from "../models/BlogPost.js";
import { getChecklistWarnings } from "../lib/blog.js";

async function main() {
  await connectDB();
  const posts = await BlogPost.find().select("title slug content excerpt category deck image coverAlt author tags").lean();

  if (!posts.length) {
    console.log("No posts found.");
    process.exit(0);
  }

  let totalWarnings = 0;
  for (const post of posts) {
    const warnings = getChecklistWarnings(post);
    if (!warnings.length) continue;

    totalWarnings += warnings.length;
    console.log(`\n${post.title} (/blog/${post.slug})`);
    for (const warning of warnings) {
      console.log(`  - ${warning}`);
    }
  }

  if (totalWarnings === 0) {
    console.log(`All ${posts.length} post(s) pass the checklist clean.`);
  } else {
    console.log(`\n${totalWarnings} warning(s) across ${posts.length} post(s). These are advisory, not blocking.`);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("lint:post failed:", error.message);
  process.exit(1);
});
