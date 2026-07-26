import type { LangKey } from "../data/languages";
import { LANGUAGES } from "../data/languages";

type Listener = (speaking: boolean) => void;

class TtsController {
  private synth: SpeechSynthesis | null =
    typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
  private activeId: string | null = null;
  private listeners = new Map<string, Set<Listener>>();

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

  private pickVoice(langCode: string): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    const exact = voices.find((v) => v.lang === langCode);
    if (exact) return exact;
    const prefix = langCode.split("-")[0];
    return voices.find((v) => v.lang?.startsWith(prefix)) ?? null;
  }

  stop() {
    if (!this.synth) return;
    this.synth.cancel();
    const prev = this.activeId;
    this.activeId = null;
    if (prev) this.notify(prev, false);
  }

  toggle(id: string, text: string, lang: LangKey) {
    if (!this.synth) return;
    if (this.activeId === id && this.synth.speaking) {
      this.stop();
      return;
    }
    this.stop();
    const langCode = LANGUAGES.find((l) => l.key === lang)?.speechLang ?? "en-US";
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    const voice = this.pickVoice(langCode);
    if (voice) utter.voice = voice;
    utter.rate = 0.95;
    utter.onend = () => {
      this.activeId = null;
      this.notify(id, false);
    };
    utter.onerror = () => {
      this.activeId = null;
      this.notify(id, false);
    };
    this.activeId = id;
    this.notify(id, true);
    this.synth.speak(utter);
  }
}

export const tts = new TtsController();

export function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent ?? "";
}
