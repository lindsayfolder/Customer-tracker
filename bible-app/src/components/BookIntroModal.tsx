import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { UI } from "../data/languages";
import type { BookIntro } from "../data/bookIntro";
import { loadBookIntro } from "../lib/bookIntro";
import { ListenButton } from "./ListenButton";

export function BookIntroModal({
  open,
  bookId,
  bookLabel,
  onClose,
}: {
  open: boolean;
  bookId: string;
  bookLabel: string;
  onClose: () => void;
}) {
  const { lang } = useApp();
  const t = UI[lang];
  const [intro, setIntro] = useState<BookIntro | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStatus("loading");
    setIntro(null);
    loadBookIntro(bookId, lang).then((i) => {
      if (cancelled) return;
      setIntro(i);
      setStatus(i ? "ready" : "missing");
    });
    return () => {
      cancelled = true;
    };
  }, [open, bookId, lang]);

  return (
    <div className={`modal-screen${open ? " open" : ""}`}>
      <div className="modal-head">
        <h2>{bookLabel}</h2>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &#10005;
        </button>
      </div>
      <div className="modal-body">
        {status === "ready" && intro ? (
          <>
            <ListenButton id="book-intro" text={`${intro.background} ${intro.keyPoints}`} />
            <div className="section-label">
              <span>{t.introBackgroundLabel}</span>
            </div>
            <div className="caption-box">{intro.background}</div>
            <div className="section-label">
              <span>{t.introKeyPointsLabel}</span>
            </div>
            <div className="caption-box callout">{intro.keyPoints}</div>
          </>
        ) : status === "missing" ? (
          <div className="empty-note">{t.introUnavailableLabel}</div>
        ) : (
          <div className="empty-note">{t.loadingLabel}</div>
        )}
      </div>
    </div>
  );
}
