"use client";

import { useEffect, useRef, useState } from "react";
import type { BorrowedWordsQuestion } from "@/domain/questions/types";
import { scoreRound } from "@/domain/game/score-round";
import { loadProgress, saveProgress } from "@/infrastructure/progress/progress-store";

interface ContextQuizProps {
  questions: BorrowedWordsQuestion[];
}

export function ContextQuiz({ questions }: ContextQuizProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Array<{ correct: boolean }>>([]);
  const question = questions[index];
  const complete = index >= questions.length;
  const awarded = useRef(false);

  useEffect(() => {
    if (!complete || awarded.current) return;
    awarded.current = true;
    const result = scoreRound(answers);
    const progress = loadProgress();
    saveProgress({
      ...progress,
      completedZones: Array.from(new Set([...progress.completedZones, "context-match"])),
      experience: progress.experience + result.score,
    });
  }, [answers, complete]);

  if (complete) {
    const result = scoreRound(answers);
    return (
      <section className="quiz-complete" aria-labelledby="quiz-complete-title">
        <p className="eyebrow">語境偵查完成</p>
        <h2 id="quiz-complete-title">本局得分 {result.score}</h2>
        <p>答對 {result.correctCount}/{questions.length} 題，最高連擊 {result.maxCombo}。</p>
      </section>
    );
  }

  const isCorrect = selected === question.correctAnswers[0];
  const isRelation = question.type === "relation";

  function answer(option: string) {
    if (selected) return;
    const correct = option === question.correctAnswers[0];
    setSelected(option);
    setAnswers((current) => [...current, { correct }]);
    const progress = loadProgress();
    const mistakeIds = correct
      ? progress.mistakeIds.filter((id) => id !== question.id)
      : Array.from(new Set([...progress.mistakeIds, question.id]));
    saveProgress({ ...progress, mistakeIds });
  }

  function next() {
    setSelected(null);
    setIndex((current) => current + 1);
  }

  return (
    <section className="context-quiz" aria-labelledby="context-title">
      <div className="quiz-progress">
        <span>語境偵查</span>
        <span>第 {index + 1} 題／共 {questions.length} 題</span>
      </div>
      <div className="context-card">
        <p className="eyebrow">{isRelation ? "辨認借代雙方的相關性" : "找出借代詞的實際所指"}</p>
        <h1 id="context-title">{question.prompt}</h1>
        <p>{isRelation ? "選出最合適的借代關係。" : `句中的「${question.metonym}」代稱什麼？`}</p>
      </div>
      <div className="option-grid" aria-label="答案選項">
        {question.options.map((option) => {
          const chosen = selected === option;
          const correct = selected && option === question.correctAnswers[0];
          return (
            <button
              type="button"
              className={`quiz-option${chosen ? " is-chosen" : ""}${correct ? " is-correct" : ""}`}
              key={option}
              onClick={() => answer(option)}
              disabled={selected !== null}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected && (
        <div className={`answer-explanation${isCorrect ? " is-correct" : " is-wrong"}`} role="status" aria-live="polite">
          <strong>{isCorrect ? "答對了" : `還差一步，正確答案是「${question.correctAnswers[0]}」`}</strong>
          <p>關係：{question.relation}</p>
          <p>解析：{question.rationale}</p>
          <button className="button primary" type="button" onClick={next}>
            {index === questions.length - 1 ? "查看本局成績" : "下一題"}
          </button>
        </div>
      )}
    </section>
  );
}
