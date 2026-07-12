import Link from "next/link";
import { ContextQuiz } from "@/components/game/context-quiz";
import { questionBank } from "@/data/questions";
import { createRound } from "@/domain/game/create-round";

export default function RelationPage() {
  const relationQuestions = createRound(questionBank.filter((question) => question.type === "relation"), { count: 8 });

  return (
    <main id="main-content" tabIndex={-1} className="page-shell">
      <Link className="back-link" href="/adventure">返回冒險地圖</Link>
      <ContextQuiz questions={relationQuestions} />
      <p className="pilot-disclaimer">分類名稱用於教學與題庫管理；判斷重點仍是說明兩者的實際相關性。</p>
    </main>
  );
}
