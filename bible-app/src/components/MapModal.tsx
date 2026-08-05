import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { UI } from "../data/languages";
import { loadBookMap } from "../lib/maps";

export function MapModal({ open, bookId, bookLabel, onClose }: { open: boolean; bookId: string; bookLabel: string; onClose: () => void }) {
  const { lang } = useApp();
  const t = UI[lang];
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setSvg(null);
    loadBookMap(bookId).then((s) => {
      if (!cancelled) setSvg(s);
    });
    return () => {
      cancelled = true;
    };
  }, [open, bookId]);

  return (
    <div className={`modal-screen${open ? " open" : ""}`}>
      <div className="modal-head">
        <h2>{bookLabel}</h2>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &#10005;
        </button>
      </div>
      <div className="modal-body">
        {svg ? (
          <div className="maparea" dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <div className="empty-note">{t.loadingLabel}</div>
        )}
      </div>
    </div>
  );
}
