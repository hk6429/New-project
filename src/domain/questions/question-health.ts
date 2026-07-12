import type { BorrowedWordsQuestion } from "./types";

export const TARGET_QUOTAS: Array<{ type: BorrowedWordsQuestion["type"]; target: number }> = [
  { type: "term-match", target: 56 },
  { type: "context-match", target: 56 },
  { type: "relation", target: 40 },
  { type: "distinction", target: 48 },
  { type: "translation", target: 24 },
  { type: "application", target: 16 },
];

export function buildQuestionHealthReport(questions: BorrowedWordsQuestion[]) {
  const byType = Object.fromEntries(TARGET_QUOTAS.map(({ type, target }) => {
    const actual = questions.filter((question) => question.type === type).length;
    return [type, { actual, target, gap: Math.max(0, target - actual) }];
  })) as Record<BorrowedWordsQuestion["type"], { actual: number; target: number; gap: number }>;
  return {
    target: TARGET_QUOTAS.reduce((sum, quota) => sum + quota.target, 0),
    minimumPublishedTarget: 200,
    counts: {
      questions: questions.length,
      coreTopics: new Set(questions.map((question) => question.coreTopicId)).size,
      published: questions.filter((question) => question.status === "published").length,
    },
    byType,
    gaps: {
      toMinimumPublished: Math.max(0, 200 - questions.filter((question) => question.status === "published").length),
      toTargetTotal: Math.max(0, 240 - questions.length),
    },
    similarityWarnings: findSimilarityWarnings(questions),
  };
}

function normalize(value: string): string {
  return value.replace(/[\s，。！？、；：「」『』（）]/g, "").toLowerCase();
}

function findSimilarityWarnings(questions: BorrowedWordsQuestion[]): Array<{ ids: string[]; reason: string }> {
  const groups = new Map<string, string[]>();
  for (const question of questions) {
    const key = `${question.type}:${normalize(question.prompt)}`;
    groups.set(key, [...(groups.get(key) ?? []), question.id]);
  }
  return [...groups.values()]
    .filter((ids) => ids.length > 1)
    .map((ids) => ({ ids, reason: "同題型題幹正規化後相同，請檢查重複或近似換皮題" }));
}
