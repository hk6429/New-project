import Link from "next/link";

const features = [
  { number: "01", title: "配對破案", text: "從借代詞與實際所指開始，兩分鐘完成一局。" },
  { number: "02", title: "語境推理", text: "不只背答案，還要從完整句子找出判斷線索。" },
  { number: "03", title: "迷思拆解", text: "用相關性與相似性，分清借代和借喻。" },
];

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要內容</a>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="借代偵探學院首頁">
          <span className="brand-mark" aria-hidden="true">代</span>
          <span>借代偵探學院</span>
        </Link>
        <nav aria-label="主要導覽">
          <Link href="/adventure">冒險地圖</Link>
          <Link href="/review">錯題復習</Link>
          <Link href="/teacher">教師入口</Link>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">國文冒險學院・第四學習階段</p>
            <h1>破解詞語的<br /><span>隱藏身分</span></h1>
            <p className="hero-lead">杜康為什麼不是人，而是一杯酒？從卡牌配對到古文判讀，成為看穿借代線索的修辭偵探。</p>
            <div className="hero-actions">
              <Link className="button primary" href="/play">開始第一局</Link>
              <Link className="button secondary" href="/adventure">查看冒險地圖</Link>
            </div>
            <p className="privacy-note">免註冊・進度保存在目前裝置・手機即可遊玩</p>
          </div>

          <div className="hero-visual" aria-label="借代卡牌示意">
            <div className="orbit orbit-one" aria-hidden="true"></div>
            <div className="orbit orbit-two" aria-hidden="true"></div>
            <article className="showcase-card term-card">
              <span>借代詞</span>
              <strong>杜康</strong>
              <small>曹操〈短歌行〉</small>
            </article>
            <div className="connection-mark" aria-hidden="true">相　關</div>
            <article className="showcase-card answer-card">
              <span>實際所指</span>
              <strong>酒</strong>
              <small>人物代相關事物</small>
            </article>
          </div>
        </section>

        <section className="feature-section" aria-labelledby="feature-title">
          <div className="section-heading">
            <p className="eyebrow">學習不只翻牌</p>
            <h2 id="feature-title">三步練成修辭判斷力</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.number}>
                <span>{feature.number}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
