import { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { UI, LANGUAGES, type LangKey } from "../data/languages";
import { BOOKS, bookAbbr } from "../data/books";
import { searchScripture, type SearchHit } from "../lib/search";

function refLabel(hit: SearchHit, lang: LangKey): string {
  const book = BOOKS.find((b) => b.id === hit.bookId);
  const code = lang === "en" || lang === "web" ? hit.bookId.slice(0, 3).toUpperCase() : book ? bookAbbr(book, lang) : hit.bookId;
  return `${code} ${hit.chapter}:${hit.verse}`;
}

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
  onResult: (lang: LangKey, bookId: string, chapter: number, verse: number) => void;
}) {
  const { lang, setLang } = useApp();
  const t = UI[lang];
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [scope, setScope] = useState<"all" | "ot" | "nt">("all");
  const [langsOn, setLangsOn] = useState<Record<LangKey, boolean>>({ en: true, web: true, "zh-hant": true, "zh-hans": true });
  const [recent, setRecent] = useState(RECENT_SEEDS[lang]);
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Small debounce so every keystroke doesn't trigger a fresh whole-Bible
  // scan across up to 4 versions — the index files are large (a few MB
  // each), and typing is faster than that's worth re-running per character.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  const activeLangs = useMemo(
    () => LANGUAGES.map((l) => l.key).filter((k) => langsOn[k]),
    [langsOn]
  );
  const bookIds = useMemo(() => {
    if (scope === "all") return null;
    return BOOKS.filter((b) => b.testament === (scope === "ot" ? "OT" : "NT")).map((b) => b.id);
  }, [scope]);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q || activeLangs.length === 0) {
      setHits(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchScripture(q, activeLangs, bookIds)
      .then((results) => {
        if (!cancelled) {
          setHits(results);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHits([]);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, activeLangs, bookIds]);

  return (
    <div className={`modal-screen${open ? " open" : ""}`}>
      <div className="modal-head">
        <h2>{t.searchTitle}</h2>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &#10005;
        </button>
      </div>
      <div className="modal-content-row">
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
          loading ? (
            <div className="empty-note">{t.loadingLabel}</div>
          ) : hits && hits.length ? (
            <div className="results-list">
              {hits.map((hit, i) => {
                const firstOfBook = i === 0 || hits[i - 1].bookId !== hit.bookId;
                return (
                  <button
                    key={i}
                    type="button"
                    id={firstOfBook ? `search-book-${hit.bookId}` : undefined}
                    className="result-item"
                    onClick={() => {
                      setLang(hit.lang);
                      onResult(hit.lang, hit.bookId, hit.chapter, hit.verse);
                      onClose();
                    }}
                  >
                    <span className="result-tag">{LANGUAGES.find((l) => l.key === hit.lang)?.label}</span>
                    <span className="result-ref">{refLabel(hit, hit.lang)}</span>
                    <div className="result-snippet">{highlight(hit.text, debouncedQuery)}</div>
                  </button>
                );
              })}
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
      {query.trim() && !loading && hits && hits.length > 0 && (
        <div className="results-rail">
          {Array.from(new Set(hits.map((h) => h.bookId))).map((bookId) => {
            const book = BOOKS.find((b) => b.id === bookId);
            return (
              <button
                key={bookId}
                type="button"
                className="rail-btn"
                onClick={() => document.getElementById(`search-book-${bookId}`)?.scrollIntoView({ block: "start" })}
              >
                {book ? bookAbbr(book, lang) : bookId}
              </button>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
