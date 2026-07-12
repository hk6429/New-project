import { describe, expect, it } from "vitest";
import { completionIdForQuestionType } from "./zone-progress";

describe("completionIdForQuestionType", () => {
  it("不同題型寫入不同關卡完成 ID", () => {
    expect(completionIdForQuestionType("term-match")).toBe("term-match");
    expect(completionIdForQuestionType("context-match")).toBe("context-match");
    expect(completionIdForQuestionType("relation")).toBe("relation");
  });
});
