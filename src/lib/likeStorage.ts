const IDS_KEY = 'soulspace_liked_posts';
const COUNTS_KEY = 'soulspace_like_counts';
const VERSION_KEY = 'soulspace_like_version';
const CURRENT_VERSION = '2';

function getIds(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(IDS_KEY) ?? '[]')); }
  catch { return new Set(); }
}

function getCounts(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(COUNTS_KEY) ?? '{}'); }
  catch { return {}; }
}

// Remove liked IDs that have no stored count — these are from before count-storage was added
function migrate() {
  if (localStorage.getItem(VERSION_KEY) === CURRENT_VERSION) return;
  const counts = getCounts();
  const validIds = [...getIds()].filter(id => counts[id] !== undefined);
  localStorage.setItem(IDS_KEY, JSON.stringify(validIds));
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
}

migrate();

export function isLiked(id: string): boolean {
  return getIds().has(id);
}

export function getAllLiked(): Set<string> {
  return getIds();
}

// Call with the count AFTER liking (apiCount + 1)
export function persistLike(id: string, count: number) {
  const ids = getIds();
  ids.add(id);
  localStorage.setItem(IDS_KEY, JSON.stringify([...ids]));

  const counts = getCounts();
  counts[id] = count;
  localStorage.setItem(COUNTS_KEY, JSON.stringify(counts));
}

export function revertLike(id: string) {
  const ids = getIds();
  ids.delete(id);
  localStorage.setItem(IDS_KEY, JSON.stringify([...ids]));

  const counts = getCounts();
  delete counts[id];
  localStorage.setItem(COUNTS_KEY, JSON.stringify(counts));
}

// Returns the locally-stored count for a liked post, or null if not liked / not stored
export function getStoredCount(id: string): number | null {
  const counts = getCounts();
  return counts[id] ?? null;
}
