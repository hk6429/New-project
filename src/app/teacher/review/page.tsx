import Link from "next/link";
import { QuestionReviewConsole } from "@/components/teacher/question-review-console";

export default function TeacherReviewPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell teacher-review-page">
      <Link className="back-link" href="/teacher">返回教師控制臺</Link>
      <QuestionReviewConsole />
    </main>
  );
}
