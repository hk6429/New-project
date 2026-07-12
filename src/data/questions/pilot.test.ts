import { describe, expect, it } from "vitest";
import { validateQuestion } from "@/domain/questions/validate-question";
import { pilotQuestions } from "./pilot";

describe("pilotQuestions", () => {
  it("所有試行題都通過結構驗證且不冒充正式發布題", () => {
    expect(pilotQuestions.length).toBeGreaterThanOrEqual(16);
    for (const question of pilotQuestions) {
      expect(validateQuestion(question)).toMatchObject({ success: true });
      expect(question.status).toBe("pending-review");
      expect(question.source).not.toBeNull();
    }
  });
});

