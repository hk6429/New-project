"use client";

import { useEffect, useState } from "react";
import { pilotQuestions } from "@/data/questions/pilot";
import { loadProgress } from "@/infrastructure/progress/progress-store";
import type { BorrowedWordsQuestion } from "@/domain/questions/types";

export function ReviewList() {
  const [questions, setQuestions] = useState<BorrowedWordsQuestion[]>([]);

  useEffect(() => {
    const ids = new Set(loadProgress().mistakeIds);
    setQuestions(pilotQuestions.filter((question) => ids.has(question.id)));
  }, []);

  if (questions.length === 0) {
    return <div className="empty-review"><h2>目前沒有待復習題</h2><p>完成語境偵查後，答錯的題目會自動出現在這裡。</p></div>;
  }

  return (
    <div className="review-list">
      {questions.map((question) => (
        <article key={question.id}>
          <span>{question.metonym} → {question.referent}</span>
          <h2>{question.context}</h2>
          <p>{question.rationale}</p>
          <small>關係：{question.relation}</small>
        </article>
      ))}
    </div>
  );
}

