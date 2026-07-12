import type { BorrowedWordsQuestion } from "../questions/types";

export function completionIdForQuestionType(type: BorrowedWordsQuestion["type"]): string {
  return type;
}
