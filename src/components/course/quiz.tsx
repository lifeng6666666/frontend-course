"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { QuizQuestion } from "@/lib/course/types";
import { useProgress } from "@/lib/course/progress";

interface QuizProps {
  id: string;
  title?: string;
  questions: QuizQuestion[];
}

export function Quiz({ id, title = "自测", questions }: QuizProps) {
  const markQuiz = useProgress((s) => s.markQuiz);
  const done = useProgress((s) => Boolean(s.quizzes[id]));
  // 每题的已选答案；答对后锁定该题
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [locked, setLocked] = useState<Record<number, boolean>>({});
  const [wrongTries, setWrongTries] = useState<Record<number, boolean>>({});

  const allCorrect = questions.every((_, qi) => locked[qi]);

  useEffect(() => {
    if (allCorrect && !done) markQuiz(id);
  }, [allCorrect, done, id, markQuiz]);

  const choose = (qi: number, oi: number) => {
    if (locked[qi]) return;
    setSelected((s) => ({ ...s, [qi]: oi }));
    if (oi === questions[qi].answerIndex) {
      setLocked((s) => ({ ...s, [qi]: true }));
      setWrongTries((s) => ({ ...s, [qi]: false }));
    } else {
      setWrongTries((s) => ({ ...s, [qi]: true }));
    }
  };

  return (
    <div className="my-6 rounded-xl border border-border p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        {allCorrect && (
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            全部答对
          </span>
        )}
      </div>
      <div className="mt-4 space-y-6">
        {questions.map((q, qi) => (
          <div key={qi}>
            <p className="text-[14.5px] font-medium leading-6">
              {qi + 1}. {q.question}
            </p>
            <div className="mt-2 grid gap-2">
              {q.options.map((opt, oi) => {
                const isPicked = selected[qi] === oi;
                const isCorrect = oi === q.answerIndex;
                const showWrong = isPicked && !isCorrect && wrongTries[qi];
                const cls = locked[qi] && isCorrect
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : showWrong
                    ? "border-red-400 bg-red-500/10 text-red-600"
                    : "border-border hover:border-primary/50 hover:bg-muted/60";
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => choose(qi, oi)}
                    disabled={locked[qi]}
                    className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm leading-6 transition-colors disabled:cursor-default ${cls}`}
                  >
                    <span className="font-mono text-xs text-muted-foreground">
                      {"ABCD"[oi]}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {locked[qi] && isCorrect && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                    )}
                    {showWrong && <XCircle className="h-4 w-4 shrink-0 text-red-500" aria-hidden />}
                  </button>
                );
              })}
            </div>
            {locked[qi] && (
              <p className="mt-2 rounded-md bg-muted/60 px-3 py-2 text-[13.5px] leading-6 text-muted-foreground">
                {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
