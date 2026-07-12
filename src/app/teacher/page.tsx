import Link from "next/link";
import { TeacherConsole } from "@/components/teacher/teacher-console";

export default function TeacherPage() {
  return (
    <main className="page-shell teacher-page">
      <Link className="back-link" href="/">返回學院首頁</Link>
      <TeacherConsole />
    </main>
  );
}

