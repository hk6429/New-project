export interface ReviewResult {
  questionId: string;
  correct: boolean;
  previousMistakes: number;
}

export interface ReviewItem {
  questionId: string;
  priority: number;
}

export function buildReviewQueue(results: ReviewResult[]): ReviewItem[] {
  return results
    .filter((result) => !result.correct)
    .map((result) => ({
      questionId: result.questionId,
      priority: result.previousMistakes + 1,
    }))
    .sort((a, b) => b.priority - a.priority);
}

