"use client";

import { FormEvent, useState } from "react";
import { RewardCard } from "@/components/rewards/reward-card";
import { loadProgress, recordAchievement, saveProgress } from "@/infrastructure/progress/progress-store";

const missions = [
  { metonym: "白衣天使", referent: "醫護人員", clue: "用服飾特徵代稱人物" },
  { metonym: "國服", referent: "國家運動代表隊", clue: "用衣著或象徵代稱團體" },
  { metonym: "筆桿", referent: "文字創作工作者", clue: "用工具代稱職業或活動" },
];

export function SentenceForge() {
  const [missionIndex, setMissionIndex] = useState(0);
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const mission = missions[missionIndex];
  const includesTerm = sentence.includes(mission.metonym);
  const hasContext = sentence.trim().length >= 12;

  function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    const progress = loadProgress();
    saveProgress(recordAchievement({
      ...progress,
      completedZones: Array.from(new Set([...progress.completedZones, "forge"])),
    }, { zoneId: "forge", score: sentence.trim().length, cardIds: [`forge-${missionIndex + 1}`], badge: "文句鍛造師" }));
  }

  function nextMission() {
    setMissionIndex((current) => (current + 1) % missions.length);
    setSentence("");
    setSubmitted(false);
  }

  return (
    <section className="forge-panel" aria-labelledby="forge-title">
      <div className="forge-mission">
        <p className="eyebrow">創造力任務 {missionIndex + 1}/{missions.length}</p>
        <h1 id="forge-title">用「{mission.metonym}」鍛造一句話</h1>
        <p>這個借代詞指「{mission.referent}」；{mission.clue}。</p>
      </div>
      <form onSubmit={submit}>
        <label htmlFor="forged-sentence">你的文句</label>
        <textarea id="forged-sentence" value={sentence} onChange={(event) => { setSentence(event.target.value); setSubmitted(false); }} placeholder={`請寫一句至少 12 個字、包含「${mission.metonym}」的情境句。`} minLength={12} required />
        <div className="forge-checklist" aria-label="文句自我檢查">
          <span className={includesTerm ? "is-ready" : ""}>{includesTerm ? "已完成" : "待完成"}：使用指定借代詞</span>
          <span className={hasContext ? "is-ready" : ""}>{hasContext ? "已完成" : "待完成"}：提供可判斷的完整語境</span>
        </div>
        <button className="button primary" type="submit" disabled={!includesTerm || !hasContext}>完成自檢</button>
      </form>
      {submitted && <><div className="answer-explanation is-correct forge-complete" role="status"><strong>文句已鍛造完成</strong><p>請再問自己：不知道這個借代詞的讀者，能否從前後文推得出「{mission.referent}」？這就是語境線索。</p><button className="button secondary" type="button" onClick={nextMission}>下一個鍛造任務</button></div><RewardCard badge="文句鍛造師" score={sentence.trim().length} personalBest={Math.max(sentence.trim().length, loadProgress().personalBests?.forge ?? 0)} solvedCards={loadProgress().solvedCardIds?.length ?? 1} nextTarget="再鍛造一句，讓語境線索更自然" /></>}
    </section>
  );
}
