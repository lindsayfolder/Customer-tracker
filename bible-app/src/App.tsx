import { useEffect, useState } from "react";
import { useApp } from "./context/AppContext";
import { UI, LANGUAGES, fmt, type LangKey } from "./data/languages";
import { GENESIS_1, type Verse, type Point } from "./data/genesis1";
import { BOOKS } from "./data/books";
import { ListenButton } from "./components/ListenButton";
import { Drawer } from "./components/Drawer";
import { ContentsModal } from "./components/ContentsModal";
import { SearchModal } from "./components/SearchModal";
import { SettingsModal } from "./components/SettingsModal";
import { Toast } from "./components/Toast";
import { getCachedPoints, putCachedPoints } from "./lib/db";
import { loadChapterVerses } from "./lib/scripture";
import { loadChapterPoints } from "./lib/insights";
import { generateChapterInsights, AiNotConfiguredError } from "./lib/ai";
import { stripHtml, tts } from "./lib/tts";

export type ModalKey = "contents" | "search" | "settings";

export default function App() {
  const { lang, setLang, settings, toast, refreshCacheUsage } = useApp();
  const t = UI[lang];

  const [bookId, setBookId] = useState("gen");
  const [chapter, setChapter] = useState(1);
  const [tab, setTab] = useState<"scripture" | "insights">("scripture");
  const [openPointIndex, setOpenPointIndex] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modal, setModal] = useState<ModalKey | null>(null);
  const [verses, setVerses] = useState<Verse[] | null>(null);
  const [points, setPoints] = useState<Point[] | null>(null);
  const [generating, setGenerating] = useState(false);

  const book = BOOKS.find((b) => b.id === bookId)!;

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

  // AI insights: cached in IndexedDB first, then the pre-generated bundle
  // (see lib/insights.ts), then the Genesis 1 seed, and only falls back to
  // live generation (handleGenerate) for a chapter none of those cover yet.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const cached = await getCachedPoints(bookId, chapter, lang);
      if (cancelled) return;
      if (cached) {
        setPoints(cached);
        return;
      }
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

  async function handleGenerate() {
    if (!settings.aiEndpoint) {
      toast(t.needsKeyMsg);
      return;
    }
    setGenerating(true);
    try {
      const result = await generateChapterInsights(book, chapter, lang, verses ?? [], settings.aiEndpoint);
      await putCachedPoints(bookId, chapter, lang, result, settings.cacheCapMB, settings.keepFavorites);
      setPoints(result);
      refreshCacheUsage();
    } catch (err) {
      if (err instanceof AiNotConfiguredError) toast(t.needsKeyMsg);
      else toast("AI generation failed — check your endpoint in Settings.");
    } finally {
      setGenerating(false);
    }
  }

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
  function goToChapter(bId: string, c: number) {
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
        <svg className="mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="var(--gold)" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M11 14c3-2 6-2 9 0v13c-3-2-6-2-9 0V14z" fill="var(--paper-panel)" stroke="var(--ink)" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M29 14c-3-2-6-2-9 0v13c3-2 6-2 9 0V14z" fill="var(--paper-panel)" stroke="var(--ink)" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M20 14v13" stroke="var(--ink)" strokeWidth="1.6" />
        </svg>
        <div className="wordmark">Inkverse</div>
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
          <div className="view-scroll">
          <div className="chapter-head">
            <div className="chapter-eyebrow">{chapterEyebrow}</div>
            <div className="chapter-title">{book.label[lang]}</div>
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
                <ListenButton id="scripture" text={verses.map((v) => v.t).join(" ")} />
                <div className="verse-list">
                  {verses.map((v) => (
                    <div className="verse-row" key={v.n}>
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
                  {points.map((p, i) => (
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
                <div>
                  <div className="empty-note">{t.sampleOnlyMsg}</div>
                  <button type="button" className="generate-btn" disabled={generating || !verses} onClick={handleGenerate}>
                    {generating ? t.generatingMsg : t.generateBtn}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="chapter-nav">
            <button
              type="button"
              className="chapter-nav-btn"
              disabled={!prevTarget}
              onClick={() => goAdjacent(-1)}
            >
              <span aria-hidden="true">&larr;</span> {t.prevChapterLabel}
            </button>
            <button
              type="button"
              className="chapter-nav-btn next"
              disabled={!nextTarget}
              onClick={() => goAdjacent(1)}
            >
              {t.nextChapterLabel} <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
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
              <ListenButton id="detail" text={`${point.title}. ${point.body.map(stripHtml).join(" ")}`} />
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

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={navigateFromDrawer} />

      <ContentsModal
        open={modal === "contents"}
        onClose={() => setModal(null)}
        onSelectChapter={(bId, c) => goToChapter(bId, c)}
      />

      <SearchModal
        open={modal === "search"}
        onClose={() => setModal(null)}
        onResult={(resultLang, action) => {
          setBookId("gen");
          setChapter(1);
          if (action.type === "point") {
            setTab("insights");
            setOpenPointIndex(action.index);
          } else {
            setTab("scripture");
            setOpenPointIndex(null);
          }
          void resultLang;
        }}
      />

      <SettingsModal open={modal === "settings"} onClose={() => setModal(null)} />

      <Toast />
    </div>
  );
}
