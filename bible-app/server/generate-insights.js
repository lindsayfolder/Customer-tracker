// Reference server-side proxy for AI chapter generation — deploy this as a
// Vercel Edge Function (or adapt to Cloudflare Workers / any Node host).
// It holds the Anthropic API key server-side; the client never sees it.
//
// Deploy (Vercel):
//   1. `vercel env add ANTHROPIC_API_KEY` (paste your key, do not commit it)
//   2. `vercel deploy`
//   3. In the app's Settings screen, set the AI endpoint to your deployed
//      function's URL, e.g. https://your-app.vercel.app/api/generate-insights
//
// Why a proxy at all: calling the Anthropic API directly from the browser
// would require shipping the API key inside the app bundle, where anyone
// can read it from devtools/network tab. This function is the minimal fix.

export const config = { runtime: "edge" };

const SYSTEM_PROMPT = `You are drawing out 5 main points from a Bible chapter for a study app.
Respond with strict JSON only, matching this TypeScript type:
{
  "points": [
    { "title": string, "teaser": string, "body": [string, string] }
  ]
}
Rules:
- Exactly 5 points, ordered as they occur in the chapter.
- "title" is a short punchy headline (under 6 words).
- "teaser" is one sentence, under 20 words.
- "body" is exactly 2 short paragraphs of plain explanation (no headers, no bullet lists).
- Write in the requested language.
- No text outside the JSON object.`;

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), { status: 500 });
  }

  const { bookLabel, chapter, lang, verses } = await req.json();
  const verseText = (verses || []).map((v) => `${v.n}. ${v.t}`).join("\n");
  const langName = { en: "English", web: "English", "zh-hant": "Traditional Chinese", "zh-hans": "Simplified Chinese" }[lang] || "English";

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Book: ${bookLabel} ${chapter}\nLanguage: ${langName}\n\nVerses:\n${verseText}`,
        },
      ],
    }),
  });

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => "");
    return new Response(JSON.stringify({ error: "Upstream AI error", detail: errText }), { status: 502 });
  }

  const data = await upstream.json();
  const text = data?.content?.[0]?.text ?? "{}";

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return new Response(JSON.stringify({ error: "Could not parse AI response" }), { status: 502 });
  }

  return new Response(JSON.stringify({ verses, points: parsed.points }), {
    headers: { "content-type": "application/json" },
  });
}
