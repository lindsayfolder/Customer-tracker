import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { UI } from "../data/languages";
import { BOOKS, bookAbbr } from "../data/books";
import type { Bookmark } from "../lib/db";
import { loadChapterVerses } from "../lib/scripture";

function bookmarkKey(b: Bookmark): string {
  return `${b.bookId}/${b.chapter}/${b.verse}`;
}

export function BookmarksModal({
  open,
  bookmarks,
  onClose,
  onSelect,
  onRemove,
}: {
  open: boolean;
  bookmarks: Bookmark[];
  onClose: () => void;
  onSelect: (bookId: string, chapter: number, verse: number) => void;
  onRemove: (bookmark: Bookmark) => void;
}) {
  const { lang } = useApp();
  const t = UI[lang];
  // Verse text snippets, fetched on demand rather than stored with the
  // bookmark itself — the bookmark only needs to record *where*, and this
  // keeps the snippet in whatever language/version the reader is currently
  // using instead of freezing it to whatever was active when they tapped
  // the verse number.
  const [snippets, setSnippets] = useState<Record<string, string>>({});

  const sorted = [...bookmarks].sort((a, b) => {
    const ai = BOOKS.findIndex((bk) => bk.id === a.bookId);
    const bi = BOOKS.findIndex((bk) => bk.id === b.bookId);
    if (ai !== bi) return ai - bi;
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    return a.verse - b.verse;
  });

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setSnippets({});
    for (const b of bookmarks) {
      loadChapterVerses(b.bookId, b.chapter, lang).then((verses) => {
        if (cancelled) return;
        const verse = verses.find((v) => v.n === b.verse);
        if (verse) setSnippets((prev) => ({ ...prev, [bookmarkKey(b)]: verse.t }));
      });
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lang, bookmarks]);

  return (
    <div className={`modal-screen${open ? " open" : ""}`}>
      <div className="modal-head">
        <h2>{t.bookmarksTitle}</h2>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &#10005;
        </button>
      </div>
      <div className="modal-body">
        {sorted.length === 0 ? (
          <div className="empty-note">{t.bookmarksEmptyLabel}</div>
        ) : (
          sorted.map((b) => {
            const book = BOOKS.find((bk) => bk.id === b.bookId);
            const key = bookmarkKey(b);
            return (
              <div className="bookmark-row" key={key}>
                <button
                  type="button"
                  className="result-item"
                  onClick={() => {
                    onSelect(b.bookId, b.chapter, b.verse);
                    onClose();
                  }}
                >
                  <span className="result-ref">
                    {book ? bookAbbr(book, lang) : b.bookId} {b.chapter}:{b.verse}
                  </span>
                  <div className="result-snippet">{snippets[key] ?? "…"}</div>
                </button>
                <button
                  type="button"
                  className="bookmark-remove-btn"
                  aria-label={t.unbookmarkLabel}
                  onClick={() => onRemove(b)}
                >
                  &#10005;
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
