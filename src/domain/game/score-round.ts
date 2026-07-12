export interface AnswerResult {
  correct: boolean;
}

export interface RoundScore {
  score: number;
  correctCount: number;
  maxCombo: number;
}

export function scoreRound(answers: AnswerResult[]): RoundScore {
  let score = 0;
  let combo = 0;
  let maxCombo = 0;
  let correctCount = 0;

  for (const answer of answers) {
    if (!answer.correct) {
      combo = 0;
      continue;
    }
    combo += 1;
    correctCount += 1;
    maxCombo = Math.max(maxCombo, combo);
    score += 100 + (combo - 1) * 30;
  }

  return { score, correctCount, maxCombo };
}

