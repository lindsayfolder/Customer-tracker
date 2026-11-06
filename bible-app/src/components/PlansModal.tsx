import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { fmt, UI } from "../data/languages";
import { BOOKS } from "../data/books";
import { READING_PLANS } from "../data/readingPlans";
import type { PlanProgress } from "../lib/db";
import { getProgress, nextIncompleteDay } from "../lib/readingPlans";

export function PlansModal({
  open,
  plans,
  onClose,
  onStart,
  onRestart,
  onMarkDayComplete,
  onGoToChapter,
}: {
  open: boolean;
  plans: PlanProgress[];
  onClose: () => void;
  onStart: (planId: string) => void;
  onRestart: (planId: string) => void;
  onMarkDayComplete: (planId: string, dayIndex: number) => void;
  onGoToChapter: (bookId: string, chapter: number) => void;
}) {
  const { lang } = useApp();
  const t = UI[lang];
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [viewedDayIndex, setViewedDayIndex] = useState(0);

  const plan = READING_PLANS.find((p) => p.id === selectedPlanId) ?? null;
  const progress = plan ? getProgress(plans, plan.id) : undefined;

  // Jump the detail view to the first not-yet-completed day whenever a
  // different plan is opened, or the plan is (re)started — not on every
  // progress update, which would yank the reader back to "today" the
  // moment they finish marking a day complete while browsing other days.
  useEffect(() => {
    if (plan) setViewedDayIndex(nextIncompleteDay(plan, progress));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlanId, progress?.startedAt]);

  if (!plan) {
    return (
      <div className={`modal-screen${open ? " open" : ""}`}>
        <div className="modal-head">
          <h2>{t.plansTitle}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            &#10005;
          </button>
        </div>
        <div className="modal-body">
          {READING_PLANS.map((p) => {
            const prog = getProgress(plans, p.id);
            const total = p.days.length;
            const done = prog?.completedDays.length ?? 0;
            const isDone = !!prog?.completedAt;
            return (
              <button key={p.id} type="button" className="point-card" onClick={() => setSelectedPlanId(p.id)}>
                <div className="point-num">{isDone ? "✓" : "📖"}</div>
                <div className="point-body">
                  <p className="point-title">{p.title[lang]}</p>
                  <p className="point-teaser">{p.description[lang]}</p>
                  {prog && (
                    <p className="plan-progress-mini">{isDone ? t.planCompletedLabel : fmt(t.planProgressTpl, { done, total })}</p>
                  )}
                </div>
                <div className="point-arrow" aria-hidden="true">
                  &rarr;
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const total = plan.days.length;
  const done = progress?.completedDays.length ?? 0;
  const isCompleted = !!progress?.completedAt;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const dayReadings = plan.days[viewedDayIndex] ?? [];
  const dayAlreadyDone = !!progress?.completedDays.includes(viewedDayIndex);

  return (
    <div className={`modal-screen${open ? " open" : ""}`}>
      <div className="modal-head">
        <h2>{plan.title[lang]}</h2>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &#10005;
        </button>
      </div>
      <div className="modal-body">
        <button type="button" className="back-tab" onClick={() => setSelectedPlanId(null)}>
          <span aria-hidden="true">&larr;</span> {t.planBackLabel}
        </button>
        <div className="caption-box">{plan.description[lang]}</div>

        {progress && (
          <>
            <div className="plan-progress-bar">
              <div className="plan-progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="section-label">
              <span>{fmt(t.planProgressTpl, { done, total })}</span>
              <span>{pct}%</span>
            </div>
          </>
        )}

        {!progress ? (
          <button type="button" className="goto-chapter-btn" onClick={() => onStart(plan.id)}>
            {t.planStartButton}
          </button>
        ) : isCompleted ? (
          <>
            <div className="caption-box callout">{t.planCompletedLabel} 🎉</div>
            <button type="button" className="goto-chapter-btn" onClick={() => onRestart(plan.id)}>
              {t.planRestartButton}
            </button>
          </>
        ) : (
          <>
            <div className="section-label">
              <span>{fmt(t.planDayTpl, { d: viewedDayIndex + 1, total })}</span>
            </div>
            <div className="plan-reading-list">
              {dayReadings.map((r, i) => {
                const book = BOOKS.find((b) => b.id === r.bookId);
                return (
                  <button
                    key={i}
                    type="button"
                    className="result-item"
                    onClick={() => {
                      onGoToChapter(r.bookId, r.chapter);
                      onClose();
                    }}
                  >
                    <span className="result-ref">{book ? book.label[lang] : r.bookId} {r.chapter}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="goto-chapter-btn"
              disabled={dayAlreadyDone}
              onClick={() => {
                onMarkDayComplete(plan.id, viewedDayIndex);
                // Advance the view to the next not-yet-completed day right
                // away, computed locally rather than waiting for the
                // parent's progress prop to round-trip back down — that
                // update lands a render later, which would otherwise leave
                // the view stuck showing a just-disabled button with no
                // visible next step. Doesn't touch the separate
                // selectedPlanId-keyed reset effect above, which only
                // needs to fire on open/(re)start, not on every day marked.
                const updated = [...(progress?.completedDays ?? []), viewedDayIndex];
                const next = plan.days.findIndex((_, i) => !updated.includes(i));
                if (next !== -1) setViewedDayIndex(next);
              }}
            >
              {dayAlreadyDone ? t.planMarkedCompleteLabel : t.planMarkCompleteButton}
            </button>
          </>
        )}

        <div className="plan-day-grid">
          {plan.days.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`plan-day-chip${progress?.completedDays.includes(i) ? " done" : ""}${i === viewedDayIndex ? " active" : ""}`}
              onClick={() => setViewedDayIndex(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
