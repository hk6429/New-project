import { describe, expect, it } from "vitest";
import { buildReviewQueue } from "./review-queue";

describe("buildReviewQueue", () => {
  it("只把答錯題排入復習，並依錯誤次數縮短優先順序", () => {
    const queue = buildReviewQueue([
      { questionId: "Q001", correct: true, previousMistakes: 0 },
      { questionId: "Q002", correct: false, previousMistakes: 0 },
      { questionId: "Q003", correct: false, previousMistakes: 2 },
    ]);

    expect(queue).toEqual([
      { questionId: "Q003", priority: 3 },
      { questionId: "Q002", priority: 1 },
    ]);
  });
});

