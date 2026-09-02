import { useEffect, useRef, useState } from "react";
import { useApp } from "./context/AppContext";
import { UI, LANGUAGES, fmt, type LangKey } from "./data/languages";
import { GENESIS_1, type Verse, type Point } from "./data/genesis1";
import type { ChapterExplain } from "./data/explain";
import { BOOKS } from "./data/books";
import { ListenButton } from "./components/ListenButton";
import { Drawer } from "./components/Drawer";
import { ContentsModal } from "./components/ContentsModal";
import { SearchModal } from "./components/SearchModal";
import { SettingsModal } from "./components/SettingsModal";
import { MapModal } from "./components/MapModal";
import { BookIntroModal } from "./components/BookIntroModal";
import { Toast } from "./components/Toast";
import { loadChapterVerses } from "./lib/scripture";
import { loadChapterPoints } from "./lib/insights";
import { loadChapterExplain } from "./lib/explain";
import { bookHasMap } from "./lib/maps";
import { stripHtml, tts } from "./lib/tts";

export type ModalKey = "contents" | "search" | "settings";

export default function App() {
  const { lang, setLang, settings, toast } = useApp();
  const t = UI[lang];

  const [bookId, setBookId] = useState("gen");
  const [chapter, setChapter] = useState(1);
  const [tab, setTab] = useState<"scripture" | "insights">("scripture");
  const [openPointIndex, setOpenPointIndex] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modal, setModal] = useState<ModalKey | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const [verses, setVerses] = useState<Verse[] | null>(null);
  const [points, setPoints] = useState<Point[] | null>(null);
  const [explain, setExplain] = useState<ChapterExplain | null>(null);

  const book = BOOKS.find((b) => b.id === bookId)!;
  const listScrollRef = useRef<HTMLDivElement>(null);
  const [pendingVerse, setPendingVerse] = useState<number | null>(null);

  // Jumping chapters (via the fixed toolbar, the drawer, or a search result)
  // reuses the same scrollable div, so without this the reader would land
  // mid-scroll in the new chapter instead of at its first verse. A search
  // result overrides this with a scroll-to-that-verse below once the new
  // chapter's text has actually loaded.
  useEffect(() => {
    listScrollRef.current?.scrollTo({ top: 0 });
  }, [bookId, chapter]);

  // Scrolls to and briefly highlights the verse a search result pointed at,
  // once that chapter's text has finished loading (verses arrives async, so
  // this can't run in the effect above — the verse row wouldn't exist yet).
  useEffect(() => {
    if (!verses || pendingVerse === null) return;
    const target = pendingVerse;
    requestAnimationFrame(() => {
      // Manual delta-scroll rather than Element.scrollIntoView: scrollIntoView
      // walks every scroll-container ancestor in the DOM chain, including
      // .app-shell (overflow:hidden still allows programmatic scrollTop), so
      // it was shoving the whole app up instead of just this list.
      const container = listScrollRef.current;
      const row = container?.querySelector<HTMLElement>(`[data-verse="${target}"]`);
      if (container && row) {
        const containerRect = container.getBoundingClientRect();
        const rowRect = row.getBoundingClientRect();
        const delta = rowRect.top - containerRect.top - (containerRect.height - rowRect.height) / 2;
        container.scrollTop += delta;
      }
    });
    const timer = setTimeout(() => setPendingVerse(null), 2200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verses]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", String(settings.fontScale));
  }, [settings.fontScale]);

  useEffect(() => {
    if (settings.theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  // scripture: always loaded from the bundled per-book JSON (all 66 books)
  useEffect(() => {
    let cancelled = false;
    setVerses(null);
    loadChapterVerses(bookId, chapter, lang)
      .then((v) => {
        if (!cancelled) setVerses(v);
      })
      .catch(() => {
        if (!cancelled) toast("Couldn't load that chapter's text — check your connection.");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, chapter, lang]);

  // AI insights: every chapter ships pre-generated in the bundle (see
  // lib/insights.ts); the Genesis 1 seed is kept as a defensive fallback.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const pre = await loadChapterPoints(bookId, chapter, lang);
      if (cancelled) return;
      if (pre) {
        setPoints(pre);
      } else if (bookId === "gen" && chapter === 1) {
        setPoints(GENESIS_1[lang].points);
      } else {
        setPoints(null);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [bookId, chapter, lang]);

  // Second AI voice (see lib/explain.ts): summary/themes/application style,
  // merged below the trimmed 3-point list rather than a separate tab. Not
  // every chapter/language is covered yet, so this quietly resolves to
  // null and the section is simply omitted.
  useEffect(() => {
    let cancelled = false;
    loadChapterExplain(bookId, chapter, lang).then((e) => {
      if (!cancelled) setExplain(e);
    });
    return () => {
      cancelled = true;
    };
  }, [bookId, chapter, lang]);

  function openDetail(i: number) {
    tts.stop();
    setOpenPointIndex(i);
  }
  function closeDetail() {
    tts.stop();
    setOpenPointIndex(null);
  }
  function switchLang(l: LangKey) {
    tts.stop();
    setLang(l);
    setOpenPointIndex(null);
  }
  function switchTab(next: "scripture" | "insights") {
    tts.stop();
    setTab(next);
  }
  function navigateFromDrawer(target: ModalKey | "home") {
    if (target === "home") {
      setModal(null);
      setOpenPointIndex(null);
    } else {
      setModal(target);
    }
  }
  function goToChapter(bId: string, c: number, verse?: number) {
    if (verse) setPendingVerse(verse);
    setBookId(bId);
    setChapter(c);
    setTab("scripture");
    setOpenPointIndex(null);
  }

  const bookIndex = BOOKS.findIndex((b) => b.id === bookId);
  function adjacentChapter(direction: 1 | -1): { bookId: string; chapter: number } | null {
    if (direction === -1) {
      if (chapter > 1) return { bookId, chapter: chapter - 1 };
      const prevBook = BOOKS[bookIndex - 1];
      return prevBook ? { bookId: prevBook.id, chapter: prevBook.chapters } : null;
    }
    if (chapter < book.chapters) return { bookId, chapter: chapter + 1 };
    const nextBook = BOOKS[bookIndex + 1];
    return nextBook ? { bookId: nextBook.id, chapter: 1 } : null;
  }
  const prevTarget = adjacentChapter(-1);
  const nextTarget = adjacentChapter(1);
  function goAdjacent(direction: 1 | -1) {
    const target = direction === -1 ? prevTarget : nextTarget;
    if (!target) return;
    tts.stop();
    setBookId(target.bookId);
    setChapter(target.chapter);
    setOpenPointIndex(null);
  }

  const point = points && openPointIndex !== null ? points[openPointIndex] : null;
  const chapterEyebrow = fmt(t.chapterEyebrow, { book: book.label[lang], c: chapter });

  return (
    <div className="app-shell">
      <div className="appbar">
        <button className="menu-btn" type="button" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
          <span />
        </button>
        <button className="wordmark-btn" type="button" onClick={() => setModal("contents")}>
          <svg className="mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="var(--gold)" stroke="var(--ink)" strokeWidth="2.5" />
            <path d="M11 14c3-2 6-2 9 0v13c-3-2-6-2-9 0V14z" fill="var(--paper-panel)" stroke="var(--ink)" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M29 14c-3-2-6-2-9 0v13c3-2 6-2 9 0V14z" fill="var(--paper-panel)" stroke="var(--ink)" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M20 14v13" stroke="var(--ink)" strokeWidth="1.6" />
          </svg>
          <span className="wordmark">{t.drawerContents}</span>
        </button>
        <button className="search-btn" type="button" aria-label={t.drawerSearch} onClick={() => setModal("search")}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="var(--ink)" strokeWidth="2.4" />
            <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="lang-row">
        {LANGUAGES.map((l) => (
          <button
            key={l.key}
            type="button"
            className={`lang-pill${lang === l.key ? " active" : ""}`}
            onClick={() => switchLang(l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="panels">
        <div className={`view list${openPointIndex !== null ? " is-hidden" : ""}`}>
          <div className="view-scroll" ref={listScrollRef}>
          <div className="chapter-head">
            <div>
              <div className="chapter-eyebrow">{chapterEyebrow}</div>
              <div className="chapter-title">{book.label[lang]}</div>
            </div>
            <div className="chapter-head-actions">
              <button type="button" className="map-btn" onClick={() => setIntroOpen(true)}>
                <span aria-hidden="true">&#128214;</span> {t.introLabel}
              </button>
              {bookHasMap(bookId) && (
                <button type="button" className="map-btn" onClick={() => setMapOpen(true)}>
                  <span aria-hidden="true">&#128506;</span> {t.mapLabel}
                </button>
              )}
            </div>
          </div>

          <div className="tabbar">
            <button type="button" className={`tab-btn${tab === "scripture" ? " active" : ""}`} onClick={() => switchTab("scripture")}>
              {t.tabScripture}
            </button>
            <button type="button" className={`tab-btn${tab === "insights" ? " active" : ""}`} onClick={() => switchTab("insights")}>
              {t.tabInsights}
            </button>
          </div>

          {tab === "scripture" ? (
            verses ? (
              <div>
                <ListenButton id="scripture" text={verses.map((v) => v.t)} />
                <div className="verse-list">
                  {verses.map((v) => (
                    <div
                      className={`verse-row${v.n === pendingVerse ? " highlighted" : ""}`}
                      data-verse={v.n}
                      key={v.n}
                    >
                      <div className="verse-num">{v.n}</div>
                      <div className="verse-text">{v.t}</div>
                    </div>
                  ))}
                </div>
                <div className="scripture-note">{t.scriptureNote}</div>
              </div>
            ) : (
              <div className="empty-note">{t.loadingLabel}</div>
            )
          ) : (
            <div>
              <div className="section-label">
                <span>{t.sectionLeft}</span>
                <span>{t.sectionRight}</span>
              </div>
              {points ? (
                <div className="point-list">
                  {points.slice(0, 3).map((p, i) => (
                    <button key={i} type="button" className="point-card" onClick={() => openDetail(i)}>
                      <div className="point-num">{i + 1}</div>
                      <div className="point-body">
                        <p className="point-title">{p.title}</p>
                        <p className="point-teaser">{p.teaser}</p>
                      </div>
                      <div className="point-arrow" aria-hidden="true">
                        &rarr;
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="empty-note">{t.loadingLabel}</div>
              )}
              {explain && (
                <div className="explain-block">
                  <div className="section-label">
                    <span>{t.explainSectionLabel}</span>
                  </div>
                  <ListenButton
                    id="explain"
                    text={[explain.summary, ...explain.keyPoints, explain.application]}
                  />
                  <div className="caption-box">{explain.summary}</div>
                  {explain.themes.length > 0 && (
                    <div className="tag-row">
                      {explain.themes.map((th) => (
                        <span key={th} className="theme-tag">{th}</span>
                      ))}
                    </div>
                  )}
                  <ul className="explain-points">
                    {explain.keyPoints.map((kp, i) => (
                      <li key={i}>{kp}</li>
                    ))}
                  </ul>
                  {explain.keyVerses.length > 0 && (
                    <div className="tag-row">
                      {explain.keyVerses.map((v) => (
                        <span key={v} className="verse-tag">{v}</span>
                      ))}
                    </div>
                  )}
                  <div className="caption-box callout">
                    <b>{t.explainApplicationLabel}</b> {explain.application}
                  </div>
                </div>
              )}
            </div>
          )}

          </div>
        </div>

        <div className={`view detail${openPointIndex !== null ? " is-active" : ""}`}>
          <div className="view-scroll">
          {point && (
            <>
              <button type="button" className="back-tab" onClick={closeDetail}>
                <span aria-hidden="true">&larr;</span> {t.backTab}
              </button>
              <div className="splash-banner">
                <div className="point-num">{(openPointIndex ?? 0) + 1}</div>
                <div className="splash-title">{point.title}</div>
              </div>
              <div className="ai-tag">
                <span className="dot" /> {t.aiTag}
              </div>
              <ListenButton id="detail" text={[point.title, ...point.body.map(stripHtml)]} />
              <div>
                {point.body.map((para, idx) => (
                  <div
                    key={idx}
                    className={`caption-box${idx === point.body.length - 1 ? " callout" : ""}`}
                    dangerouslySetInnerHTML={{ __html: para }}
                  />
                ))}
              </div>
            </>
          )}
          </div>
        </div>
      </div>

      <div className="chapter-toolbar">
        <button
          type="button"
          className="toolbar-nav-btn"
          aria-label={t.prevChapterLabel}
          disabled={!prevTarget}
          onClick={() => goAdjacent(-1)}
        >
          <span aria-hidden="true">&larr;</span>
        </button>
        <div className="toolbar-chapter-label">{chapterEyebrow}</div>
        <button
          type="button"
          className="toolbar-nav-btn"
          aria-label={t.nextChapterLabel}
          disabled={!nextTarget}
          onClick={() => goAdjacent(1)}
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={navigateFromDrawer} />

      <ContentsModal
        open={modal === "contents"}
        onClose={() => setModal(null)}
        onSelectChapter={(bId, c, verse) => goToChapter(bId, c, verse)}
      />

      <SearchModal
        open={modal === "search"}
        onClose={() => setModal(null)}
        onResult={(_resultLang, resultBookId, resultChapter, verse) => {
          setPendingVerse(verse);
          setBookId(resultBookId);
          setChapter(resultChapter);
          setTab("scripture");
          setOpenPointIndex(null);
        }}
      />

      <SettingsModal open={modal === "settings"} onClose={() => setModal(null)} />

      <MapModal open={mapOpen} bookId={bookId} bookLabel={book.label[lang]} onClose={() => setMapOpen(false)} />

      <BookIntroModal open={introOpen} bookId={bookId} bookLabel={book.label[lang]} onClose={() => setIntroOpen(false)} />

      <Toast />
    </div>
  );
}
