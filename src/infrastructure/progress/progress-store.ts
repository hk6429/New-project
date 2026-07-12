export interface StudentProgress {
  completedZones: string[];
  experience: number;
  mistakeIds: string[];
}

const KEY = "borrowed-words-progress-v1";
const EMPTY_PROGRESS: StudentProgress = { completedZones: [], experience: 0, mistakeIds: [] };

export function saveProgress(progress: StudentProgress): void {
  localStorage.setItem(KEY, JSON.stringify(progress));
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

