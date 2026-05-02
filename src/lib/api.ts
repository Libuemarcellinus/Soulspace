const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://soulspace-production.up.railway.app/api/';

function getToken(): string | null {
  return localStorage.getItem('soulspace_token');
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request<T>(path: string, options?: RequestInit, _retry = false): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { ...authHeaders(), ...(options?.headers as Record<string, string> | undefined) },
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw err;
  }
  clearTimeout(timer);

  // 401: attempt one silent token refresh, then give up
  if (res.status === 401 && !_retry && path !== 'auth/refresh' && path !== 'auth/login' && path !== 'auth/register') {
    const token = getToken();
    if (token) {
      try {
        const refreshRes = await fetch(`${API_BASE}auth/refresh`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if (refreshRes.ok) {
          const refreshText = await refreshRes.text();
          const refreshData = JSON.parse(refreshText);
          if (refreshData?.token) {
            localStorage.setItem('soulspace_token', refreshData.token);
            return request<T>(path, options, true);
          }
        }
      } catch { /* ignore refresh errors */ }
    }
    localStorage.removeItem('soulspace_token');
    window.dispatchEvent(new CustomEvent('soulspace:session-expired'));
    throw new Error('Session expired. Please log in again.');
  }

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

async function adminRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('soulspace_admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string> | undefined) },
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
  souls?: number;
  replies?: number;
  days_active?: number;
  streaks?: number;
  mood?: { mood: string; icon: string };
  settings?: { blur_preview?: boolean; push_notifications?: boolean };
  badges?: {
    kind_soul?: boolean;
    night_owl?: boolean;
    listener?: boolean;
    vulnerable?: boolean;
    circle_leader?: boolean;
    healer?: boolean;
  };
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

export interface ApiPromptResponse {
  id: string;
  prompt?: string;
  response: string;
  created_at?: string;
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
  likes?: number;
  like_count?: number;
  replies?: number;
  expires_at?: string;
}

export interface ApiCircle {
  id?: string;
  circle_id?: string;
  circle: string;
  icon: string;
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

export interface ApiNotification {
  id: string;
  type?: string;
  message: string;
  read: boolean;
  created_at: string;
  soul_id?: string;
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
  profile: () =>
    request<{ data?: ApiProfile } & ApiProfile>('auth/profile').then(r =>
      (r as any)?.data ?? r
    ),
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
  getAverage: () =>
    request<unknown>('moods/average').then(raw => {
      const arr = unwrapList<{ mood: string; percentage: number }>(raw, 'data');
      return Object.fromEntries(arr.map(item => [item.mood, item.percentage])) as Record<string, number>;
    }),
  getAverageHourly: () =>
    request<unknown>('moods/average_hourly').then(d =>
      unwrapList<{ hour: number; value: number }>(d, 'data', 'hourly')
    ),
};

// ── Notifications ──────────────────────────────────────────────────────────

export const notificationsApi = {
  getAll: () =>
    request<unknown>('auth/notifications').then(d =>
      unwrapList<ApiNotification>(d, 'notifications')
    ),
  markRead: (id: string) =>
    request<void>(`auth/read_notification?id=${id}`, { method: 'PATCH' }),
  delete: (id: string) =>
    request<void>(`auth/delete_notification?id=${id}`, { method: 'PATCH' }),
};

// ── Souls ──────────────────────────────────────────────────────────────────

export const soulsApi = {
  getActive: (page = 1, limit = 20) => {
    const qs = page > 1 ? `?page=${page}&limit=${limit}` : '';
    return request<unknown>(`souls/active${qs}`).then(d => unwrapList<ApiSoul>(d, 'souls'));
  },
  getPrivate: () =>
    request<unknown>('souls/private').then(d => unwrapList<ApiSoul>(d, 'souls')),
  getMySouls: () =>
    request<unknown>('souls/my_souls').then(d => unwrapList<ApiSoul>(d, 'souls')),
  getSoul: (id: string) =>
    request<ApiSoul>(`souls/soul?id=${id}`),
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
  getPrompt: () => request<ApiDailyPrompt>('auth/prompt'),
  submit: (prompt_id: string, response: string) =>
    request<void>(`auth/prompt?id=${prompt_id}`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    }),
  getResponses: () =>
    request<unknown>('auth/response').then(d => {
      if (Array.isArray(d)) return d as ApiPromptResponse[];
      const obj = d as Record<string, unknown>;
      if (typeof obj?.response === 'string') {
        return [{ id: 'daily-response', response: obj.response }] as ApiPromptResponse[];
      }
      return unwrapList<ApiPromptResponse>(d, 'responses', 'prompts', 'prompt_responses');
    }).catch(() => [] as ApiPromptResponse[]),
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

// ── Admin ──────────────────────────────────────────────────────────────────

export const adminApi = {
  login: (email: string, password: string) =>
    adminRequest<{ token: string }>('admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getAllSouls: () =>
    adminRequest<unknown>('admin/all').then(d => unwrapList(d, 'souls')),
  getReportedSouls: () =>
    adminRequest<unknown>('admin/reported').then(d => unwrapList(d, 'souls')),
  getRemovedSouls: () =>
    adminRequest<unknown>('admin/removed').then(d => unwrapList(d, 'souls')),
  removeSoul: (id: string) =>
    adminRequest<void>(`admin/remove?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ reason: 'Removed by admin' }),
    }),
  getAllCircles: () =>
    adminRequest<unknown>('admin/all_circles').then(d => unwrapList(d, 'circles')),
  createCircle: (circle: string, icon: string, description?: string) =>
    adminRequest<void>('admin/create_circle', {
      method: 'POST',
      body: JSON.stringify({ circle, icon, ...(description ? { description } : {}) }),
    }),
  setCircleStatus: (id: string, status: boolean) =>
    adminRequest<void>(`admin/circle_status?id=${id}&status=${status}`, { method: 'PATCH' }),
  getAllMoods: () =>
    adminRequest<unknown>('admin/all_moods').then(d => unwrapList(d, 'moods')),
  createMood: (mood: string, icon: string, color?: string) =>
    adminRequest<void>('admin/create_mood', {
      method: 'POST',
      body: JSON.stringify({ mood, icon, ...(color ? { color } : {}) }),
    }),
  setMoodStatus: (id: string, status: number) =>
    adminRequest<void>(`admin/mood_status?id=${id}&status=${status}`, { method: 'PATCH' }),
  getBlockedUsers: () =>
    adminRequest<unknown>('admin/all_blocked').then(d => unwrapList(d, 'users')),
  getDeletedSouls: () =>
    adminRequest<unknown>('admin/deleted').then(d => unwrapList(d, 'souls')),
  getInactiveSouls: () =>
    adminRequest<unknown>('admin/inactive').then(d => unwrapList(d, 'souls')),
  blockUser: (id: string) =>
    adminRequest<void>('admin/block', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),
  unblockUser: (id: string) =>
    adminRequest<void>('admin/unblock', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),
  getUser: (id: string) =>
    adminRequest<ApiProfile>(`admin/user?id=${id}`),
  getDailyPrompts: () =>
    adminRequest<unknown>('admin/daily_prompt').then(d => unwrapList(d, 'prompts', 'data')),
  createDailyPrompt: (prompt: string) =>
    adminRequest<void>('admin/daily_prompt', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }),
  editDailyPrompt: (id: string, prompt: string) =>
    adminRequest<void>(`admin/daily_prompt?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ prompt }),
    }),
  setDailyPromptStatus: (id: string, status: boolean) =>
    adminRequest<void>(`admin/daily_prompt?id=${id}&status=${status}`, { method: 'PATCH' }),
  deleteDailyPrompt: (id: string) =>
    adminRequest<void>(`admin/daily_prompt?id=${id}`, { method: 'DELETE' }),
};
