import Link from "next/link";
import { ContextQuiz } from "@/components/game/context-quiz";
import { modernQuestions } from "@/data/questions/bank-modern";
import { createRound } from "@/domain/game/create-round";

export default function LifePage() {
  const questions = createRound(modernQuestions.filter((question) => question.type === "context-match" || question.type === "application"), { count: 8 });
  return <main id="main-content" tabIndex={-1} className="page-shell"><Link className="back-link" href="/adventure">返回冒險地圖</Link><ContextQuiz questions={questions} /><p className="pilot-disclaimer">本關以臺灣國中校園、媒體與生活情境練習借代；題目仍待國文教師雙人複核。</p></main>;
}
