import { z } from "zod";

const sourceSchema = z.object({
  title: z.string().min(1),
  author: z.string().optional(),
  url: z.string().url().optional(),
  citation: z.string().min(1),
});

export const questionSchema = z.object({
  id: z.string().min(1),
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
  source: sourceSchema.nullable(),
  reviewers: z.array(z.string().min(1)),
  status: z.enum(["draft", "pending-review", "verified", "published", "disputed", "disabled"]),
});

