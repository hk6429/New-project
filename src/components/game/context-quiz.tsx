"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { BorrowedWordsQuestion } from "@/domain/questions/types";
import { scoreRound } from "@/domain/game/score-round";
import { completionIdForQuestionType } from "@/domain/game/zone-progress";
import { loadProgress, recordAchievement, saveProgress } from "@/infrastructure/progress/progress-store";
import { RewardCard } from "@/components/rewards/reward-card";

interface ContextQuizProps {
  questions: BorrowedWordsQuestion[];
}

export function ContextQuiz({ questions }: ContextQuizProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Array<{ correct: boolean }>>([]);
  const question = questions[index];
  const complete = index >= questions.length;
  const firstType = questions[0]?.type ?? "context-match";
  const zoneId = completionIdForQuestionType(firstType);
  const zoneLabel = ({ relation: "關係研究", distinction: "修辭辨析", application: "生活偵查", translation: "古文語譯", "context-match": "語境偵查", "term-match": "詞義配對" } as const)[firstType];
  const awarded = useRef(false);

  useEffect(() => {
    if (!complete || awarded.current) return;
    awarded.current = true;
    const result = scoreRound(answers);
    const progress = loadProgress();
    saveProgress(recordAchievement({
      ...progress,
      completedZones: Array.from(new Set([...progress.completedZones, zoneId])),
      experience: progress.experience + result.score,
    }, { zoneId, score: result.score, cardIds: questions.map((q) => q.id), badge: firstType === "relation" ? "關係研究員" : "語境偵探" }));
  }, [answers, complete, firstType, questions, zoneId]);

  if (complete) {
    const result = scoreRound(answers);
    return (
      <section className="quiz-complete" aria-labelledby="quiz-complete-title">
        <p className="eyebrow">{zoneLabel}完成</p>
        <h2 id="quiz-complete-title">本局得分 {result.score}</h2>
        <p>答對 {result.correctCount}/{questions.length} 題，最高連擊 {result.maxCombo}。</p>
        <RewardCard badge={firstType === "relation" ? "關係研究員" : "語境偵探"} score={result.score} personalBest={Math.max(result.score, loadProgress().personalBests?.[zoneId] ?? 0)} solvedCards={loadProgress().solvedCardIds?.length ?? questions.length} nextTarget={firstType === "relation" ? "進入古文時空門，從上下文判讀所指" : "到錯題復習室完成一次再提取"} />
        <div className="completion-actions">
          <Link className="button primary" href="/adventure">回冒險地圖</Link>
          <Link className="button secondary" href="/review">重練錯題</Link>
          <Link className="button secondary" href="/adventure">挑戰其他關卡</Link>
        </div>
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
        <h1 id="context-title">{isRelation ? question.prompt : question.context}</h1>
        <p>{isRelation ? "選出最合適的借代關係。" : `找出「${question.metonym}」真正指的是誰或什麼。`}</p>
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
              {selected && option === question.correctAnswers[0] && <span className="option-state">正確答案</span>}
              {chosen && !correct && <span className="option-state">你選的答案</span>}
            </button>
          );
        })}
      </div>
      {selected && (
        <div className={`answer-explanation${isCorrect ? " is-correct" : " is-wrong"}`}>
          <strong role="status" aria-live="polite" tabIndex={-1}>{isCorrect ? "答對了" : `還差一步，正確答案是「${question.correctAnswers[0]}」`}</strong>
          <p>關係：{question.relation}（白話說：{plainRelation(question.relation)}）</p>
          <p>解析：{question.rationale}</p>
          <button className="button primary" type="button" onClick={next}>
            {index === questions.length - 1 ? "查看本局成績" : "下一題"}
          </button>
        </div>
      )}
    </section>
  );
}

function plainRelation(relation: string): string {
  if (relation.includes("部分")) return "用一部分代表整體";
  if (relation.includes("人物") || relation.includes("專名")) return "用有關的人名代表事物";
  if (relation.includes("器物") || relation.includes("工具")) return "用工具或物品代表活動、作品";
  if (relation.includes("特徵") || relation.includes("標誌")) return "用最明顯的特徵代表對象";
  return "兩者在真實情境中有固定關聯";
}
