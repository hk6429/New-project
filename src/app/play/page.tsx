import Link from "next/link";
import { MatchGame } from "@/components/game/match-game";
import { pilotQuestions } from "@/data/questions/pilot";

export default function PlayPage() {
  return (
    <main className="page-shell">
      <Link className="back-link" href="/">返回學院首頁</Link>
      <MatchGame questions={pilotQuestions.slice(0, 6)} />
      <p className="pilot-disclaimer">本局使用來源已查、待國文教師雙人複核的試行題，不列入正式成績。</p>
    </main>
  );
}

