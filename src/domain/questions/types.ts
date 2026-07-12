export type QuestionStatus = "draft" | "pending-review" | "verified" | "published" | "disputed" | "disabled";

export interface QuestionSource {
  title: string;
  author?: string;
  url?: string;
  citation: string;
}

export interface BorrowedWordsQuestion {
  id: string;
  coreTopicId: string;
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
  clues: string[];
  distractorRationales: Record<string, string>;
  source: QuestionSource | null;
  license: string;
  creator: string;
  checkers: string[];
  disputeNote: string | null;
  statistics: { attempts: number; correct: number; optionCounts: Record<string, number> };
  version: number;
  createdAt: string;
  updatedAt: string;
  reviewers: string[];
  status: QuestionStatus;
}

export type QuestionValidationResult =
  | { success: true; question: BorrowedWordsQuestion; warnings: string[] }
  | { success: false; errors: string[] };
