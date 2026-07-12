import Link from "next/link";
import { ProgressSummary } from "@/components/progress/progress-summary";

const zones = [
  ["01", "名稱交換所", "借代詞與實際所指配對", "/play"],
  ["02", "關係研究室", "理解特徵、部分、器物等替代關係", "/relation"],
  ["03", "古文時空門", "從完整句子破解經典文本中的借代", "/context"],
  ["04", "生活偵查局", "尋找校園與生活中的借代", ""],
  ["05", "修辭迷霧谷", "辨析借代、借喻、象徵與轉化", ""],
  ["06", "文句鍛造塔", "選詞、改寫與情境運用", ""],
];

export default function AdventurePage() {
  return (
    <main className="page-shell">
      <Link className="back-link" href="/">返回學院首頁</Link>
      <header className="page-heading">
        <p className="eyebrow">修辭偵探進修路線</p>
        <h1>六區冒險地圖</h1>
        <p>先辨認詞義，再走進語境，最後學會自己運用借代。</p>
      </header>
      <ProgressSummary />
      <div className="review-entry"><Link className="button secondary" href="/review">打開錯題復習室</Link></div>
      <ol className="zone-list">
        {zones.map(([number, title, description, href]) => (
          <li className={href ? "zone is-open" : "zone"} key={number}>
            <span className="zone-number">{number}</span>
            <div><h2>{title}</h2><p>{description}</p></div>
            {href ? <Link className="button primary" href={href}>進入關卡</Link> : <span className="zone-status">即將開放</span>}
          </li>
        ))}
      </ol>
    </main>
  );
}
