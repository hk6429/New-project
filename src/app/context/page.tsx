import Link from "next/link";
import { ContextQuiz } from "@/components/game/context-quiz";
import { questionBank } from "@/data/questions";
import { createRound } from "@/domain/game/create-round";

export default function ContextPage() {
  const contextQuestions = createRound(questionBank.filter((question) => question.type === "context-match"), { count: 8 });

  return (
    <main id="main-content" tabIndex={-1} className="page-shell">
      <Link className="back-link" href="/adventure">返回冒險地圖</Link>
      <ContextQuiz questions={contextQuestions} />
      <p className="pilot-disclaimer">本關使用來源已查、待兩名國文教師複核的試行題。</p>
    </main>
  );
}
