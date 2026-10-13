// Minimal plain-text formatter for email bodies — not a full Markdown
// parser (no dependency needed for a handful of rules): blank lines become
// paragraph breaks, **bold** and a leading "- " list item are supported,
// and raw HTML is escaped first so pasted text can't break the email.
export function plainTextToEmailHtml(text) {
  const escapeHtml = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const withBold = (s) => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  const blocks = escapeHtml(text).trim().split(/\n\s*\n/);

  return blocks
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      const isList = lines.length > 0 && lines.every((l) => l.startsWith("- "));

      if (isList) {
        const items = lines.map((l) => `<li style="margin-bottom:6px;">${withBold(l.slice(2))}</li>`).join("");
        return `<ul style="margin:0 0 16px;padding-left:20px;color:#374151;">${items}</ul>`;
      }

      return `<p style="margin:0 0 16px;">${withBold(lines.join("<br/>"))}</p>`;
    })
    .join("");
}
