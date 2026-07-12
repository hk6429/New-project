import { describe, expect, it } from "vitest";
import type { BorrowedWordsQuestion } from "@/domain/questions/types";
import { createRound } from "./create-round";

const baseQuestion: BorrowedWordsQuestion = {
  id: "Q001",
  type: "term-match",
  grade: [7, 8, 9],
  difficulty: "basic",
  prompt: "杜康",
  options: ["酒", "音樂", "平民", "書信"],
  correctAnswers: ["酒"],
  metonym: "杜康",
  referent: "酒",
  relation: "人物或專名代相關事物",
  rationale: "杜康相傳善於造酒，後世以其名代稱酒。",
  context: "何以解憂？唯有杜康。",
  source: { title: "短歌行", author: "曹操", citation: "何以解憂？唯有杜康。" },
  reviewers: [],
  status: "pending-review",
};

describe("createRound", () => {
  it("只從可試行題目中建立不重複的回合", () => {
    const questions: BorrowedWordsQuestion[] = [
      baseQuestion,
      { ...baseQuestion, id: "Q002", prompt: "絲竹", referent: "音樂", status: "disputed" },
      { ...baseQuestion, id: "Q003", prompt: "布衣", referent: "平民" },
    ];

    const round = createRound(questions, { count: 2, random: () => 0.25 });

    expect(round.map((question) => question.id).sort()).toEqual(["Q001", "Q003"]);
  });
});

