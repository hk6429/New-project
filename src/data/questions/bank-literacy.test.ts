import { describe, expect, it } from "vitest";
import { validateQuestion } from "@/domain/questions/validate-question";
import { pilotQuestions } from "./pilot";
import { literacyQuestions } from "./bank-literacy";

describe("literacyQuestions", () => {
  it("提供 55 題可進入複核流程的素養題", () => {
    expect(literacyQuestions).toHaveLength(55);
    expect(new Set(literacyQuestions.map((question) => question.id)).size).toBe(55);
    expect(literacyQuestions.filter((question) => question.type === "distinction")).toHaveLength(19);
    expect(literacyQuestions.filter((question) => question.type === "translation")).toHaveLength(18);
    expect(literacyQuestions.filter((question) => question.type === "application")).toHaveLength(18);

    const pilotIds = new Set(pilotQuestions.map((question) => question.id));
    for (const question of literacyQuestions) {
      expect(pilotIds.has(question.id)).toBe(false);
      expect(validateQuestion(question)).toMatchObject({ success: true });
      expect(question.status).toBe("pending-review");
      expect(question.options).toHaveLength(4);
      expect(Object.keys(question.distractorRationales)).toHaveLength(3);
      expect(question.source || question.license.includes("原創")).toBeTruthy();
    }
  });
});
