import { beforeEach, describe, expect, it } from "vitest";
import { loadProgress, saveProgress } from "./progress-store";

describe("progress-store", () => {
  beforeEach(() => localStorage.clear());

  it("保存並讀回學生的完成關卡、經驗值與錯題", () => {
    saveProgress({ completedZones: ["term-match"], experience: 360, mistakeIds: ["Q003-C"] });

    expect(loadProgress()).toEqual({
      completedZones: ["term-match"],
      experience: 360,
      mistakeIds: ["Q003-C"],
    });
  });
});

