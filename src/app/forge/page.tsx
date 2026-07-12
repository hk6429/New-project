import Link from "next/link";
import { SentenceForge } from "@/components/game/sentence-forge";

export default function ForgePage() {
  return <main id="main-content" tabIndex={-1} className="page-shell"><Link className="back-link" href="/adventure">返回冒險地圖</Link><SentenceForge /></main>;
}
