export interface StudentProgress {
  completedZones: string[];
  experience: number;
  mistakeIds: string[];
  personalBests?: Record<string, number>;
  badges?: string[];
  solvedCardIds?: string[];
}

export interface AchievementInput { zoneId: string; score: number; cardIds: string[]; badge: string }

const KEY = "borrowed-words-progress-v1";
const EMPTY_PROGRESS: StudentProgress = { completedZones: [], experience: 0, mistakeIds: [] };

export function saveProgress(progress: StudentProgress): void {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function recordAchievement(progress: StudentProgress, input: AchievementInput): StudentProgress {
  return { ...progress,
    personalBests: { ...progress.personalBests, [input.zoneId]: Math.max(progress.personalBests?.[input.zoneId] ?? 0, input.score) },
    badges: Array.from(new Set([...(progress.badges ?? []), input.badge])),
    solvedCardIds: Array.from(new Set([...(progress.solvedCardIds ?? []), ...input.cardIds])),
  };
}

export function loadProgress(): StudentProgress {
  const stored = localStorage.getItem(KEY);
  if (!stored) return EMPTY_PROGRESS;
  try {
    const parsed = JSON.parse(stored) as StudentProgress;
    if (!Array.isArray(parsed.completedZones) || !Array.isArray(parsed.mistakeIds)) return EMPTY_PROGRESS;
    return parsed;
  } catch {
    return EMPTY_PROGRESS;
  }
}
