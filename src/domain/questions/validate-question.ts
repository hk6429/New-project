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
  if (question.correctAnswers.some((answer) => !question.options.includes(answer))) errors.push("正解必須存在於選項中");
  const wrongOptions = question.options.filter((option) => !question.correctAnswers.includes(option));
  if (question.type !== "term-match" && question.options.length < 2) errors.push("選擇題至少需要兩個選項");
  if (wrongOptions.some((option) => !question.distractorRationales[option])) errors.push("每個錯誤選項都必須有設計理由");
  if (question.source && !question.source.url && !question.source.author) errors.push("來源必須包含網址或作者書目定位");

  if (question.status === "published") {
    if (!question.source) errors.push("發布題必須有可追溯來源");
    if (new Set(question.reviewers).size < 2) errors.push("發布題必須有至少兩名複核者");
  }

  if (errors.length > 0) return { success: false, errors };
  const normalized = (value: string) => value.replace(/[\s，。！？、；：「」『』]/g, "").toLowerCase();
  const warnings: string[] = [];
  if (normalized(question.prompt) === normalized(question.context)) warnings.push("題幹與語境高度重複，請檢查是否為換皮題");
  return { success: true, question, warnings };
}
