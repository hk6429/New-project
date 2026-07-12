import { questionBank } from "../src/data/questions";
import { buildQuestionHealthReport } from "../src/domain/questions/question-health";

const rows = questionBank.map((question) => ({
  id: question.id,
  core_topic_id: question.coreTopicId,
  type: question.type,
  grade: question.grade,
  difficulty: question.difficulty,
  prompt: question.prompt,
  options: question.options,
  correct_answers: question.correctAnswers,
  metonym: question.metonym,
  referent: question.referent,
  relation: question.relation,
  rationale: question.rationale,
  context: question.context,
  clues: question.clues,
  distractor_rationales: question.distractorRationales,
  source: question.source,
  license: question.license,
  creator: question.creator,
  checkers: question.checkers,
  dispute_note: question.disputeNote,
  statistics: question.statistics,
  version: question.version,
  created_at: question.createdAt,
  updated_at: question.updatedAt,
  reviewers: question.reviewers,
  status: question.status,
}));

const health = buildQuestionHealthReport(questionBank);
process.stdout.write(JSON.stringify({ health, questions: rows }, null, 2));
