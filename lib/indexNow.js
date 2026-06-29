const HOST = "www.tishbitedigital.co.za";
const KEY = process.env.INDEXNOW_KEY || "de51b717f3fd4e5b8a297627217d659b";

// Notifies IndexNow (Bing, Yandex, and other participating engines) the
// moment content changes, instead of waiting for the next scheduled crawl.
// Best-effort only — a failed ping should never block a content save.
export async function pingIndexNow(paths) {
  try {
    const urlList = (Array.isArray(paths) ? paths : [paths]).map((p) =>
      p.startsWith("http") ? p : `https://${HOST}${p}`
    );

    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `https://${HOST}/${KEY}.txt`,
        urlList,
      }),
    });
  } catch (err) {
    console.error("IndexNow ping failed (non-fatal):", err.message);
  }
}
