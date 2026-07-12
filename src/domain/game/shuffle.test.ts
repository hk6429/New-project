import { describe, expect, it } from "vitest";
import { shuffle } from "./shuffle";

describe("shuffle", () => {
  it("使用可注入亂數的 Fisher-Yates 且不修改輸入", () => {
    const input = [1, 2, 3, 4];
    expect(shuffle(input, () => 0)).toEqual([2, 3, 4, 1]);
    expect(input).toEqual([1, 2, 3, 4]);
  });
});
