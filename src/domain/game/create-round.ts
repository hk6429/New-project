import type { BorrowedWordsQuestion } from "@/domain/questions/types";

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

  return [...eligible]
    .sort(() => random() - 0.5)
    .slice(0, Math.min(count, eligible.length));
}

