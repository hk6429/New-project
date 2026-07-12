import { describe, expect, it } from "vitest";
import { buildQuestionHealthReport } from "@/domain/questions/question-health";
import { validateQuestion } from "@/domain/questions/validate-question";
import { questionBank } from ".";

describe("questionBank", () => {
  it("提供超過 200 題且每題可進入雙師複核流程", () => {
    expect(questionBank.length).toBeGreaterThanOrEqual(200);
    expect(new Set(questionBank.map((question) => question.id)).size).toBe(questionBank.length);
    expect(questionBank.every((question) => question.status === "pending-review")).toBe(true);
    expect(questionBank.every((question) => validateQuestion(question).success)).toBe(true);
    const health = buildQuestionHealthReport(questionBank);
    expect(health.counts.questions).toBe(questionBank.length);
    expect(health.counts.published).toBe(0);
  });
});
