/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // react-icons is already optimized by Next.js by default; framer-motion
    // isn't, and it's used on nearly every page for the site's animations.
    // Purely a build-time import-rewriting setting — no component code or
    // rendered output changes.
    optimizePackageImports: ["framer-motion"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // www.tishbitedigital.co.za is the canonical domain (matches metadataBase,
  // sitemap.js, robots.js, and every page's alternates.canonical). Redirect
  // the bare apex domain to it so both URLs work, but search engines only
  // ever see one canonical host instead of splitting signals across two.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "tishbitedigital.co.za" }],
        destination: "https://www.tishbitedigital.co.za/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
