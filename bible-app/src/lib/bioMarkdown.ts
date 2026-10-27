// Character bios are authored as a small markdown subset — "## " headers,
// "**bold**", "- " / "1. " lists, blank-line-separated paragraphs — so
// major figures can carry structured sections while minor ones stay plain
// paragraphs (which pass through this unchanged, since a single block with
// no list/heading markers just becomes one <p>). This is the only place
// that subset gets parsed, so authoring never has to think about the app.

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s: string): string {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export function renderBioHtml(markdown: string): string {
  const blocks = markdown.trim().split(/\n\n+/);
  return blocks
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) return "";
      if (lines.every((l) => /^-\s+/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^-\s+/, ""))}</li>`).join("")}</ul>`;
      }
      if (lines.every((l) => /^\d+\.\s+/.test(l))) {
        return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+\.\s+/, ""))}</li>`).join("")}</ol>`;
      }
      if (lines.length === 1 && /^#{2,3}\s+/.test(lines[0])) {
        return `<h3>${inline(lines[0].replace(/^#{2,3}\s+/, ""))}</h3>`;
      }
      return `<p>${lines.map(inline).join(" ")}</p>`;
    })
    .join("");
}

// Same source, rendered to plain paragraph strings for the Listen button —
// markdown punctuation would otherwise get read aloud literally.
export function stripBioMarkdown(markdown: string): string[] {
  return markdown
    .trim()
    .split(/\n\n+/)
    .map((block) =>
      block
        .split("\n")
        .map((l) =>
          l
            .trim()
            .replace(/^#{2,3}\s+/, "")
            .replace(/^-\s+/, "")
            .replace(/^\d+\.\s+/, "")
            .replace(/\*\*(.+?)\*\*/g, "$1"),
        )
        .join(" "),
    )
    .filter(Boolean);
}
