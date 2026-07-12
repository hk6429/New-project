"use client";

import { useEffect, useState } from "react";
import { loadProgress, type StudentProgress } from "@/infrastructure/progress/progress-store";

const empty: StudentProgress = { completedZones: [], experience: 0, mistakeIds: [] };

export function ProgressSummary() {
  const [progress, setProgress] = useState(empty);

  useEffect(() => setProgress(loadProgress()), []);

  return (
    <section className="progress-summary" aria-label="個人學習進度">
      <div><span>偵探經驗值</span><strong>{progress.experience}</strong></div>
      <div><span>完成關卡</span><strong>{progress.completedZones.length}/6</strong></div>
      <div><span>待復習題</span><strong>{progress.mistakeIds.length}</strong></div>
    </section>
  );
}

