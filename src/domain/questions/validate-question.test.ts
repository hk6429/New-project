import { describe, expect, it } from "vitest";
import { validateQuestion } from "./validate-question";

describe("validateQuestion", () => {
  it("拒絕缺少來源與雙人複核的發布題", () => {
    const result = validateQuestion({
      id: "Q001",
      type: "term-match",
      grade: [7],
      difficulty: "basic",
      prompt: "杜康",
      options: ["酒", "音樂", "平民", "書信"],
      correctAnswers: ["酒"],
      metonym: "杜康",
      referent: "酒",
      relation: "人物或專名代相關事物",
      rationale: "杜康相傳善於造酒，後世以其名代稱酒。",
      context: "何以解憂？唯有杜康。",
      source: null,
      reviewers: [],
      status: "published",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toEqual(
        expect.arrayContaining(["發布題必須有可追溯來源", "發布題必須有至少兩名複核者"]),
      );
    }
  });

  it("拒絕具有多重正解或重複選項的題目", () => {
    const result = validateQuestion({
      id: "Q002",
      type: "term-match",
      grade: [7, 8, 9],
      difficulty: "basic",
      prompt: "絲竹",
      options: ["音樂", "音樂", "書信", "平民"],
      correctAnswers: ["音樂", "樂器演奏"],
      metonym: "絲竹",
      referent: "音樂",
      relation: "器物或材料代活動",
      rationale: "絲、竹製成的樂器代稱音樂。",
      context: "無絲竹之亂耳。",
      source: null,
      reviewers: [],
      status: "draft",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toEqual(
        expect.arrayContaining(["每題只能有一個正解", "選項不得重複"]),
      );
    }
  });

  it("拒絕缺少解析或使用無效難度的資料", () => {
    const result = validateQuestion({
      id: "Q003",
      type: "distinction",
      grade: [8],
      difficulty: "超難",
      prompt: "判斷下列修辭",
      options: ["借代", "借喻"],
      correctAnswers: ["借代"],
      metonym: "杜康",
      referent: "酒",
      relation: "人物與相關事物",
      rationale: "",
      context: "何以解憂？唯有杜康。",
      source: null,
      reviewers: [],
      status: "draft",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toEqual(
        expect.arrayContaining(["題目難度無效", "題目必須有完整解析"]),
      );
    }
  });
});

describe("題庫內容品質規則", () => {
  const valid = {
    id: "T1", coreTopicId: "topic-1", type: "context-match", grade: [7], difficulty: "basic",
    prompt: "句中的杜康指什麼？", options: ["酒", "茶"], correctAnswers: ["酒"], metonym: "杜康",
    referent: "酒", relation: "人物代事物", rationale: "杜康善釀酒。", context: "何以解憂？唯有杜康。",
    clues: ["語境提到解憂"], distractorRationales: { 茶: "同為飲品，但無人物典故。" },
    source: { title: "教育部辭典", url: "https://example.com", citation: "借代條目，杜康例" },
    license: "public-domain", creator: "編題者", checkers: ["查核者"], disputeNote: null,
    statistics: { attempts: 0, correct: 0, optionCounts: {} }, version: 1, createdAt: "2026-07-12", updatedAt: "2026-07-12",
    reviewers: [], status: "pending-review",
  } as const;

  it("拒絕正解不在選項與缺少干擾項理由", () => {
    const result = validateQuestion({ ...valid, correctAnswers: ["咖啡"], distractorRationales: {} });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors).toEqual(expect.arrayContaining(["正解必須存在於選項中", "每個錯誤選項都必須有設計理由"]));
  });
});
