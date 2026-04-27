const API_BASE = '/api/';

function getToken(): string | null {
  return localStorage.getItem('soulspace_token');
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options?.headers as Record<string, string> | undefined) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  try { return JSON.parse(text) as T; }
  catch { return undefined as T; }
}

// Unwraps bare arrays OR common server wrapper shapes like { data:[...] }, { souls:[...] }, etc.
function unwrapList<T>(data: unknown, ...keys: string[]): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    for (const key of ['data', 'items', 'results', ...keys]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
  }
  return [];
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  data: {
    username: string;
    user_id: string;
  };
}

export interface ApiProfile {
  username?: string;
  user_id?: string;
  mood?: string;
  mood_icon?: string;
  blur_preview?: boolean;
  push_notifications?: boolean;
  badges?: ApiBadge[];
  souls_count?: number;
  replies_count?: number;
  days_active?: number;
}

export interface ApiBadge {
  id?: string;
  name: string;
  icon: string;
  description?: string;
  earned?: boolean;
}

export interface ApiReply {
  id: string;
  reply: string;
  mood?: string;
  mood_icon?: string;
  created_at?: string;
  like_count?: number;
}

export interface ApiDailyPrompt {
  id: string;
  prompt: string;
}

export interface ApiMood {
  id?: string;
  mood_id?: string;
  mood: string;
  mood_icon?: string;
  status?: string;
}

export interface ApiSoul {
  id?: string;
  soul_id?: string;
  soul: string;
  mood_id?: string;
  mood?: string;
  mood_icon?: string;
  created_at?: string;
  likes?: number;      // actual server field
  like_count?: number; // kept for mock data compatibility
  reply_count?: number;
  expires_at?: string;
}

export interface ApiCircle {
  id?: string;
  circle_id?: string;
  circle: string;
  icon: string;        // Cloudinary URL from server
  status?: string;
  member_count?: number;
}

export interface ApiBlockedUser {
  id?: string;
  user_id?: string;
  username?: string;
  reason?: string;
  created_at?: string;
}

// ── Auth ───────────────────────────────────────────────────────────────────

export const authApi = {
  register: (username: string, password: string) =>
    request<AuthResponse>('auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  login: (username: string, password: string, fcm?: string) =>
    request<AuthResponse>('auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, ...(fcm ? { fcm } : {}) }),
    }),
  logout: () => request<void>('auth/logout', { method: 'POST' }),
  profile: () => request<ApiProfile>('auth/profile'),
  refresh: () => request<AuthResponse>('auth/refresh'),
  updateSettings: (settings: { blur_preview?: boolean; push_notifications?: boolean }) =>
    request<void>('auth/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    }),
  updateMood: (mood_id: string) =>
    request<void>('auth/mood', {
      method: 'PATCH',
      body: JSON.stringify({ mood_id }),
    }),
  blockUser: (id: string, reason: string) =>
    request<void>('auth/block_user', {
      method: 'POST',
      body: JSON.stringify({ id, reason }),
    }),
  unblockUser: (id: string, reason: string) =>
    request<void>('auth/unblock_user', {
      method: 'POST',
      body: JSON.stringify({ id, reason }),
    }),
  blockedUsers: () =>
    request<unknown>('auth/blocked_users').then(d =>
      unwrapList<ApiBlockedUser>(d, 'users', 'blocked')
    ),
};

// ── Moods ──────────────────────────────────────────────────────────────────

export const moodsApi = {
  getActive: () =>
    request<unknown>('moods/active').then(d => unwrapList<ApiMood>(d, 'moods')),
};

// ── Souls ──────────────────────────────────────────────────────────────────

export const soulsApi = {
  getActive: (page = 1, limit = 20) => {
    // Only add pagination params when fetching beyond the first page.
    // The server accepts souls/active without params for the default feed.
    const qs = page > 1 ? `?page=${page}&limit=${limit}` : '';
    return request<unknown>(`souls/active${qs}`).then(d => unwrapList<ApiSoul>(d, 'souls'));
  },
  getPrivate: () =>
    request<unknown>('souls/private').then(d => unwrapList<ApiSoul>(d, 'souls')),
  getMySouls: () =>
    request<unknown>('souls/my_souls').then(d => unwrapList<ApiSoul>(d, 'souls')),
  getSoul: (id: string) =>
    request<ApiSoul>(`souls/soul?id=${id}`),
  getAverage: () =>
    request<unknown>('souls/average').then(raw => {
      const arr = unwrapList<{ mood: string; percentage: number }>(raw, 'data');
      return Object.fromEntries(arr.map(item => [item.mood, item.percentage])) as Record<string, number>;
    }),
  create: (soul: string, mood_id: string) =>
    request<ApiSoul>('souls/create', {
      method: 'POST',
      body: JSON.stringify({ soul, mood_id }),
    }),
  createCircleSoul: (soul: string, circle_id: string) =>
    request<ApiSoul>('souls/circle_soul', {
      method: 'POST',
      body: JSON.stringify({ soul, circle_id }),
    }),
  getCircleSouls: (id: string) =>
    request<unknown>(`souls/circle_soul?id=${id}`).then(d => unwrapList<ApiSoul>(d, 'souls')),
  like: (id: string) =>
    request<{ message?: string }>(`souls/like?id=${id}`, { method: 'POST' }),
  report: (id: string, reason: string) =>
    request<void>(`souls/report?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  deleteSoul: (id: string) =>
    request<void>(`souls/delete?id=${id}`, { method: 'DELETE' }),
  getReplies: (id: string) =>
    request<unknown>(`souls/replies?id=${id}`).then(d => unwrapList<ApiReply>(d, 'replies')),
  // Endpoint is souls/reply (POST), body is { reply } only — no mood_id
  createReply: (id: string, reply: string) =>
    request<ApiReply>(`souls/reply?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ reply }),
    }),
  editReply: (id: string, reply: string) =>
    request<void>(`souls/edit_reply?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ reply }),
    }),
  deleteReply: (id: string) =>
    request<void>(`souls/delete_reply?id=${id}`, { method: 'DELETE' }),
  likeReply: (id: string) =>
    request<{ message?: string }>(`souls/like_reply?id=${id}`, { method: 'POST' }),
};

// ── Daily ──────────────────────────────────────────────────────────────────

export const dailyApi = {
  getPrompt: () => request<ApiDailyPrompt>('daily/prompt'),
  submit: (prompt_id: string, content: string, visibility: 'private' | 'public') =>
    request<void>('daily/submit', {
      method: 'POST',
      body: JSON.stringify({ prompt_id, content, visibility }),
    }),
};

// ── Circles ────────────────────────────────────────────────────────────────

export const circlesApi = {
  getActive: () =>
    request<unknown>('circles/active').then(d => unwrapList<ApiCircle>(d, 'circles')),
  getCircle: (circle_id: string) =>
    request<ApiCircle>(`circles/circle?circle_id=${circle_id}`),
  join: (circle_id: string) =>
    request<void>(`circles/join?circle_id=${circle_id}`, { method: 'POST' }),
  leave: (circle_id: string) =>
    request<void>(`circles/leave?circle_id=${circle_id}`, { method: 'POST' }),
  myCircles: () =>
    request<unknown>('circles/my_circles').then(d => unwrapList<ApiCircle>(d, 'circles')),
};
