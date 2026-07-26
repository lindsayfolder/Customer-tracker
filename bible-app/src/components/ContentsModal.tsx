import { useState } from "react";
import { useApp } from "../context/AppContext";
import { UI } from "../data/languages";
import { BOOKS, bookAbbr } from "../data/books";

export function ContentsModal({
  open,
  onClose,
  onSelectChapter,
}: {
  open: boolean;
  onClose: () => void;
  onSelectChapter: (bookId: string, chapter: number) => void;
}) {
  const { lang, toast } = useApp();
  const t = UI[lang];
  const [expandedBook, setExpandedBook] = useState("gen");

  const chapters = Array.from({ length: 12 }, (_, i) => i + 1);
  const hasSeed = (bookId: string, chapter: number) => bookId === "gen" && chapter === 1;

  return (
    <div className={`modal-screen${open ? " open" : ""}`}>
      <div className="modal-head">
        <h2>{t.contentsTitle}</h2>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &#10005;
        </button>
      </div>
      <div className="modal-body">
        <div className="contents-hint">{t.contentsHint}</div>
        <div className="book-grid">
          {BOOKS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`book-cell${b.id === expandedBook ? " active" : ""}`}
              onClick={() => setExpandedBook(b.id)}
            >
              <span className="glyph">{bookAbbr(b, lang)}</span>
              <span className="code">{b.id.slice(0, 3).toUpperCase()}</span>
            </button>
          ))}
        </div>
        <div className="chapter-grid">
          {chapters.map((c) => (
            <button
              key={c}
              type="button"
              className={`chapter-cell${hasSeed(expandedBook, c) ? " active" : ""}`}
              onClick={() => {
                if (hasSeed(expandedBook, c)) {
                  onSelectChapter(expandedBook, c);
                  onClose();
                } else {
                  toast(t.sampleOnlyMsg);
                }
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
