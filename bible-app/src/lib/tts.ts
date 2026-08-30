import type { LangKey } from "../data/languages";
import { LANGUAGES } from "../data/languages";

type Listener = (speaking: boolean) => void;

// Apple ships a set of sound-effect "novelty" voices (Bahh, Boing, Bubbles,
// Wobble, Zarvox, etc. — see Settings > Accessibility > Spoken Content >
// Voices > English > Novelty) meant for Messages effects, not reading. They
// show up in speechSynthesis.getVoices() indistinguishably from real
// voices, so they're filtered out here rather than left for a reader to
// stumble into while picking a voice for scripture.
const NOVELTY_VOICE_NAMES = new Set([
  "albert",
  "bad news",
  "bahh",
  "bells",
  "boing",
  "bubbles",
  "cellos",
  "deranged",
  "good news",
  "hysterical",
  "jester",
  "organ",
  "pipe organ",
  "superstar",
  "trinoids",
  "whisper",
  "wobble",
  "zarvox",
]);

function isNoveltyVoice(voice: SpeechSynthesisVoice): boolean {
  return NOVELTY_VOICE_NAMES.has(voice.name.trim().toLowerCase());
}

class TtsController {
  private synth: SpeechSynthesis | null =
    typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
  private activeId: string | null = null;
  private listeners = new Map<string, Set<Listener>>();
  private wakeLock: WakeLockSentinel | null = null;

  constructor() {
    if (typeof document !== "undefined") {
      // The Wake Lock API auto-releases when the tab is hidden, so a
      // re-lock is needed on return — this is what actually stops "screen
      // went dark, reading stopped": without holding the screen awake, the
      // OS auto-dims/locks after inactivity and the phone suspends page JS,
      // which silently kills mid-chapter speech synthesis.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && this.activeId && this.synth?.speaking) {
          this.acquireWakeLock();
        }
      });
    }
  }

  private async acquireWakeLock() {
    try {
      if ("wakeLock" in navigator) {
        this.wakeLock = await navigator.wakeLock.request("screen");
      }
    } catch {
      // Not supported, or the OS denied it — Listen still works, it just
      // won't survive the screen auto-dimming.
    }
  }

  private releaseWakeLock() {
    const lock = this.wakeLock;
    this.wakeLock = null;
    lock?.release().catch(() => {});
  }

  get isSupported(): boolean {
    return this.synth !== null;
  }

  isSpeaking(id: string): boolean {
    return this.activeId === id && this.synth !== null && this.synth.speaking;
  }

  subscribe(id: string, cb: Listener): () => void {
    if (!this.listeners.has(id)) this.listeners.set(id, new Set());
    this.listeners.get(id)!.add(cb);
    return () => this.listeners.get(id)?.delete(cb);
  }

  private notify(id: string, speaking: boolean) {
    this.listeners.get(id)?.forEach((cb) => cb(speaking));
  }

  private pickVoice(langCode: string, preferredURI?: string): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices().filter((v) => !isNoveltyVoice(v));
    if (preferredURI) {
      const chosen = voices.find((v) => v.voiceURI === preferredURI);
      if (chosen) return chosen;
    }
    const exact = voices.find((v) => v.lang === langCode);
    if (exact) return exact;
    const prefix = langCode.split("-")[0];
    return voices.find((v) => v.lang?.startsWith(prefix)) ?? null;
  }

  // All installed voices matching a language (e.g. "en" or "zh"), for the
  // voice picker in Settings. Voice lists load asynchronously on some
  // browsers — see subscribeVoicesChanged.
  listVoices(langPrefix: string): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices().filter((v) => v.lang?.startsWith(langPrefix) && !isNoveltyVoice(v));
  }

  subscribeVoicesChanged(cb: () => void): () => void {
    if (!this.synth) return () => {};
    this.synth.addEventListener("voiceschanged", cb);
    return () => this.synth?.removeEventListener("voiceschanged", cb);
  }

  stop() {
    if (!this.synth) return;
    this.synth.cancel();
    this.releaseWakeLock();
    const prev = this.activeId;
    this.activeId = null;
    if (prev) this.notify(prev, false);
  }

  toggle(id: string, text: string, lang: LangKey, preferredVoiceURI?: string) {
    if (!this.synth) return;
    if (this.activeId === id && this.synth.speaking) {
      this.stop();
      return;
    }
    this.stop();
    const langCode = LANGUAGES.find((l) => l.key === lang)?.speechLang ?? "en-US";
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    const voice = this.pickVoice(langCode, preferredVoiceURI);
    if (voice) utter.voice = voice;
    utter.rate = 0.95;
    utter.onend = () => {
      this.activeId = null;
      this.releaseWakeLock();
      this.notify(id, false);
    };
    utter.onerror = () => {
      this.activeId = null;
      this.releaseWakeLock();
      this.notify(id, false);
    };
    this.activeId = id;
    this.notify(id, true);
    this.acquireWakeLock();
    this.synth.speak(utter);
  }
}

export const tts = new TtsController();

export function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent ?? "";
}
