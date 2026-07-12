export function normalizeActivityCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

export function normalizeNickname(value: string): string {
  return value.trim().replace(/\s+/g, " ").slice(0, 16);
}
