import { beforeEach, describe, expect, it } from "vitest";
import { loadProgress, recordAchievement, saveProgress } from "./progress-store";

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

  it("記錄個人最佳、徽章與已破解卡牌且不重複收藏", () => {
    saveProgress({ completedZones: [], experience: 0, mistakeIds: [] });
    const first = recordAchievement(loadProgress(), { zoneId: "context-match", score: 500, cardIds: ["Q1", "Q1"], badge: "語境偵探" });
    const second = recordAchievement(first, { zoneId: "context-match", score: 300, cardIds: ["Q2"], badge: "語境偵探" });
    expect(second.personalBests).toEqual({ "context-match": 500 });
    expect(second.badges).toEqual(["語境偵探"]);
    expect(second.solvedCardIds).toEqual(["Q1", "Q2"]);
  });

  it("記錄個人最佳、徽章與已破解卡牌且不重複收藏", () => {
    const first = recordAchievement(loadProgress(), { zoneId: "context-match", score: 500, cardIds: ["Q1", "Q1"], badge: "語境偵探" });
    const second = recordAchievement(first, { zoneId: "context-match", score: 300, cardIds: ["Q2"], badge: "語境偵探" });
    expect(second.personalBests).toEqual({ "context-match": 500 });
    expect(second.badges).toEqual(["語境偵探"]);
    expect(second.solvedCardIds).toEqual(["Q1", "Q2"]);
  });
});
