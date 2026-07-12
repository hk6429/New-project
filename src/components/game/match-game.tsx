"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { shuffle } from "@/domain/game/shuffle";
import type { BorrowedWordsQuestion } from "@/domain/questions/types";
import { loadProgress, recordAchievement, saveProgress } from "@/infrastructure/progress/progress-store";
import { RewardCard } from "@/components/rewards/reward-card";

interface MatchGameProps {
  questions: BorrowedWordsQuestion[];
}

type Card = {
  id: string;
  questionId: string;
  side: "metonym" | "referent";
  label: string;
};

export function MatchGame({ questions }: MatchGameProps) {
  const roundQuestions = useMemo(() => questions.slice(0, 4), [questions]);
  const orderedCards = useMemo<Card[]>(
    () =>
      roundQuestions.flatMap((question, index) => {
        const pair: Card[] = [
          { id: `${question.id}-metonym`, questionId: question.id, side: "metonym", label: question.metonym },
          { id: `${question.id}-referent`, questionId: question.id, side: "referent", label: question.referent },
        ];
        return index % 2 === 0 ? pair : pair.reverse();
      }),
    [roundQuestions],
  );
  const [cards, setCards] = useState<Card[]>(orderedCards);
  const [selected, setSelected] = useState<Card | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState("請先選一張借代詞或實際所指卡。 ");
  const [explanation, setExplanation] = useState("");
  const [attempts, setAttempts] = useState(0);
  const awarded = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setCards(shuffle(orderedCards)), 0);
    return () => window.clearTimeout(timer);
  }, [orderedCards]);

  function restart() {
    setCards(shuffle(orderedCards));
    setSelected(null);
    setMatched(new Set());
    setFeedback("新一局已重新洗牌，請開始偵查。");
    setExplanation("");
    setAttempts(0);
    awarded.current = false;
  }

  function choose(card: Card) {
    if (matched.has(card.questionId)) return;
    if (!selected) {
      setSelected(card);
      setFeedback(`已選擇「${card.label}」，再選一張卡完成配對。`);
      setExplanation("");
      return;
    }
    if (selected.id === card.id) {
      setSelected(null);
      setFeedback("已取消選取，請重新選擇。");
      return;
    }

    setAttempts((value) => value + 1);
    const isMatch = selected.questionId === card.questionId && selected.side !== card.side;
    if (isMatch) {
      const question = roundQuestions.find((item) => item.id === card.questionId);
      setMatched((current) => new Set(current).add(card.questionId));
      setFeedback(`配對成功：「${question?.metonym}」代稱「${question?.referent}」。`);
      setExplanation(question?.rationale ?? "");
    } else {
      setFeedback("這兩張還不是一組。提示：借代要找的是有實際相關性的詞語。");
      setExplanation("");
    }
    setSelected(null);
  }

  const complete = matched.size === roundQuestions.length;

  useEffect(() => {
    if (!complete || awarded.current) return;
    awarded.current = true;
    const progress = loadProgress();
    saveProgress(recordAchievement({
      ...progress,
      completedZones: Array.from(new Set([...progress.completedZones, "term-match"])),
      experience: progress.experience + roundQuestions.length * 100,
    }, { zoneId: "term-match", score: Math.max(0, 1000 - attempts * 50), cardIds: roundQuestions.map((q) => q.id), badge: "配對破案者" }));
  }, [attempts, complete, roundQuestions]);

  return (
    <section className="game-shell" aria-labelledby="game-title">
      <div className="game-toolbar">
        <div>
          <p className="eyebrow">名稱交換所・試行題庫</p>
          <h1 id="game-title">找出借代詞的真正身分</h1>
        </div>
        <div className="game-stats" aria-label="遊戲進度">
          <span>完成 {matched.size}/{roundQuestions.length}</span>
          <span>嘗試 {attempts} 次</span>
        </div>
      </div>

      <p className="game-instruction">選擇一張「借代詞」和一張「實際所指」，找出正確配對。</p>

      <div className="match-board">
        {cards.map((card) => {
          const isMatched = matched.has(card.questionId);
          const isSelected = selected?.id === card.id;
          return (
            <button
              className={`match-card${isSelected ? " is-selected" : ""}${isMatched ? " is-matched" : ""}`}
              type="button"
              key={card.id}
              onClick={() => choose(card)}
              aria-pressed={isSelected}
              disabled={isMatched}
              aria-label={`${card.side === "metonym" ? "借代詞" : "實際所指"}：${card.label}`}
              data-question-id={card.questionId}
              data-card-side={card.side}
            >
              <span className="card-kind">{card.side === "metonym" ? "借代詞" : "實際所指"}</span>
              <strong>{card.label}</strong>
              {isMatched && <span className="card-state">已配對</span>}
            </button>
          );
        })}
      </div>

      <div className={`feedback-panel${complete ? " is-complete" : ""}`} role="status" aria-live="polite">
        <strong>{complete ? "本局完成・配對成功" : "偵探提示"}</strong>
        <p>{complete ? `你用了 ${attempts} 次嘗試完成所有配對。` : feedback}</p>
        {explanation && <p className="explanation">解析：{explanation}</p>}
      </div>
      {complete && <div className="completion-actions"><button className="button primary" type="button" onClick={restart}>重新洗牌再玩一局</button><Link className="button secondary" href="/adventure">回冒險地圖</Link><Link className="button secondary" href="/relation">挑戰關係研究室</Link></div>}
      {complete && <RewardCard badge="配對破案者" score={Math.max(0, 1000 - attempts * 50)} personalBest={Math.max(1000 - attempts * 50, loadProgress().personalBests?.["term-match"] ?? 0)} solvedCards={loadProgress().solvedCardIds?.length ?? roundQuestions.length} nextTarget="到關係研究室說出借代雙方的關聯" />}
    </section>
  );
}
