import Link from "next/link";
import { ContextQuiz } from "@/components/game/context-quiz";
import { pilotQuestions } from "@/data/questions/pilot";

export default function RelationPage() {
  const relationQuestions = pilotQuestions
    .filter((question) => question.type === "relation")
    .slice(0, 8);

  return (
    <main className="page-shell">
      <Link className="back-link" href="/adventure">返回冒險地圖</Link>
      <ContextQuiz questions={relationQuestions} />
      <p className="pilot-disclaimer">分類名稱用於教學與題庫管理；判斷重點仍是說明兩者的實際相關性。</p>
    </main>
  );
}

