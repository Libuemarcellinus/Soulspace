import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trash2, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://soulspace-ye8o.onrender.com/api/';

function adminRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('soulspace_admin_token');
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
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
  calm: 'from-blue-400 to-cyan-400',
  hopeful: 'from-emerald-400 to-teal-400',
  reflective: 'from-purple-400 to-indigo-400',
  joyful: 'from-pink-400 to-rose-400',
  anxious: 'from-yellow-400 to-orange-400',
  sad: 'from-slate-400 to-gray-400',
  grateful: 'from-rose-400 to-pink-400',
  overwhelmed: 'from-blue-400 to-indigo-400',
};

function getMoodGradient(name: string) {
  return MOOD_COLORS[(name || '').toLowerCase()] || 'from-purple-400 to-pink-400';
}

interface Soul {
  id: string;
  soul: string;
  mood?: { mood?: string };
  created_at: string;
  reported?: boolean;
}

export default function AdminSouls() {
  const [isLoading, setIsLoading] = useState(true);
  const [allSouls, setAllSouls] = useState<Soul[]>([]);
  const [reportedSouls, setReportedSouls] = useState<Soul[]>([]);
  const [removedSouls, setRemovedSouls] = useState<Soul[]>([]);
  const [removing, setRemoving] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function fetchAll() {
    setIsLoading(true);
    try {
      const [allRes, repRes, remRes] = await Promise.allSettled([
        adminRequest('admin/all'),
        adminRequest('admin/reported'),
        adminRequest('admin/removed'),
      ]);
      if (allRes.status === 'fulfilled' && allRes.value.ok) {
        const d = await allRes.value.json();
        setAllSouls(Array.isArray(d) ? d : d.data || d.souls || []);
      }
      if (repRes.status === 'fulfilled' && repRes.value.ok) {
        const d = await repRes.value.json();
        setReportedSouls(Array.isArray(d) ? d : d.data || d.souls || []);
      }
      if (remRes.status === 'fulfilled' && remRes.value.ok) {
        const d = await remRes.value.json();
        setRemovedSouls(Array.isArray(d) ? d : d.data || d.souls || []);
      }
    } catch { /* silent */ } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  const handleRemove = async (id: string) => {
    setRemoving(id);
    try {
      await adminRequest(`admin/remove?id=${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: 'Removed by admin' }),
      });
      await fetchAll();
    } catch { /* silent */ } finally {
      setRemoving(null);
      setConfirmId(null);
    }
  };

  const SoulCard = ({ soul, showRemove = false }: { soul: Soul; showRemove?: boolean }) => {
    const moodName = soul.mood?.mood || 'Other';
    const gradient = getMoodGradient(moodName);
    const isConfirming = confirmId === soul.id;

    return (
      <div className={`bg-slate-800/40 backdrop-blur-xl border rounded-xl p-4 hover:border-slate-600/50 transition-all ${
        showRemove ? 'border-yellow-600/30 hover:border-yellow-600/50' : 'border-slate-700/50'
      }`}>
        <div className="flex items-start gap-3">
          <span className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-medium border border-slate-600/30 whitespace-nowrap flex-shrink-0`}>
            {moodName}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-slate-300 text-sm mb-1 line-clamp-2">{soul.soul}</p>
            <p className="text-slate-500 text-xs">{timeAgo(soul.created_at)}</p>
          </div>
          {showRemove && !isConfirming && (
            <Button size="sm" variant="destructive"
              onClick={() => setConfirmId(soul.id)}
              className="flex-shrink-0 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Remove
            </Button>
          )}
          {showRemove && isConfirming && (
            <div className="flex gap-2 flex-shrink-0">
              <Button size="sm"
                onClick={() => handleRemove(soul.id)}
                disabled={removing === soul.id}
                className="bg-red-500/30 hover:bg-red-500/40 text-red-200 border border-red-500/40 text-xs px-2"
              >
                {removing === soul.id ? '...' : 'Yes'}
              </Button>
              <Button size="sm" variant="outline"
                onClick={() => setConfirmId(null)}
                className="text-slate-300 border-slate-600 text-xs px-2"
              >
                No
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-slate-700/50" />
        <Skeleton className="h-12 w-full bg-slate-700/50 rounded-xl" />
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-24 bg-slate-700/50 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const Empty = ({ emoji, title, sub }: { emoji: string; title: string; sub: string }) => (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
      <div className="text-slate-500 text-4xl mb-4">{emoji}</div>
      <h3 className="text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-slate-100 text-3xl mb-2">Souls Management</h1>
        <p className="text-slate-400">Manage posts across the platform</p>
      </motion.div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
            All ({allSouls.length})
          </TabsTrigger>
          <TabsTrigger value="reported" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
            Reported ({reportedSouls.length})
          </TabsTrigger>
          <TabsTrigger value="removed" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
            Removed ({removedSouls.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {allSouls.length === 0
            ? <Empty emoji="💭" title="No souls yet" sub="Posts will appear here when users start sharing" />
            : <div className="space-y-3">
                {allSouls.map((soul, i) => (
                  <motion.div key={soul.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <SoulCard soul={soul} />
                  </motion.div>
                ))}
              </div>
          }
        </TabsContent>

        <TabsContent value="reported" className="mt-6">
          {reportedSouls.length === 0
            ? <Empty emoji="✅" title="No reported souls" sub="Reported posts will appear here for review" />
            : <div className="space-y-3">
                {reportedSouls.map((soul, i) => (
                  <motion.div key={soul.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <SoulCard soul={soul} showRemove />
                  </motion.div>
                ))}
              </div>
          }
        </TabsContent>

        <TabsContent value="removed" className="mt-6">
          {removedSouls.length === 0
            ? <Empty emoji="🗑️" title="No removed souls" sub="Removed posts will appear here" />
            : <div className="space-y-3">
                {removedSouls.map((soul, i) => {
                  const moodName = soul.mood?.mood || 'Other';
                  const gradient = getMoodGradient(moodName);
                  return (
                    <motion.div key={soul.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="bg-slate-800/40 backdrop-blur-xl border border-red-600/30 rounded-xl p-4 opacity-60">
                      <div className="flex items-start gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-medium border border-slate-600/30 whitespace-nowrap flex-shrink-0`}>
                          {moodName}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-400 text-sm mb-1 line-through line-clamp-2">{soul.soul}</p>
                          <p className="text-slate-500 text-xs">{timeAgo(soul.created_at)}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
          }
        </TabsContent>
      </Tabs>
    </div>
  );
}
