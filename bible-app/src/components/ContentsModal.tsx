import { Fragment, useState } from "react";
import { useApp } from "../context/AppContext";
import { UI } from "../data/languages";
import { BOOKS, bookAbbr } from "../data/books";

const COLUMNS = 4;

export function ContentsModal({
  open,
  onClose,
  onSelectChapter,
}: {
  open: boolean;
  onClose: () => void;
  onSelectChapter: (bookId: string, chapter: number) => void;
}) {
  const { lang } = useApp();
  const t = UI[lang];
  const [expandedBookId, setExpandedBookId] = useState("gen");
  const expandedIndex = BOOKS.findIndex((b) => b.id === expandedBookId);
  const expandedRow = Math.floor(expandedIndex / COLUMNS);
  const expandedBook = BOOKS[expandedIndex];
  const chapters = Array.from({ length: expandedBook.chapters }, (_, i) => i + 1);

  function pick(c: number) {
    onSelectChapter(expandedBookId, c);
    onClose();
  }

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
          {BOOKS.map((b, i) => {
            const row = Math.floor(i / COLUMNS);
            const isRowEnd = (i + 1) % COLUMNS === 0 || i === BOOKS.length - 1;
            return (
              <Fragment key={b.id}>
                <button
                  type="button"
                  className={`book-cell${b.id === expandedBookId ? " active" : ""}`}
                  onClick={() => setExpandedBookId(b.id)}
                >
                  <span className="glyph">{bookAbbr(b, lang)}</span>
                  <span className="code">{b.id.slice(0, 3).toUpperCase()}</span>
                </button>
                {isRowEnd && row === expandedRow && (
                  <div className="chapter-panel">
                    <div className="chapter-panel-title">{expandedBook.label[lang]}</div>
                    <div className="chapter-grid">
                      {chapters.map((c) => (
                        <button key={c} type="button" className="chapter-cell" onClick={() => pick(c)}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
