// Rewrites a Cloudinary delivery URL to request an auto-format,
// auto-quality, width-capped version instead of the raw upload — pure
// URL string manipulation (no SDK, no credentials), safe anywhere
// including client components. Non-Cloudinary URLs pass through
// unchanged.
//
// Without this, Next's own image optimizer has to download whatever
// the admin originally uploaded as its *input* before it can resize
// anything — a 2MB un-compressed photo stays a 2MB fetch (plus
// sharp's own decode/encode time) no matter what `sizes`/`quality` is
// requested downstream. Capping the source at the edge fixes that at
// its root instead of only at the last mile.
export function cloudinaryOptimizedUrl(url, { width = 1920 } = {}) {
  if (!url || typeof url !== "string") return url;
  const match = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/);
  if (!match) return url;

  const [, prefix, rest] = match;
  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${width}`);
  return `${prefix}${transforms.join(",")}/${rest}`;
}
