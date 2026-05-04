import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://soulspace-ye8o.onrender.com/api/';

function adminRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('soulspace_admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
    signal: controller.signal,
  }).finally(() => clearTimeout(timer));
}

interface Mood {
  id: string;
  mood: string;
  mood_icon: string;
  color?: string;
  status: boolean | number | string;
}

export default function AdminMoods() {
  const [isLoading, setIsLoading] = useState(true);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [iconEmoji, setIconEmoji] = useState('');
  const [colorValue, setColorValue] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  async function fetchMoods() {
    try {
      const res = await adminRequest('admin/all_moods');
      if (res.ok) {
        const d = await res.json();
        const raw = Array.isArray(d) ? d : d.data || d.moods || [];
        setMoods(raw.map((m: any) => ({ ...m, id: m.mood_id ?? m.id })));
      }
    } catch { /* silent */ } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchMoods(); }, []);

  const isActive = (mood: Mood) =>
    mood.status === true || mood.status === 1 || mood.status === '1' || mood.status === 'active' || mood.status === 'true';

  const toggleStatus = async (mood: Mood) => {
    const newStatus = !isActive(mood);
    setMoods(prev => prev.map(m => m.id === mood.id ? { ...m, status: newStatus } : m));
    try {
      await adminRequest(`admin/mood_status?id=${mood.id}&status=${newStatus ? 1 : 0}`, { method: 'PATCH' });
    } catch {
      setMoods(prev => prev.map(m => m.id === mood.id ? { ...m, status: mood.status } : m));
    }
  };

  const handleCreate = async () => {
    if (!newName || !iconEmoji) return;
    setIsCreating(true);
    setCreateError('');
    const cleanColor = colorValue.replace(/^#/, '').trim();
    const body: Record<string, string> = { mood: newName, icon: iconEmoji };
    if (cleanColor) body.color = cleanColor;
    try {
      const res = await adminRequest('admin/create_mood', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setNewName('');
        setIconEmoji('');
        setColorValue('');
        setCreateError('');
        setIsCreateOpen(false);
        await fetchMoods();
      } else {
        const text = await res.text().catch(() => '');
        const msg = text ? (JSON.parse(text).message || JSON.parse(text).error) : '';
        setCreateError(msg || `Failed (${res.status})`);
      }
    } catch (err) {
      setCreateError(err instanceof Error && err.name === 'AbortError' ? 'Request timed out.' : 'Network error.');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 bg-slate-700/50" />
          <Skeleton className="h-10 w-32 bg-slate-700/50 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-36 bg-slate-700/50 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-100 text-3xl mb-2">Moods</h1>
          <p className="text-slate-400">Manage available mood tags</p>
        </div>

        <Button
          onClick={() => { setIsCreateOpen(true); setCreateError(''); }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Create Mood
        </Button>
      </motion.div>

      {moods.length === 0 ? (
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="text-slate-500 text-4xl mb-4">😊</div>
          <h3 className="text-slate-300 mb-2">No moods yet</h3>
          <p className="text-slate-500 text-sm">Create your first mood to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {moods.map((mood, index) => {
            const active = isActive(mood);
            return (
              <motion.div key={mood.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className={`bg-slate-800/40 backdrop-blur-xl border rounded-2xl p-6 transition-all ${
                  active ? 'border-slate-700/50 hover:border-slate-600/50' : 'border-slate-700/30 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden text-3xl"
                    style={{ backgroundColor: mood.color ? `#${mood.color}33` : 'rgba(168,85,247,0.1)' }}
                  >
                    {mood.mood_icon?.startsWith('http')
                      ? <img src={mood.mood_icon} alt={mood.mood} className="w-full h-full object-contain" />
                      : <span>{mood.mood_icon}</span>
                    }
                  </div>
                  <Switch checked={active} onCheckedChange={() => toggleStatus(mood)} />
                </div>
                <h3 className="text-slate-100 mb-3">{mood.mood}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-600/20 text-slate-400'
                }`}>
                  {active ? 'Active' : 'Inactive'}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={() => setIsCreateOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-100 text-xl font-semibold">Create New Mood</h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Mood Name</Label>
                <Input placeholder="e.g., Inspired" value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="bg-slate-900/50 border-slate-700/50 text-slate-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Mood Icon (emoji)</Label>
                <Input placeholder="e.g. 😊" value={iconEmoji}
                  onChange={e => setIconEmoji(e.target.value)}
                  className="bg-slate-900/50 border-slate-700/50 text-slate-100 text-2xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Color hex (optional, no #)</Label>
                <Input placeholder="e.g. FFFF00" value={colorValue}
                  onChange={e => setColorValue(e.target.value)}
                  className="bg-slate-900/50 border-slate-700/50 text-slate-100" />
              </div>
              {createError && <p className="text-red-400 text-sm">{createError}</p>}
              <Button onClick={handleCreate} disabled={!newName || !iconEmoji || isCreating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50">
                {isCreating ? 'Creating...' : 'Create Mood'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
