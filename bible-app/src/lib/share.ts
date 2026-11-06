// Sharing a verse, kept deliberately defensive: iOS Safari's
// navigator.share() only honors the "this call came from a real tap"
// check for a short window after the gesture, rejects (rather than
// resolves) when the user dismisses the share sheet, and has no timeout
// of its own — so a share mechanism that's careless about any of that
// can read to the user as the whole app freezing. The guards below each
// correspond to one of those failure modes:
//   - a module-level busy flag stops a double-tap from firing a second
//     share() while the first is still open (some browsers throw
//     InvalidStateError on overlapping calls; at best it's confusing)
//   - AbortError from a user-dismissed share sheet is treated as a normal
//     "cancelled" outcome, never surfaced as a failure
//   - image generation is wrapped in its own short timeout and never
//     allowed to hold up the actual share() call past ~800ms, since that
//     delay is what risks the gesture-expiry rejection above
//   - clipboard writeText is the final fallback for browsers with no
//     Web Share API at all (desktop Chrome/Firefox)
export type ShareOutcome = "shared" | "copied" | "cancelled" | "unavailable" | "failed";

export interface ShareVerseInput {
  reference: string;
  text: string;
  appName: string;
}

let sharing = false;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}

function isAbort(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
}

export async function shareVerse(input: ShareVerseInput): Promise<ShareOutcome> {
  if (sharing) return "failed";
  sharing = true;
  try {
    const shareText = `"${input.text}"\n— ${input.reference}`;
    const nav = navigator as Navigator & {
      share?: (data: ShareData) => Promise<void>;
      canShare?: (data: ShareData) => boolean;
    };

    if (nav.share) {
      // Image sharing is a nice-to-have, never a blocker: generation gets
      // a tight timeout, and any failure there (including the timeout
      // itself) just falls through to the plain text share below instead
      // of surfacing an error.
      try {
        const file = await withTimeout(renderVerseCard(input), 800);
        if (file && nav.canShare?.({ files: [file] })) {
          await nav.share({ files: [file], text: shareText, title: input.reference });
          return "shared";
        }
      } catch (err) {
        if (isAbort(err)) return "cancelled";
      }

      try {
        await nav.share({ text: shareText, title: input.reference });
        return "shared";
      } catch (err) {
        if (isAbort(err)) return "cancelled";
        // Not a cancel — fall through to clipboard rather than reporting
        // failure outright, since most share() rejections here are a
        // platform declining the specific payload, not a real error.
      }
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareText);
      return "copied";
    }
    return "unavailable";
  } catch {
    return "failed";
  } finally {
    sharing = false;
  }
}

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1080;

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Deliberately uses generic system font stacks, not the app's custom
// webfonts — waiting on document.fonts.ready here would add an
// unbounded delay right before the share() call, which is exactly the
// kind of pre-share stall the gesture-expiry guard above exists to avoid.
async function renderVerseCard(input: ShareVerseInput): Promise<File | null> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const paper = getComputedStyle(document.documentElement).getPropertyValue("--paper-panel").trim() || "#f2e7d3";
  const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#1c1a17";
  const gold = getComputedStyle(document.documentElement).getPropertyValue("--gold").trim() || "#c97a12";

  ctx.fillStyle = paper || "#f2e7d3";
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.fillStyle = gold || "#c97a12";
  ctx.fillRect(0, 0, CARD_WIDTH, 14);

  const margin = 96;
  const maxWidth = CARD_WIDTH - margin * 2;
  ctx.fillStyle = ink || "#1c1a17";
  ctx.textBaseline = "alphabetic";

  let fontSize = 58;
  let lines: string[] = [];
  do {
    ctx.font = `italic 600 ${fontSize}px Georgia, "Times New Roman", serif`;
    lines = wrapLines(ctx, input.text, maxWidth);
    if (lines.length * (fontSize * 1.5) < CARD_HEIGHT - 320) break;
    fontSize -= 4;
  } while (fontSize > 28);

  const lineHeight = fontSize * 1.5;
  const totalHeight = lines.length * lineHeight;
  let y = (CARD_HEIGHT - totalHeight) / 2 - 40;
  ctx.textAlign = "center";
  lines.forEach((line, i) => {
    y += lineHeight;
    const decorated = lines.length === 1 ? `“${line}”` : i === 0 ? `“${line}` : i === lines.length - 1 ? `${line}”` : line;
    ctx.fillText(decorated, CARD_WIDTH / 2, y);
  });

  ctx.fillStyle = gold || "#c97a12";
  ctx.font = `700 40px Georgia, "Times New Roman", serif`;
  ctx.fillText(input.reference, CARD_WIDTH / 2, y + lineHeight + 20);

  ctx.fillStyle = ink || "#1c1a17";
  ctx.globalAlpha = 0.55;
  ctx.font = `600 28px "Segoe UI", Helvetica, Arial, sans-serif`;
  ctx.fillText(input.appName, CARD_WIDTH / 2, CARD_HEIGHT - margin / 2);
  ctx.globalAlpha = 1;

  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return null;
  return new File([blob], "verse.png", { type: "image/png" });
}
