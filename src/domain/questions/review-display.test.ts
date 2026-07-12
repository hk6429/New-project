import { describe, expect, it } from "vitest";
import { parseQuestionOptions, parseQuestionSource } from "./review-display";

describe("question review display", () => {
  it("只接受文字選項", () => {
    expect(parseQuestionOptions(["酒", 3, "音樂", null])).toEqual(["酒", "音樂"]);
    expect(parseQuestionOptions("酒")).toEqual([]);
  });

  it("安全解析來源欄位", () => {
    expect(parseQuestionSource({ title: "教育部辭典", url: "https://example.com", citation: "借代定義" })).toEqual({
      title: "教育部辭典",
      url: "https://example.com",
      citation: "借代定義",
    });
    expect(parseQuestionSource(null)).toBeNull();
  });
});
