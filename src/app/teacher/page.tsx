import Link from "next/link";

const troubleSpots = [
  ["借代／借喻的判斷依據", "48%"],
  ["孤帆的替代關係", "63%"],
  ["絲竹的實際所指", "81%"],
];

export default function TeacherPage() {
  return (
    <main className="page-shell teacher-page">
      <Link className="back-link" href="/">返回學院首頁</Link>
      <header className="teacher-heading">
        <div><p className="eyebrow">教師課堂模式・介面預覽</p><h1>八年七班・借代快攻賽</h1></div>
        <div className="join-code"><span>加入碼</span><strong>482731</strong></div>
      </header>
      <section className="metric-grid" aria-label="活動摘要">
        <article><span>已加入</span><strong>27</strong><small>位學生</small></article>
        <article><span>全班正確率</span><strong>76%</strong><small>目前 10 題</small></article>
        <article><span>共同迷思</span><strong className="metric-text">借代／借喻</strong><small>11 人混淆</small></article>
      </section>
      <section className="trouble-panel" aria-labelledby="trouble-title">
        <div className="panel-heading"><div><p className="eyebrow">即時診斷</p><h2 id="trouble-title">需要優先講解</h2></div><span>示範資料</span></div>
        {troubleSpots.map(([label, value]) => (
          <div className="trouble-row" key={label}>
            <span>{label}</span><progress value={Number.parseInt(value)} max="100">{value}</progress><strong>{value}</strong>
          </div>
        ))}
      </section>
      <p className="pilot-disclaimer">教師即時活動與資料庫將在下一階段接通；本頁先確認資訊層級與投影可讀性。</p>
    </main>
  );
}

