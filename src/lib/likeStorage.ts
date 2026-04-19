const IDS_KEY = 'soulspace_liked_posts';
const COUNTS_KEY = 'soulspace_like_counts'; // legacy — removed in v3
const VERSION_KEY = 'soulspace_like_version';
const CURRENT_VERSION = '3';

function getIds(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(IDS_KEY) ?? '[]')); }
  catch { return new Set(); }
}

function migrate() {
  if (localStorage.getItem(VERSION_KEY) === CURRENT_VERSION) return;
  localStorage.removeItem(COUNTS_KEY); // clean up v2 count cache
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
}

migrate();

export function isLiked(id: string): boolean {
  return getIds().has(id);
}

export function getAllLiked(): Set<string> {
  return getIds();
}

export function persistLike(id: string) {
  const ids = getIds();
  ids.add(id);
  localStorage.setItem(IDS_KEY, JSON.stringify([...ids]));
}

export function revertLike(id: string) {
  const ids = getIds();
  ids.delete(id);
  localStorage.setItem(IDS_KEY, JSON.stringify([...ids]));
}

export function clearAllLikes() {
  localStorage.removeItem(IDS_KEY);
  localStorage.removeItem(COUNTS_KEY);
  localStorage.removeItem(VERSION_KEY);
}
