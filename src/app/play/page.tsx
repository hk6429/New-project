import Link from "next/link";
import { MatchGame } from "@/components/game/match-game";
import { questionBank } from "@/data/questions";
import { createRound } from "@/domain/game/create-round";

export default function PlayPage() {
  const termQuestions = createRound(questionBank.filter((question) => question.type === "term-match"), { count: 6 });
  return (
    <main id="main-content" tabIndex={-1} className="page-shell">
      <Link className="back-link" href="/">返回學院首頁</Link>
      <MatchGame questions={termQuestions} />
      <p className="pilot-disclaimer">本局使用來源已查、待國文教師雙人複核的試行題，不列入正式成績。</p>
    </main>
  );
}
