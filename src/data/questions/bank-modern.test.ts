import { describe, expect, it } from "vitest";
import { validateQuestion } from "@/domain/questions/validate-question";
import { modernQuestions } from "./bank-modern";

describe("modernQuestions", () => {
  it("提供至少 55 題獨立、待複核的現代生活題", () => {
    expect(modernQuestions.length).toBeGreaterThanOrEqual(55);
    expect(new Set(modernQuestions.map((question) => question.id)).size).toBe(modernQuestions.length);
    expect(modernQuestions.every((question) => question.status === "pending-review")).toBe(true);
    expect(modernQuestions.every((question) => question.license.includes("CC BY 4.0"))).toBe(true);
  });

  it("至少一半是應用或辨析題，且全部通過結構驗證", () => {
    const higherOrder = modernQuestions.filter((question) => ["application", "distinction"].includes(question.type));
    expect(higherOrder.length).toBeGreaterThanOrEqual(Math.ceil(modernQuestions.length / 2));
    for (const question of modernQuestions) {
      expect(validateQuestion(question)).toMatchObject({ success: true });
      const wrongOptions = question.options.filter((option) => !question.correctAnswers.includes(option));
      expect(wrongOptions.every((option) => question.distractorRationales[option]?.length > 12)).toBe(true);
    }
  });
});
