const API_BASE = import.meta.env.DEV
  ? '/api/'
  : (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    'https://soulspace-ye8o.onrender.com/api/';

function getToken(): string | null {
  return localStorage.getItem('soulspace_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
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
  return res.json() as Promise<T>;
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  username: string;
  id: number;
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
  id: string;        // UUID
  mood: string;
  mood_icon: string;
  status: string;
}

export interface ApiSoul {
  id: string;        // UUID
  soul: string;
  mood_id: string;   // UUID
  mood?: string;
  mood_icon?: string;
  created_at?: string;
  like_count?: number;
  reply_count?: number;
  expires_at?: string;
}

export interface ApiCircle {
  id: string;        // UUID
  circle: string;
  icon: string;
  status: string;
  member_count: number;
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
  getActive: () => request<ApiMood[]>('moods/active'),
};

// ── Souls ──────────────────────────────────────────────────────────────────

export const soulsApi = {
  getActive: () => request<ApiSoul[]>('souls/active'),
  getPrivate: () => request<ApiSoul[]>('souls/private'),
  getAverage: () => request<Record<string, number>>('souls/average'),
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
  getCircleSouls: (id: string) => request<ApiSoul[]>(`souls/circle_soul?id=${id}`),
  like: (id: string) =>
    request<void>(`souls/like?id=${id}`, { method: 'POST' }),
  report: (id: string, reason: string) =>
    request<void>(`souls/report?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  getReplies: (id: string) => request<ApiReply[]>(`souls/replies?id=${id}`),
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
  getActive: () => request<ApiCircle[]>('circles/active'),
  join: (circle_id: string) =>
    request<void>(`circles/join?circle_id=${circle_id}`, { method: 'POST' }),
  leave: (circle_id: string) =>
    request<void>(`circles/leave?circle_id=${circle_id}`, { method: 'POST' }),
  myCircles: () => request<ApiCircle[]>('circles/my_circles'),
};
