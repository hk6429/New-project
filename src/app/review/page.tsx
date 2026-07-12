import Link from "next/link";
import { ReviewList } from "@/components/progress/review-list";

export default function ReviewPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell">
      <Link className="back-link" href="/adventure">返回冒險地圖</Link>
      <header className="page-heading">
        <p className="eyebrow">個人錯題簿</p>
        <h1>線索復原室</h1>
        <p>重新整理曾經答錯的借代關係，錯誤不是扣分，而是下一次看懂的線索。</p>
      </header>
      <ReviewList />
    </main>
  );
}
