import { describe, expect, it } from "vitest";
import { buildQuestionHealthReport, TARGET_QUOTAS } from "./question-health";
import { pilotQuestions } from "@/data/questions/pilot";

describe("buildQuestionHealthReport", () => {
  it("分開統計題目、核心題材與發布題，並列出 240 題配額缺口", () => {
    const report = buildQuestionHealthReport(pilotQuestions);
    expect(report.counts).toEqual({ questions: 48, coreTopics: 16, published: 0 });
    expect(report.byType["term-match"]).toEqual({ actual: 16, target: 56, gap: 40 });
    expect(report.byType.distinction.gap).toBe(48);
    expect(report.target).toBe(240);
    expect(report.minimumPublishedTarget).toBe(200);
    expect(report.gaps).toEqual({ toMinimumPublished: 200, toTargetTotal: 192 });
    expect(TARGET_QUOTAS.reduce((sum, item) => sum + item.target, 0)).toBe(240);
  });
});
