import Link from "next/link";
import { StudentClassroom } from "@/components/classroom/student-classroom";

export const dynamic = "force-dynamic";

export default function JoinPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell classroom-page">
      <Link className="back-link" href="/">返回學院首頁</Link>
      <StudentClassroom />
    </main>
  );
}
