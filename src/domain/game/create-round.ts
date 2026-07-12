import type { BorrowedWordsQuestion } from "@/domain/questions/types";
import { shuffle } from "./shuffle";

interface RoundOptions {
  count: number;
  random?: () => number;
}

export function createRound(
  questions: BorrowedWordsQuestion[],
  { count, random = Math.random }: RoundOptions,
): BorrowedWordsQuestion[] {
  const eligible = questions.filter(
    (question) => question.status !== "disputed" && question.status !== "disabled",
  );

  return shuffle(eligible, random).slice(0, Math.min(count, eligible.length));
}
