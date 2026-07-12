"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProgress } from "@/infrastructure/progress/progress-store";
import { ZoneIcon, type ZoneIconName } from "./zone-icon";

const zones: Array<{ number: string; id: string; title: string; description: string; href: string; icon: ZoneIconName; accent: string; difficulty: string; questions: string; time: string }> = [
  { number: "01", id: "term-match", title: "名稱交換所", description: "借代詞與實際所指配對", href: "/play", icon: "cards", accent: "gold", difficulty: "入門", questions: "4 組配對", time: "約 3 分鐘" },
  { number: "02", id: "relation", title: "關係研究室", description: "理解特徵、部分、器物等替代關係", href: "/relation", icon: "relation", accent: "jade", difficulty: "基礎", questions: "8 題", time: "約 6 分鐘" },
  { number: "03", id: "context-match", title: "古文時空門", description: "從完整句子破解經典文本中的借代", href: "/context", icon: "scroll", accent: "violet", difficulty: "進階", questions: "8 題", time: "約 8 分鐘" },
  { number: "04", id: "application", title: "生活偵查局", description: "尋找校園、媒體與生活中的借代", href: "/life", icon: "campus", accent: "cyan", difficulty: "應用", questions: "8 題", time: "約 7 分鐘" },
  { number: "05", id: "distinction", title: "修辭迷霧谷", description: "辨析借代、借喻、象徵與轉化", href: "/distinction", icon: "mist", accent: "rose", difficulty: "挑戰", questions: "8 題", time: "約 8 分鐘" },
  { number: "06", id: "forge", title: "文句鍛造塔", description: "選詞、改寫與情境運用", href: "/forge", icon: "forge", accent: "orange", difficulty: "創作", questions: "自由鍛造", time: "約 10 分鐘" },
];

export function AdventureMap() {
  const [completed, setCompleted] = useState<string[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => setCompleted(loadProgress().completedZones), 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="adventure-map" aria-labelledby="map-title">
      <div className="map-legend"><h2 id="map-title">學院探索路線</h2><p>依序前進，完成後將獲得區域徽章。</p></div>
      <svg className="map-route" viewBox="0 0 100 560" preserveAspectRatio="none" aria-hidden="true">
        <path d="M50 8 C14 68 14 108 50 135 S86 202 50 270 14 338 50 405 86 472 50 552" />
      </svg>
      <ol className="map-nodes">
        {zones.map((zone, index) => {
          const isComplete = completed.includes(zone.id);
          return (
            <li className={`map-node accent-${zone.accent}${isComplete ? " is-complete" : ""}`} key={zone.id}>
              <div className="map-node-marker" aria-hidden="true"><ZoneIcon name={zone.icon} /><span>{zone.number}</span></div>
              <article>
                <div className="map-node-heading">
                  <div><span className="map-order">推薦第 {index + 1} 站</span><h3>{zone.title}</h3></div>
                  {isComplete && <span className="completion-badge"><span aria-hidden="true">✓</span> 已完成</span>}
                </div>
                <p>{zone.description}</p>
                <dl className="map-meta">
                  <div><dt>難度</dt><dd>{zone.difficulty}</dd></div><div><dt>題數</dt><dd>{zone.questions}</dd></div><div><dt>時間</dt><dd>{zone.time}</dd></div>
                </dl>
                <Link className="button map-action" href={zone.href}>{isComplete ? "再次挑戰" : "進入區域"}<span aria-hidden="true">→</span></Link>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
