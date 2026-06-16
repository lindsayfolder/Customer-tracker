import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mit_cs_progress';

interface Progress {
  completedLessons: Set<string>;
  completedExercises: Set<string>;
  exerciseScores: Record<string, number>;
}

interface StoredProgress {
  completedLessons: string[];
  completedExercises: string[];
  exerciseScores: Record<string, number>;
}

function deserialize(stored: StoredProgress): Progress {
  return {
    completedLessons: new Set(stored.completedLessons),
    completedExercises: new Set(stored.completedExercises),
    exerciseScores: stored.exerciseScores || {},
  };
}

async function loadProgress(): Promise<Progress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedLessons: new Set(), completedExercises: new Set(), exerciseScores: {} };
    return deserialize(JSON.parse(raw));
  } catch {
    return { completedLessons: new Set(), completedExercises: new Set(), exerciseScores: {} };
  }
}

async function saveProgress(progress: Progress): Promise<void> {
  const stored: StoredProgress = {
    completedLessons: Array.from(progress.completedLessons),
    completedExercises: Array.from(progress.completedExercises),
    exerciseScores: progress.exerciseScores,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>({
    completedLessons: new Set(),
    completedExercises: new Set(),
    exerciseScores: {},
  });

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  const markLessonComplete = useCallback(async (lessonId: string) => {
    setProgress((prev) => {
      const next: Progress = {
        completedLessons: new Set([...prev.completedLessons, lessonId]),
        completedExercises: prev.completedExercises,
        exerciseScores: prev.exerciseScores,
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const markExerciseComplete = useCallback(async (exerciseId: string, score: number) => {
    setProgress((prev) => {
      const next: Progress = {
        completedLessons: prev.completedLessons,
        completedExercises: new Set([...prev.completedExercises, exerciseId]),
        exerciseScores: { ...prev.exerciseScores, [exerciseId]: score },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const getCoursePct = useCallback(
    (courseId: string, totalLessons: number): number => {
      if (totalLessons === 0) return 0;
      const done = Array.from(progress.completedLessons).filter((id) =>
        id.startsWith(courseId)
      ).length;
      return Math.round((done / totalLessons) * 100);
    },
    [progress]
  );

  return { progress, markLessonComplete, markExerciseComplete, getCoursePct };
}
