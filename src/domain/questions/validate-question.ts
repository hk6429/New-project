import type { BorrowedWordsQuestion, QuestionValidationResult } from "./types";

export function validateQuestion(question: BorrowedWordsQuestion): QuestionValidationResult {
  const errors: string[] = [];

  if (question.correctAnswers.length !== 1) errors.push("每題只能有一個正解");
  if (new Set(question.options).size !== question.options.length) errors.push("選項不得重複");

  if (question.status === "published") {
    if (!question.source) errors.push("發布題必須有可追溯來源");
    if (new Set(question.reviewers).size < 2) errors.push("發布題必須有至少兩名複核者");
  }

  if (errors.length > 0) return { success: false, errors };
  return { success: true, question };
}
