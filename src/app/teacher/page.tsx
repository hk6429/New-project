import Link from "next/link";
import { TeacherConsole } from "@/components/teacher/teacher-console";

export default function TeacherPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell teacher-page">
      <Link className="back-link" href="/">返回學院首頁</Link>
      <TeacherConsole />
    </main>
  );
}
