import { questionSchema } from "./schema";
import type { QuestionValidationResult } from "./types";

export function validateQuestion(input: unknown): QuestionValidationResult {
  const errors: string[] = [];
  const parsed = questionSchema.safeParse(input);

  if (!parsed.success) {
    const value = input && typeof input === "object" ? input as Record<string, unknown> : {};
    if (!(["basic", "intermediate", "advanced"] as unknown[]).includes(value.difficulty)) {
      errors.push("題目難度無效");
    }
    if (typeof value.rationale !== "string" || value.rationale.trim().length === 0) {
      errors.push("題目必須有完整解析");
    }
    if (errors.length === 0) errors.push("題目資料欄位不完整");
    return { success: false, errors };
  }

  const question = parsed.data;

  if (question.correctAnswers.length !== 1) errors.push("每題只能有一個正解");
  if (new Set(question.options).size !== question.options.length) errors.push("選項不得重複");

  if (question.status === "published") {
    if (!question.source) errors.push("發布題必須有可追溯來源");
    if (new Set(question.reviewers).size < 2) errors.push("發布題必須有至少兩名複核者");
  }

  if (errors.length > 0) return { success: false, errors };
  return { success: true, question };
}
