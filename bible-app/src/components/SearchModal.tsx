import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { UI, LANGUAGES, type LangKey } from "../data/languages";
import { GENESIS_1 } from "../data/genesis1";
import { stripHtml } from "../lib/tts";

interface SearchResult {
  lang: LangKey;
  tag: string;
  ref: string;
  text: string;
  action: { type: "verse" } | { type: "point"; index: number };
}

function buildIndex(): SearchResult[] {
  const items: SearchResult[] = [];
  const tagFor: Record<LangKey, string> = { en: "KJV", web: "WEB", "zh-hant": "繁", "zh-hans": "简" };
  (Object.keys(GENESIS_1) as LangKey[]).forEach((lang) => {
    const d = GENESIS_1[lang];
    d.verses.forEach((v) => {
      items.push({ lang, tag: tagFor[lang], ref: `Gen 1:${v.n}`, text: v.t, action: { type: "verse" } });
    });
    d.points.forEach((p, i) => {
      items.push({
        lang,
        tag: tagFor[lang],
        ref: `Gen 1 · ${i + 1}`,
        text: `${p.title} — ${p.teaser}`,
        action: { type: "point", index: i },
      });
    });
  });
  return items;
}

const SEARCH_INDEX = buildIndex();

function highlight(text: string, q: string) {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

const RECENT_SEEDS: Record<LangKey, string[]> = {
  en: ["light", "image"],
  web: ["light", "image"],
  "zh-hant": ["光", "形像"],
  "zh-hans": ["光", "形象"],
};

export function SearchModal({
  open,
  onClose,
  onResult,
}: {
  open: boolean;
  onClose: () => void;
  onResult: (lang: LangKey, action: SearchResult["action"]) => void;
}) {
  const { lang, setLang } = useApp();
  const t = UI[lang];
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"all" | "ot" | "nt">("all");
  const [langsOn, setLangsOn] = useState<Record<LangKey, boolean>>({ en: true, web: true, "zh-hant": true, "zh-hans": true });
  const [recent, setRecent] = useState(RECENT_SEEDS[lang]);

  const matches = useMemo(() => {
    if (!query.trim() || scope === "nt") return [];
    return SEARCH_INDEX.filter((item) => langsOn[item.lang] && item.text.toLowerCase().includes(query.toLowerCase()));
  }, [query, scope, langsOn]);

  return (
    <div className={`modal-screen${open ? " open" : ""}`}>
      <div className="modal-head">
        <h2>{t.searchTitle}</h2>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &#10005;
        </button>
      </div>
      <div className="modal-body">
        <div className="scope-row">
          <button type="button" className={`scope-btn${scope === "all" ? " active" : ""}`} onClick={() => setScope("all")}>
            {t.scopeAll}
          </button>
          <button type="button" className={`scope-btn${scope === "ot" ? " active" : ""}`} onClick={() => setScope("ot")}>
            {t.scopeOT}
          </button>
          <button type="button" className={`scope-btn${scope === "nt" ? " active" : ""}`} onClick={() => setScope("nt")}>
            {t.scopeNT}
          </button>
        </div>
        <div className="lang-chip-row">
          {LANGUAGES.map((l) => (
            <button
              key={l.key}
              type="button"
              className={`lang-chip${langsOn[l.key] ? " on" : ""}`}
              onClick={() => setLangsOn((s) => ({ ...s, [l.key]: !s[l.key] }))}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="search-input-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6" stroke="var(--ink-faint)" strokeWidth="2" />
            <path d="M20 20l-4.5-4.5" stroke="var(--ink-faint)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>

        {query.trim() ? (
          matches.length ? (
            <div>
              {matches.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  className="result-item"
                  onClick={() => {
                    setLang(m.lang);
                    onResult(m.lang, m.action);
                    onClose();
                  }}
                >
                  <span className="result-tag">{m.tag}</span>
                  <span className="result-ref">{m.ref}</span>
                  <div className="result-snippet">{highlight(stripHtml(m.text), query)}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-note">{t.noResults}</div>
          )
        ) : (
          <div>
            <div className="recent-head">
              <span>{t.recentLabel}</span>
              <button type="button" className="trash-btn" onClick={() => setRecent([])} aria-label="Clear recent searches">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="recent-list">
              {recent.map((s) => (
                <button key={s} type="button" className="recent-item" onClick={() => setQuery(s)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
                    <path d="M20 20l-4.5-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
