// One-off generator for the lead-funnel QR codes. Not part of the app build —
// run manually with: node scripts/generate-qr.js
// Regenerate any time a landing page URL or UTM tagging changes.

const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");

const BASE_URL = "https://www.tishbitedigital.co.za";
const OUT_DIR = path.join(__dirname, "..", "public", "assets", "qr");

const PAGES = ["audit", "scorecard", "pricing-guide", "checklist", "call"];

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const slug of PAGES) {
    const url = `${BASE_URL}/${slug}?utm_source=video&utm_medium=qr`;
    const outPath = path.join(OUT_DIR, `${slug}.png`);
    await QRCode.toFile(outPath, url, {
      width: 600,
      margin: 2,
      color: { dark: "#1b4332", light: "#ffffff" },
    });
    console.log(`✓ ${slug}.png -> ${url}`);
  }
}

run().catch((err) => {
  console.error("QR generation failed:", err);
  process.exit(1);
});
