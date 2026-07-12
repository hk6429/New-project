import { z } from "zod";

const sourceSchema = z.object({
  title: z.string().min(1),
  author: z.string().optional(),
  url: z.string().url().optional(),
  citation: z.string().min(1),
});

export const questionSchema = z.object({
  id: z.string().min(1),
  coreTopicId: z.string().min(1).default("unassigned"),
  type: z.enum(["term-match", "context-match", "relation", "distinction", "translation", "application"]),
  grade: z.array(z.union([z.literal(7), z.literal(8), z.literal(9)])).min(1),
  difficulty: z.enum(["basic", "intermediate", "advanced"]),
  prompt: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctAnswers: z.array(z.string().min(1)).min(1),
  metonym: z.string().min(1),
  referent: z.string().min(1),
  relation: z.string().min(1),
  rationale: z.string().min(1),
  context: z.string().min(1),
  clues: z.array(z.string().min(1)).default([]),
  distractorRationales: z.record(z.string(), z.string().min(1)).default({}),
  source: sourceSchema.nullable(),
  license: z.string().min(1).default("unverified"),
  creator: z.string().min(1).default("unknown"),
  checkers: z.array(z.string().min(1)).default([]),
  disputeNote: z.string().min(1).nullable().default(null),
  statistics: z.object({
    attempts: z.number().int().nonnegative(),
    correct: z.number().int().nonnegative(),
    optionCounts: z.record(z.string(), z.number().int().nonnegative()),
  }).default({ attempts: 0, correct: 0, optionCounts: {} }),
  version: z.number().int().positive().default(1),
  createdAt: z.iso.date().default("2026-07-12"),
  updatedAt: z.iso.date().default("2026-07-12"),
  reviewers: z.array(z.string().min(1)),
  status: z.enum(["draft", "pending-review", "verified", "published", "disputed", "disabled"]),
});
