import Link from "next/link";
import { ContextQuiz } from "@/components/game/context-quiz";
import { pilotQuestions } from "@/data/questions/pilot";

export default function ContextPage() {
  const contextQuestions = pilotQuestions
    .filter((question) => question.type === "context-match")
    .slice(0, 8);

  return (
    <main className="page-shell">
      <Link className="back-link" href="/adventure">返回冒險地圖</Link>
      <ContextQuiz questions={contextQuestions} />
      <p className="pilot-disclaimer">本關使用來源已查、待兩名國文教師複核的試行題。</p>
    </main>
  );
}

