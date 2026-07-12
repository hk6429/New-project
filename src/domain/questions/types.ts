export type QuestionStatus = "draft" | "pending-review" | "verified" | "published" | "disputed" | "disabled";

export interface QuestionSource {
  title: string;
  author?: string;
  url?: string;
  citation: string;
}

export interface BorrowedWordsQuestion {
  id: string;
  type: "term-match" | "context-match" | "relation" | "distinction" | "translation" | "application";
  grade: Array<7 | 8 | 9>;
  difficulty: "basic" | "intermediate" | "advanced";
  prompt: string;
  options: string[];
  correctAnswers: string[];
  metonym: string;
  referent: string;
  relation: string;
  rationale: string;
  context: string;
  source: QuestionSource | null;
  reviewers: string[];
  status: QuestionStatus;
}

export type QuestionValidationResult =
  | { success: true; question: BorrowedWordsQuestion }
  | { success: false; errors: string[] };

