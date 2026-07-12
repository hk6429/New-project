"use client";

import { useEffect, useState } from "react";
import { loadProgress, type StudentProgress } from "@/infrastructure/progress/progress-store";

const empty: StudentProgress = { completedZones: [], experience: 0, mistakeIds: [] };

export function ProgressSummary() {
  const [progress, setProgress] = useState(empty);

  useEffect(() => {
    const timer = window.setTimeout(() => setProgress(loadProgress()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const abilities = [
    { label: "詞義辨認", value: progress.completedZones.includes("term-match") ? 100 : 20 },
    { label: "關係判斷", value: progress.completedZones.includes("relation") ? 100 : 15 },
    { label: "語境推理", value: progress.completedZones.includes("context-match") ? 100 : 15 },
    { label: "錯題掌握", value: Math.max(10, 100 - progress.mistakeIds.length * 10) },
  ];

  return (
    <section className="progress-summary" aria-label="個人學習進度">
      <div><span>偵探經驗值</span><strong>{progress.experience}</strong></div>
      <div><span>完成關卡</span><strong>{progress.completedZones.length}/6</strong></div>
      <div><span>待復習題</span><strong>{progress.mistakeIds.length}</strong></div>
      <div className="ability-map" aria-label="個人借代能力地圖">
        <span>能力地圖</span>
        {abilities.map((ability) => <label key={ability.label}><span>{ability.label}</span><progress max="100" value={ability.value}>{ability.value}%</progress></label>)}
      </div>
    </section>
  );
}
