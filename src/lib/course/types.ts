export type ChapterStatus = "live" | "soon";

export interface ChapterMeta {
  id: string;
  kind: "chapter" | "project" | "land" | "appendix";
  partId: string;
  label: string;
  title: string;
  subtitle?: string;
  status: ChapterStatus;
  /** 目录与占位页使用的大纲 */
  outline: string[];
  experimentId?: string;
}

export interface PartMeta {
  id: string;
  title: string;
  desc: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}
