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
  catch { return undefined as T; } // non-JSON body (plain text "OK" etc.) — treat as success
}

// Unwraps bare arrays OR common server wrapper shapes like { data:[...] }, { moods:[...] }, etc.
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
  soul_id?: string;   // server may use this as the primary key
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

// ── Auth ───────────────────────────────────────────────────────────────────

export const authApi = {
  register: (username: string, password: string) =>
    request<AuthResponse>('auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  login: (username: string, password: string) =>
    request<AuthResponse>('auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  profile: () => request<AuthResponse>('auth/profile'),
};

// ── Moods ──────────────────────────────────────────────────────────────────

export const moodsApi = {
  getActive: () =>
    request<unknown>('moods/active').then(d => unwrapList<ApiMood>(d, 'moods')),
};

// ── Souls ──────────────────────────────────────────────────────────────────

export const soulsApi = {
  getActive: () =>
    request<unknown>('souls/active').then(d => unwrapList<ApiSoul>(d, 'souls')),
  getPrivate: () =>
    request<unknown>('souls/private').then(d => unwrapList<ApiSoul>(d, 'souls')),
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
    request<void>(`souls/like?id=${id}`, { method: 'POST' }),
  report: (id: string, reason: string) =>
    request<void>(`souls/report?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  getReplies: (id: string) =>
    request<unknown>(`souls/replies?id=${id}`).then(d => unwrapList<ApiReply>(d, 'replies')),
  createReply: (id: string, reply: string, mood_id: string) =>
    request<ApiReply>(`souls/replies?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ reply, mood_id }),
    }),
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
  join: (circle_id: string) =>
    request<void>(`circles/join?circle_id=${circle_id}`, { method: 'POST' }),
  leave: (circle_id: string) =>
    request<void>(`circles/leave?circle_id=${circle_id}`, { method: 'POST' }),
  myCircles: () =>
    request<unknown>('circles/my_circles').then(d => unwrapList<ApiCircle>(d, 'circles')),
};
