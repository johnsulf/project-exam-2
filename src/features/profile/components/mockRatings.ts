const LOCAL_RATINGS_KEY = "holidaze:mockRatings";

export type LocalRatingStore = Record<string, Record<string, number>>;

export function readStoredMockRatings(
  userName: string,
): Record<string, number> {
  if (typeof window === "undefined" || !userName) return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_RATINGS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as LocalRatingStore;
    return parsed?.[userName] ?? {};
  } catch {
    return {};
  }
}

export function persistMockRating(
  userName: string,
  ratings: Record<string, number>,
): void {
  if (typeof window === "undefined" || !userName) return;
  try {
    const raw = window.localStorage.getItem(LOCAL_RATINGS_KEY);
    const parsed: LocalRatingStore = raw ? JSON.parse(raw) : {};
    parsed[userName] = ratings;
    window.localStorage.setItem(LOCAL_RATINGS_KEY, JSON.stringify(parsed));
  } catch {
    // ignore write errors
  }
}
