import { pilotQuestions } from "../src/data/questions/pilot";

const rows = pilotQuestions.map((question) => ({
  id: question.id,
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
  source: question.source,
  status: question.status,
}));

process.stdout.write(JSON.stringify(rows));
