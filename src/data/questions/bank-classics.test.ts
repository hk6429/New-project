import { describe, expect, it } from "vitest";
import { validateQuestion } from "@/domain/questions/validate-question";
import { pilotQuestions } from "./pilot";
import { classicBankQuestions } from "./bank-classics";

describe("古典借代題庫批次 A", () => {
  it("至少包含 55 個不重複且不與 pilot 重疊的核心題材", () => {
    expect(classicBankQuestions.length).toBeGreaterThanOrEqual(55);
    const topics = new Set(classicBankQuestions.map((question) => question.coreTopicId));
    expect(topics.size).toBe(classicBankQuestions.length);
    const pilotTerms = new Set(pilotQuestions.map((question) => question.metonym));
    expect(classicBankQuestions.some((question) => pilotTerms.has(question.metonym))).toBe(false);
  });

  it("全部符合完整模型、使用官方來源且保持待複核", () => {
    for (const question of classicBankQuestions) {
      expect(validateQuestion(question)).toMatchObject({ success: true });
      expect(question.status).toBe("pending-review");
      expect(question.reviewers).toEqual([]);
      expect(question.source?.url).toContain("dict.revised.moe.edu.tw");
      expect(question.options).toHaveLength(4);
      expect(Object.keys(question.distractorRationales)).toHaveLength(3);
    }
  });
});
