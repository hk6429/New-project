"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { questionBank } from "@/data/questions";
import { loadProgress, saveProgress } from "@/infrastructure/progress/progress-store";
import type { BorrowedWordsQuestion } from "@/domain/questions/types";

export function ReviewList() {
  const [questions, setQuestions] = useState<BorrowedWordsQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [masteredAll, setMasteredAll] = useState(false);
  const emptyStateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const ids = new Set(loadProgress().mistakeIds);
      setQuestions(questionBank.filter((question) => ids.has(question.id)));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (masteredAll) emptyStateRef.current?.focus();
  }, [masteredAll]);

  if (questions.length === 0) {
    return <div ref={emptyStateRef} tabIndex={masteredAll ? -1 : undefined} className="empty-review" role={masteredAll ? "status" : undefined}><h2>{masteredAll ? "已掌握全部錯題！" : "目前沒有待復習題"}</h2><p>{masteredAll ? "你已經用再提取證明理解，可以回到冒險地圖挑戰下一關。" : "完成語境偵查後，答錯的題目會自動出現在這裡。"}</p><Link className="button primary" href={masteredAll ? "/adventure" : "/play"}>{masteredAll ? "挑戰下一關" : "開始第一場挑戰"}</Link></div>;
  }

  const question = questions[index];
  const correct = selected === question.correctAnswers[0];

  function answer(option: string) {
    if (selected) return;
    setSelected(option);
    if (option !== question.correctAnswers[0]) return;
    const progress = loadProgress();
    const nextQuestions = questions.filter((item) => item.id !== question.id);
    saveProgress({
      ...progress,
      mistakeIds: progress.mistakeIds.filter((id) => id !== question.id),
      experience: progress.experience + 50,
    });
    setQuestions(nextQuestions);
    setMasteredAll(nextQuestions.length === 0);
    setIndex((current) => Math.min(current, Math.max(nextQuestions.length - 1, 0)));
  }

  function next() {
    setSelected(null);
    setIndex((current) => (current + 1) % questions.length);
  }

  return (
    <section className="review-practice" aria-labelledby="review-question-title">
      <div className="quiz-progress"><span>錯題再偵查</span><span>{index + 1}/{questions.length}</span></div>
      <article className="context-card">
        <p className="eyebrow">再提取一次，才是真正掌握</p>
        <h2 id="review-question-title">{question.prompt}</h2>
        <p>「{question.metonym}」在這個語境中代稱什麼？</p>
      </article>
      <div className="option-grid" aria-label="復習答案選項">
        {question.options.map((option) => (
          <button className={`quiz-option${selected === option ? " is-chosen" : ""}${selected && option === question.correctAnswers[0] ? " is-correct" : ""}`} type="button" key={option} onClick={() => answer(option)} disabled={selected !== null}>
            {option}
            {selected && option === question.correctAnswers[0] && <span className="option-state">正確答案</span>}
            {selected === option && option !== question.correctAnswers[0] && <span className="option-state">你選的答案</span>}
          </button>
        ))}
      </div>
      {selected && (
        <div className={`answer-explanation${correct ? " is-correct" : " is-wrong"}`} role="status" aria-live="polite">
          <strong>{correct ? "已掌握！這題已移出錯題清單。" : `再看一次：正確答案是「${question.correctAnswers[0]}」。`}</strong>
          <p>關係：{question.relation}</p><p>解析：{question.rationale}</p>
          {!correct && <button className="button primary" type="button" onClick={next}>稍後再練這題</button>}
        </div>
      )}
    </section>
  );
}
