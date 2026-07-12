import type { Json } from "@/types/database";

export type ReviewSource = { title: string; url: string; citation: string };

export function parseQuestionOptions(value: Json): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function parseQuestionSource(value: Json | null): ReviewSource | null {
  if (!value || Array.isArray(value) || typeof value !== "object") return null;
  const title = typeof value.title === "string" ? value.title : "";
  const url = typeof value.url === "string" ? value.url : "";
  const citation = typeof value.citation === "string" ? value.citation : "";
  return title && url ? { title, url, citation } : null;
}
