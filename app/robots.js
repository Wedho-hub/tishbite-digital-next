const BASE_URL = "https://www.tishbitedigital.co.za";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/checkout", "/payment/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
