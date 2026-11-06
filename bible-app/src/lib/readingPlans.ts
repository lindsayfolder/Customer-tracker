import { READING_PLANS, type ReadingPlan } from "../data/readingPlans";
import type { PlanProgress } from "./db";

export function findPlan(planId: string): ReadingPlan | undefined {
  return READING_PLANS.find((p) => p.id === planId);
}

export function getProgress(plans: PlanProgress[], planId: string): PlanProgress | undefined {
  return plans.find((p) => p.planId === planId);
}

// The day to show by default when opening a plan: the first day not yet
// checked off, or the last day if every day is (covers a fully completed
// plan, where there's no "next" day left to point at).
export function nextIncompleteDay(plan: ReadingPlan, progress: PlanProgress | undefined): number {
  if (!progress) return 0;
  const idx = plan.days.findIndex((_, i) => !progress.completedDays.includes(i));
  return idx === -1 ? plan.days.length - 1 : idx;
}

// Starting an already-started plan restarts it (one record per plan — see
// PlanProgress's own doc in db.ts for why this is a deliberate design
// choice, not a limitation): a fresh startedAt and an empty completedDays,
// discarding whatever progress or completedAt it had before.
export function startOrRestartPlan(plans: PlanProgress[], planId: string): PlanProgress[] {
  const now = Date.now();
  const fresh: PlanProgress = { planId, startedAt: now, lastActivityAt: now, completedDays: [] };
  return [...plans.filter((p) => p.planId !== planId), fresh];
}

export function markDayComplete(
  plans: PlanProgress[],
  planId: string,
  dayIndex: number,
): { plans: PlanProgress[]; justCompleted: boolean } {
  const plan = findPlan(planId);
  if (!plan) return { plans, justCompleted: false };
  const now = Date.now();
  const existing = getProgress(plans, planId) ?? { planId, startedAt: now, lastActivityAt: now, completedDays: [] };
  if (existing.completedDays.includes(dayIndex)) return { plans, justCompleted: false };
  const completedDays = [...existing.completedDays, dayIndex].sort((a, b) => a - b);
  const justCompleted = completedDays.length >= plan.days.length;
  const next: PlanProgress = { ...existing, completedDays, lastActivityAt: now, completedAt: justCompleted ? now : undefined };
  return { plans: [...plans.filter((p) => p.planId !== planId), next], justCompleted };
}
