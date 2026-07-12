import { describe, expect, it } from "vitest";
import { scoreRound } from "./score-round";

describe("scoreRound", () => {
  it("依連續答對累積連擊獎勵，答錯後重置連擊", () => {
    const result = scoreRound([
      { correct: true },
      { correct: true },
      { correct: false },
      { correct: true },
    ]);

    expect(result).toEqual({
      score: 330,
      correctCount: 3,
      maxCombo: 2,
    });
  });
});

