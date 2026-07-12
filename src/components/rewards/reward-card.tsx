import Link from "next/link";

export function RewardCard({ badge, score, personalBest, solvedCards, nextTarget }: { badge: string; score: number; personalBest: number; solvedCards: number; nextTarget: string }) {
  return <section className="reward-card" aria-label="過關成果"><p className="eyebrow">任務成果</p><div className="reward-badge" aria-hidden="true">◆</div><h2>獲得徽章：{badge}</h2><div className="reward-metrics"><span>本局 <strong>{score}</strong></span><span>個人最佳 <strong>{personalBest}</strong></span><span>已破解卡牌 <strong>{solvedCards}</strong></span></div><p>下一目標：{nextTarget}</p><div className="completion-actions"><Link className="button primary" href="/adventure">回到冒險地圖</Link><Link className="button secondary" href="/review">復習錯題</Link></div></section>;
}
