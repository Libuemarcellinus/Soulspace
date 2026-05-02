import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, AlertCircle, Trash2, Circle, Smile, UserX } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../components/ui/skeleton';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://soulspace-production.up.railway.app/api/';

function adminRequest(path: string) {
  const token = localStorage.getItem('soulspace_admin_token');
  return fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const MOOD_COLORS: Record<string, string> = {
  calm: '#06b6d4', hopeful: '#10b981', reflective: '#8b5cf6',
  joyful: '#ec4899', anxious: '#f59e0b', sad: '#6b7280',
  grateful: '#f43f5e', overwhelmed: '#3b82f6', lonely: '#6366f1',
  other: '#8b5cf6',
};

function getMoodColor(name: string) {
  return MOOD_COLORS[(name || '').toLowerCase()] || MOOD_COLORS.other;
}

const STAT_CONFIG = [
  { key: 'totalSouls',    label: 'Total Souls',    icon: MessageSquare, grad: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
  { key: 'reported',      label: 'Reported Souls', icon: AlertCircle,   grad: 'linear-gradient(135deg, #f59e0b, #f97316)' },
  { key: 'removed',       label: 'Removed Souls',  icon: Trash2,        grad: 'linear-gradient(135deg, #ef4444, #ec4899)' },
  { key: 'totalCircles',  label: 'Total Circles',  icon: Circle,        grad: 'linear-gradient(135deg, #8b5cf6, #6366f1)' },
  { key: 'totalMoods',    label: 'Total Moods',    icon: Smile,         grad: 'linear-gradient(135deg, #10b981, #14b8a6)' },
  { key: 'blockedUsers',  label: 'Blocked Users',  icon: UserX,         grad: 'linear-gradient(135deg, #f43f5e, #ef4444)' },
];

interface Soul {
  id: string;
  soul: string;
  mood?: { mood?: string };
  created_at: string;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSouls: 0, reported: 0, removed: 0,
    totalCircles: 0, totalMoods: 0, blockedUsers: 0,
  });
  const [chartData, setChartData] = useState<{ mood: string; count: number }[]>([]);
  const [recentSouls, setRecentSouls] = useState<Soul[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [soulsRes, reportedRes, removedRes, circlesRes, moodsRes, blockedRes] =
          await Promise.allSettled([
            adminRequest('admin/all'),
            adminRequest('admin/reported'),
            adminRequest('admin/removed'),
            adminRequest('admin/all_circles'),
            adminRequest('admin/all_moods'),
            adminRequest('admin/all_blocked'),
          ]);

        let allSouls: Soul[] = [];

        if (soulsRes.status === 'fulfilled' && soulsRes.value.ok) {
          const d = await soulsRes.value.json();
          allSouls = Array.isArray(d) ? d : d.data || d.souls || [];
          setStats(prev => ({ ...prev, totalSouls: allSouls.length }));

          // Build chart data from real mood names
          const counts: Record<string, number> = {};
          allSouls.forEach((s: Soul) => {
            const name = (typeof s.mood === 'object' ? s.mood?.mood : s.mood as unknown as string) || 'Other';
            counts[name] = (counts[name] || 0) + 1;
          });
          setChartData(
            Object.entries(counts)
              .map(([mood, count]) => ({ mood, count }))
              .sort((a, b) => b.count - a.count)
          );

          // Recent 10
          setRecentSouls([...allSouls].reverse().slice(0, 10));
        }

        if (reportedRes.status === 'fulfilled' && reportedRes.value.ok) {
          const d = await reportedRes.value.json();
          const arr = Array.isArray(d) ? d : d.data || d.souls || [];
          setStats(prev => ({ ...prev, reported: arr.length }));
        }
        if (removedRes.status === 'fulfilled' && removedRes.value.ok) {
          const d = await removedRes.value.json();
          const arr = Array.isArray(d) ? d : d.data || d.souls || [];
          setStats(prev => ({ ...prev, removed: arr.length }));
        }
        if (circlesRes.status === 'fulfilled' && circlesRes.value.ok) {
          const d = await circlesRes.value.json();
          const arr = Array.isArray(d) ? d : d.data || d.circles || [];
          setStats(prev => ({ ...prev, totalCircles: arr.length }));
        }
        if (moodsRes.status === 'fulfilled' && moodsRes.value.ok) {
          const d = await moodsRes.value.json();
          const arr = Array.isArray(d) ? d : d.data || d.moods || [];
          setStats(prev => ({ ...prev, totalMoods: arr.length }));
        }
        if (blockedRes.status === 'fulfilled' && blockedRes.value.ok) {
          const d = await blockedRes.value.json();
          const arr = Array.isArray(d) ? d : d.data || d.users || [];
          setStats(prev => ({ ...prev, blockedUsers: arr.length }));
        }
      } catch { /* silent */ } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2 bg-slate-700/50" />
          <Skeleton className="h-4 w-64 bg-slate-700/50" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-24 bg-slate-700/50 rounded-2xl" />)}
        </div>
        <Skeleton className="h-80 bg-slate-700/50 rounded-2xl" />
        <Skeleton className="h-96 bg-slate-700/50 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-slate-100 text-3xl mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview of SoulSpace platform metrics</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {STAT_CONFIG.map((s, index) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                background: 'rgba(30,41,59,0.4)',
                border: '1px solid rgba(71,85,105,0.5)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div style={{
                width: '56px', height: '56px',
                borderRadius: '16px',
                background: s.grad,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon style={{ width: '28px', height: '28px', color: 'white' }} />
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>{s.label}</p>
                <p style={{ color: 'white', fontSize: '30px', fontWeight: 'bold' }}>
                  {(stats as Record<string, number>)[s.key].toLocaleString()}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
      >
        <h2 className="text-slate-100 text-xl mb-6">Mood Distribution</h2>
        {chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-slate-500">No mood data yet</p>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                <XAxis dataKey="mood" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30,41,59,0.95)',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                  }}
                />
                <Bar dataKey="count" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Recent Souls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 bg-emerald-400 rounded-full" />
          <h2 className="text-slate-100 text-xl">Recent Souls</h2>
        </div>
        {recentSouls.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No souls yet</p>
        ) : (
          <div className="space-y-3">
            {recentSouls.map((soul, index) => {
              const moodName = (typeof soul.mood === 'object' ? soul.mood?.mood : soul.mood as unknown as string) || 'Other';
              const color = getMoodColor(moodName);
              return (
                <motion.div
                  key={soul.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4 hover:border-slate-600/50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium border border-slate-600/30 whitespace-nowrap flex-shrink-0"
                      style={{ color, borderColor: `${color}40` }}
                    >
                      {moodName}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-sm line-clamp-2">{soul.soul}</p>
                      <p className="text-slate-500 text-xs mt-1">{timeAgo(soul.created_at)}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
