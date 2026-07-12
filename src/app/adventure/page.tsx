import Link from "next/link";
import { ProgressSummary } from "@/components/progress/progress-summary";
import { AcademyCrest } from "@/components/brand/academy-crest";
import { AdventureMap } from "@/components/map/adventure-map";

export default function AdventurePage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell">
      <Link className="back-link" href="/">返回學院首頁</Link>
      <header className="page-heading map-page-heading">
        <AcademyCrest />
        <div><p className="eyebrow">修辭偵探進修路線</p><h1>六區冒險地圖</h1><p>先辨認詞義，再走進語境，最後學會自己運用借代。</p></div>
      </header>
      <ProgressSummary />
      <div className="review-entry"><Link className="button secondary" href="/review">打開錯題復習室</Link></div>
      <AdventureMap />
    </main>
  );
}
