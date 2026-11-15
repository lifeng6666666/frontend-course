"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressState {
  visited: Record<string, true>;
  experiments: Record<string, true>;
  quizzes: Record<string, true>;
  markVisited: (id: string) => void;
  markExperiment: (id: string) => void;
  markQuiz: (id: string) => void;
  resetProgress: () => void;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      visited: {},
      experiments: {},
      quizzes: {},
      markVisited: (id) =>
        set((s) =>
          s.visited[id] ? s : { visited: { ...s.visited, [id]: true } }
        ),
      markExperiment: (id) =>
        set((s) =>
          s.experiments[id]
            ? s
            : { experiments: { ...s.experiments, [id]: true } }
        ),
      markQuiz: (id) =>
        set((s) => (s.quizzes[id] ? s : { quizzes: { ...s.quizzes, [id]: true } })),
      resetProgress: () => set({ visited: {}, experiments: {}, quizzes: {} }),
    }),
    { name: "course-progress-v1" }
  )
);
