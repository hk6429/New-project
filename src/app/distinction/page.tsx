import Link from "next/link";
import { ContextQuiz } from "@/components/game/context-quiz";
import { questionBank } from "@/data/questions";
import { createRound } from "@/domain/game/create-round";

export default function DistinctionPage() {
  const questions = createRound(questionBank.filter((question) => question.type === "distinction"), { count: 8 });
  return <main id="main-content" tabIndex={-1} className="page-shell"><Link className="back-link" href="/adventure">返回冒險地圖</Link><ContextQuiz questions={questions} /><p className="pilot-disclaimer">判斷關鍵：借代依據實際相關性，借喻依據相似性；題目仍待國文教師雙人複核。</p></main>;
}
