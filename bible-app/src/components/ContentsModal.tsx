import { Fragment, useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { UI } from "../data/languages";
import { BOOKS, bookAbbr, type BookMeta } from "../data/books";

const COLUMNS = 4;

function chunk(items: BookMeta[], size: number): BookMeta[][] {
  const rows: BookMeta[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}
const ROWS = chunk(BOOKS, COLUMNS);

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
  const panelRef = useRef<HTMLDivElement>(null);

  // Jumping to a book (from the quick strip or the grid itself) shouldn't
  // require hunting for where its panel landed — scroll it into view.
  useEffect(() => {
    if (open) panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [expandedBookId, open]);

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

      <div className="book-strip">
        {BOOKS.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`book-chip${b.id === expandedBookId ? " active" : ""}`}
            onClick={() => setExpandedBookId(b.id)}
          >
            {bookAbbr(b, lang)}
          </button>
        ))}
      </div>

      <div className="modal-body">
        <div className="contents-hint">{t.contentsHint}</div>
        <div className="book-rows">
          {ROWS.map((rowBooks, rowIndex) => (
            <Fragment key={rowIndex}>
              <div className="book-row">
                {rowBooks.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className={`book-cell${b.id === expandedBookId ? " active" : ""}`}
                    onClick={() => setExpandedBookId(b.id)}
                  >
                    <span className="glyph">{bookAbbr(b, lang)}</span>
                    <span className="code">{b.id.slice(0, 3).toUpperCase()}</span>
                  </button>
                ))}
              </div>
              {rowIndex === expandedRow && (
                <div className="chapter-panel" ref={panelRef}>
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
          ))}
        </div>
      </div>
    </div>
  );
}
