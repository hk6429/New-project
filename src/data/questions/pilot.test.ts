import { describe, expect, it } from "vitest";
import { validateQuestion } from "@/domain/questions/validate-question";
import { pilotQuestions } from "./pilot";

describe("pilotQuestions", () => {
  it("所有試行題都通過結構驗證且不冒充正式發布題", () => {
    expect(pilotQuestions).toHaveLength(48);
    expect(new Set(pilotQuestions.map((question) => question.id)).size).toBe(48);
    expect(pilotQuestions.filter((question) => question.type === "term-match")).toHaveLength(16);
    expect(pilotQuestions.filter((question) => question.type === "context-match")).toHaveLength(16);
    expect(pilotQuestions.filter((question) => question.type === "relation")).toHaveLength(16);
    for (const question of pilotQuestions) {
      expect(validateQuestion(question)).toMatchObject({ success: true });
      expect(question.status).toBe("pending-review");
      expect(question.source).not.toBeNull();
    }
  });
});
