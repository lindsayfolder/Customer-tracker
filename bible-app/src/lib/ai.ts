import type { Point, Verse } from "../data/genesis1";
import type { LangKey } from "../data/languages";
import type { BookMeta } from "../data/books";

export class AiNotConfiguredError extends Error {}

/**
 * Generates the 5 main points + deep-dive detail for a chapter.
 *
 * IMPORTANT: this calls a *server-side proxy* (see /server/generate-insights.js
 * for a reference implementation), never the Anthropic API directly from the
 * browser. An API key embedded in client code is visible to anyone who opens
 * devtools — the proxy is what keeps it private. Configure the proxy's URL
 * in Settings (stored as `aiEndpoint`); until it's set, this throws
 * AiNotConfiguredError.
 */
export async function generateChapterInsights(
  book: BookMeta,
  chapter: number,
  lang: LangKey,
  verses: Verse[],
  aiEndpoint: string,
): Promise<Point[]> {
  if (!aiEndpoint) {
    throw new AiNotConfiguredError("No AI endpoint configured in Settings.");
  }

  const res = await fetch(aiEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      book: book.id,
      bookLabel: book.label[lang],
      chapter,
      lang,
      verses,
    }),
  });

  if (!res.ok) {
    throw new Error(`AI generation failed: ${res.status} ${await res.text().catch(() => "")}`);
  }

  const data = (await res.json()) as { points?: Point[] };
  if (!data?.points?.length) {
    throw new Error("AI response missing points.");
  }
  return data.points;
}
