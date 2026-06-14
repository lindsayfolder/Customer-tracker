import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Progress {
  completedLessons: Set<string>;
  completedExercises: Set<string>;
  exerciseScores: Record<string, number>;
}

const STORAGE_KEY = '@mit_cs_progress';

export function useProgress() {
  const [progress, setProgress] = useState<Progress>({
    completedLessons: new Set(),
    completedExercises: new Set(),
    exerciseScores: {},
  });

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setProgress({
          completedLessons: new Set(data.completedLessons ?? []),
          completedExercises: new Set(data.completedExercises ?? []),
          exerciseScores: data.exerciseScores ?? {},
        });
      }
    } catch {}
  }

  async function markLessonComplete(lessonId: string) {
    setProgress((prev) => {
      const next = {
        ...prev,
        completedLessons: new Set([...prev.completedLessons, lessonId]),
      };
      saveProgress(next);
      return next;
    });
  }

  async function markExerciseComplete(exerciseId: string, score: number) {
    setProgress((prev) => {
      const next = {
        ...prev,
        completedExercises: new Set([...prev.completedExercises, exerciseId]),
        exerciseScores: { ...prev.exerciseScores, [exerciseId]: score },
      };
      saveProgress(next);
      return next;
    });
  }

  async function saveProgress(p: Progress) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completedLessons: [...p.completedLessons],
          completedExercises: [...p.completedExercises],
          exerciseScores: p.exerciseScores,
        })
      );
    } catch {}
  }

  function getCoursePct(courseId: string, totalLessons: number): number {
    if (totalLessons === 0) return 0;
    const done = [...progress.completedLessons].filter((id) =>
      id.startsWith(courseId)
    ).length;
    return Math.round((done / totalLessons) * 100);
  }

  return { progress, markLessonComplete, markExerciseComplete, getCoursePct };
}
