const STORAGE_KEY = 'math-sprint-leaderboard-v1';

export function loadLeaderboard() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveLeaderboard(entries) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function addScoreEntry(entry) {
  const current = loadLeaderboard();
  const merged = [...current, entry];

  merged.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.accuracy - a.accuracy;
  });

  const trimmed = merged.slice(0, 10);
  saveLeaderboard(trimmed);
  return trimmed;
}

export function isHighScore(score) {
  if (score <= 0) return false;
  const current = loadLeaderboard();
  if (current.length < 10) return true;
  const minScore = current[current.length - 1]?.score ?? 0;
  return score > minScore;
}
