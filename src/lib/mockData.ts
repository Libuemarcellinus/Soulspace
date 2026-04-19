import type { ApiMood, ApiSoul, ApiCircle } from './api';
import React, { ComponentType } from 'react';
import { Brain, Heart, Moon, Sunrise, Compass, User, Ghost, Frown, Smile, Zap, Meh } from 'lucide-react';

// ── API-shaped fallback data ───────────────────────────────────────────────

export const mockMoods: ApiMood[] = [
  { id: 'mock-mood-001', mood: 'Anxious', mood_icon: '😰', status: 'active' },
  { id: 'mock-mood-002', mood: 'Hopeful', mood_icon: '🌟', status: 'active' },
  { id: 'mock-mood-003', mood: 'Overwhelmed', mood_icon: '😵', status: 'active' },
  { id: 'mock-mood-004', mood: 'Grateful', mood_icon: '🙏', status: 'active' },
  { id: 'mock-mood-005', mood: 'Lonely', mood_icon: '😔', status: 'active' },
  { id: 'mock-mood-006', mood: 'Just Existing', mood_icon: '😐', status: 'active' },
];

export const mockSouls: ApiSoul[] = [
  {
    id: 'mock-soul-001',
    soul: "Sometimes I feel like I'm screaming into a void, but knowing someone might hear me here makes it easier to breathe.",
    mood_id: 'mock-mood-001',
    mood: 'Anxious',
    mood_icon: '😰',
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    like_count: 47,
    reply_count: 12,
    expires_at: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-soul-002',
    soul: 'Today I smiled at a stranger and they smiled back. Small victories matter.',
    mood_id: 'mock-mood-002',
    mood: 'Hopeful',
    mood_icon: '🌟',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    like_count: 124,
    reply_count: 8,
    expires_at: new Date(Date.now() + 21 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-soul-003',
    soul: "The weight of everyone's expectations feels like carrying an ocean. I just need someone to know I'm trying my best.",
    mood_id: 'mock-mood-003',
    mood: 'Overwhelmed',
    mood_icon: '😵',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    like_count: 89,
    reply_count: 23,
    expires_at: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-soul-004',
    soul: 'Whoever posted about finding peace in small moments yesterday - thank you. I tried it and it helped.',
    mood_id: 'mock-mood-004',
    mood: 'Grateful',
    mood_icon: '🙏',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    like_count: 156,
    reply_count: 19,
    expires_at: new Date(Date.now() + 15 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-soul-005',
    soul: 'Is it possible to be surrounded by people and still feel invisible?',
    mood_id: 'mock-mood-005',
    mood: 'Lonely',
    mood_icon: '😔',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    like_count: 203,
    reply_count: 34,
    expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockCircleSouls: ApiSoul[] = [
  {
    id: 'mock-csoul-001',
    soul: 'Three weeks since they left. Some days I forget, and then I remember all over again.',
    mood_id: 'mock-mood-005',
    mood: 'Lonely',
    mood_icon: '😔',
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    like_count: 67,
    reply_count: 15,
    expires_at: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-csoul-002',
    soul: 'Started therapy today. First step toward loving myself again.',
    mood_id: 'mock-mood-002',
    mood: 'Hopeful',
    mood_icon: '🌟',
    created_at: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    like_count: 142,
    reply_count: 28,
    expires_at: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-csoul-003',
    soul: 'Deleted our photos. Kept the lessons. Moving forward, one day at a time.',
    mood_id: 'mock-mood-002',
    mood: 'Hopeful',
    mood_icon: '🌟',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    like_count: 198,
    reply_count: 41,
    expires_at: new Date(Date.now() + 19 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockCircles: ApiCircle[] = [
  { id: 'mock-circle-001', circle: 'Anxiety & Peace', icon: '🧠', status: 'active', member_count: 12400 },
  { id: 'mock-circle-002', circle: 'Heartbreak Haven', icon: '💔', status: 'active', member_count: 18200 },
  { id: 'mock-circle-003', circle: 'Night Thoughts', icon: '🌙', status: 'active', member_count: 9800 },
  { id: 'mock-circle-004', circle: 'New Beginnings', icon: '🌅', status: 'active', member_count: 15600 },
  { id: 'mock-circle-005', circle: 'Lost & Found', icon: '🧭', status: 'active', member_count: 11300 },
  { id: 'mock-circle-006', circle: 'Self-Discovery', icon: '✨', status: 'active', member_count: 14700 },
];

export const mockMoodAverage: Record<string, number> = {
  Hopeful: 32,
  Anxious: 24,
  Grateful: 18,
  Overwhelmed: 15,
  Lonely: 11,
};

// ── Mood helpers ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const moodIconMap: Record<string, ComponentType<any>> = {
  anxious: Frown,
  hopeful: Smile,
  overwhelmed: Zap,
  grateful: Heart,
  lonely: Meh,
  'just existing': Meh,
  happy: Smile,
  cool: Zap,
};

const moodColorMap: Record<string, string> = {
  anxious: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  hopeful: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  overwhelmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  grateful: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  lonely: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'just existing': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  happy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cool: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

const moodTextColorMap: Record<string, string> = {
  anxious: 'text-purple-400',
  hopeful: 'text-emerald-400',
  overwhelmed: 'text-blue-400',
  grateful: 'text-pink-400',
  lonely: 'text-indigo-400',
  'just existing': 'text-slate-400',
  happy: 'text-emerald-400',
  cool: 'text-cyan-400',
};

export function mapApiMood(m: ApiMood) {
  const key = m.mood.toLowerCase();
  return {
    id: m.mood_id ?? m.id ?? '',
    label: m.mood,
    icon: moodIconMap[key] ?? Meh,
    color: moodColorMap[key] ?? 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };
}

// ── Soul helpers ───────────────────────────────────────────────────────────

function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return 'just now';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatExpiresIn(expiresStr?: string): string {
  if (!expiresStr) return '24h';
  const diff = new Date(expiresStr).getTime() - Date.now();
  if (diff <= 0) return 'expired';
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours}h`;
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${mins}m`;
}

export function mapApiSoul(soul: ApiSoul) {
  const key = (soul.mood ?? '').toLowerCase();
  return {
    id: soul.soul_id ?? soul.id ?? '',
    mood: soul.mood ?? 'unknown',
    moodColor: moodTextColorMap[key] ?? 'text-slate-400',
    content: soul.soul,
    timestamp: formatTimeAgo(soul.created_at),
    empathy: soul.likes ?? soul.like_count ?? 0,
    replies: soul.reply_count ?? 0,
    expiresIn: formatExpiresIn(soul.expires_at),
  };
}

// ── Circle helpers ─────────────────────────────────────────────────────────

interface CircleStyle {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: ComponentType<any>;
  color: string;
  gradient: string;
  border: string;
  description: string;
}

const circleStyleMap: Record<string, CircleStyle> = {
  'Anxiety & Peace': {
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20',
    border: 'border-purple-500/30',
    description: 'Finding calm in the storm',
  },
  'Heartbreak Haven': {
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    description: 'Healing broken hearts together',
  },
  'Night Thoughts': {
    icon: Moon,
    color: 'from-indigo-500 to-blue-500',
    gradient: 'bg-gradient-to-br from-indigo-500/20 to-blue-500/20',
    border: 'border-indigo-500/30',
    description: '3 AM confessions',
  },
  'New Beginnings': {
    icon: Sunrise,
    color: 'from-emerald-500 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    description: 'Starting over, starting fresh',
  },
  'Lost & Found': {
    icon: Compass,
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    description: 'Finding your way',
  },
  'Self-Discovery': {
    icon: User,
    color: 'from-violet-500 to-purple-500',
    gradient: 'bg-gradient-to-br from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/30',
    description: 'Journey within',
  },
};

const defaultCircleStyles: CircleStyle[] = [
  { icon: Brain, color: 'from-purple-500 to-indigo-500', gradient: 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20', border: 'border-purple-500/30', description: '' },
  { icon: Heart, color: 'from-pink-500 to-rose-500', gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30', description: '' },
  { icon: Moon, color: 'from-indigo-500 to-blue-500', gradient: 'bg-gradient-to-br from-indigo-500/20 to-blue-500/20', border: 'border-indigo-500/30', description: '' },
  { icon: Sunrise, color: 'from-emerald-500 to-teal-500', gradient: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', description: '' },
  { icon: Compass, color: 'from-blue-500 to-cyan-500', gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', description: '' },
  { icon: Ghost, color: 'from-violet-500 to-purple-500', gradient: 'bg-gradient-to-br from-violet-500/20 to-purple-500/20', border: 'border-violet-500/30', description: '' },
];

function formatMemberCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

export function mapApiCircle(circle: ApiCircle, index: number) {
  const style = circleStyleMap[circle.circle] ?? defaultCircleStyles[index % defaultCircleStyles.length];
  const memberCount = circle.member_count ?? 0;

  // Server sends a Cloudinary image URL; wrap it as a renderable component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent: ComponentType<any> = circle.icon?.startsWith('http')
    ? ({ className }: { className?: string }) =>
        React.createElement('img', { src: circle.icon, alt: circle.circle, className: `rounded-full object-cover w-full h-full ${className ?? ''}` })
    : style.icon;

  return {
    id: circle.circle_id ?? circle.id ?? '',
    name: circle.circle,
    icon: IconComponent,
    color: style.color,
    gradient: style.gradient,
    border: style.border,
    description: style.description || circle.circle,
    members: memberCount > 0 ? formatMemberCount(memberCount) : '—',
    activeNow: Math.max(1, Math.floor(memberCount * 0.07)),
  };
}

// ── MoodPulse helpers ──────────────────────────────────────────────────────

const moodPulseColorMap: Record<string, { color: string; textColor: string }> = {
  hopeful: { color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  anxious: { color: 'bg-purple-500', textColor: 'text-purple-400' },
  grateful: { color: 'bg-pink-500', textColor: 'text-pink-400' },
  overwhelmed: { color: 'bg-blue-500', textColor: 'text-blue-400' },
  lonely: { color: 'bg-indigo-500', textColor: 'text-indigo-400' },
  happy: { color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  cool: { color: 'bg-cyan-500', textColor: 'text-cyan-400' },
};

export function mapMoodAverage(avg: Record<string, number>) {
  const total = Object.values(avg).reduce((s, v) => s + v, 0) || 1;
  return Object.entries(avg)
    .sort(([, a], [, b]) => b - a)
    .map(([mood, count]) => {
      const key = mood.toLowerCase();
      const colors = moodPulseColorMap[key] ?? { color: 'bg-slate-500', textColor: 'text-slate-400' };
      return {
        mood,
        percentage: Math.round((count / total) * 100),
        trend: 'same' as const,
        color: colors.color,
        textColor: colors.textColor,
      };
    });
}
