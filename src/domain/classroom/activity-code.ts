export function createActivityCode(random: () => number = Math.random): string {
  return String(100000 + Math.floor(random() * 900000));
}
