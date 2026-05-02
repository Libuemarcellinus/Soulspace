import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://soulspace-production.up.railway.app/api/';

function adminRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('soulspace_admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(`${BASE_URL}${path}`, { ...options, headers: { ...headers, ...(options.headers || {}) } });
}

interface Circle {
  id: string;
  circle: string;
  icon: string;
  status: boolean;
  member_count?: number;
}

export default function AdminCircles() {
  const [isLoading, setIsLoading] = useState(true);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [iconEmoji, setIconEmoji] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  async function fetchCircles() {
    try {
      const res = await adminRequest('admin/all_circles');
      if (res.ok) {
        const d = await res.json();
        const raw = Array.isArray(d) ? d : d.data || d.circles || [];
        setCircles(raw.map((c: any) => ({ ...c, id: c.circle_id ?? c.id })));
      }
    } catch { /* silent */ } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchCircles(); }, []);

  const toggleStatus = async (circle: Circle) => {
    const newStatus = !circle.status;
    setCircles(prev => prev.map(c => c.id === circle.id ? { ...c, status: newStatus } : c));
    try {
      await adminRequest(`admin/circle_status?id=${circle.id}&status=${newStatus}`, { method: 'PATCH' });
    } catch {
      setCircles(prev => prev.map(c => c.id === circle.id ? { ...c, status: circle.status } : c));
    }
  };

  const handleCreate = async () => {
    if (!newName || !iconEmoji) return;
    setIsCreating(true);
    try {
      const res = await adminRequest('admin/create_circle', {
        method: 'POST',
        body: JSON.stringify({ circle: newName, icon: iconEmoji }),
      });
      if (res.ok) {
        setNewName('');
        setIconEmoji('');
        setIsCreateOpen(false);
        await fetchCircles();
      }
    } catch { /* silent */ } finally {
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-40 bg-slate-700/50 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-100 text-3xl mb-2">Circles</h1>
          <p className="text-slate-400">Manage community circles</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              <Plus className="h-4 w-4 mr-2" /> Create Circle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800/95 backdrop-blur-xl border-slate-700/50 text-slate-100">
            <DialogHeader>
              <DialogTitle>Create New Circle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Circle Name</Label>
                <Input placeholder="e.g., Night Thoughts" value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="bg-slate-900/50 border-slate-700/50 text-slate-100" />
              </div>
              <div className="space-y-2">
                <Label>Circle Icon (emoji)</Label>
                <Input placeholder="e.g. ⭕" value={iconEmoji}
                  onChange={e => setIconEmoji(e.target.value)}
                  className="bg-slate-900/50 border-slate-700/50 text-slate-100 text-2xl" />
              </div>
              <Button onClick={handleCreate} disabled={!newName || !iconEmoji || isCreating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50">
                {isCreating ? 'Creating...' : 'Create Circle'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {circles.length === 0 ? (
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="text-slate-500 text-4xl mb-4">⭕</div>
          <h3 className="text-slate-300 mb-2">No circles yet</h3>
          <p className="text-slate-500 text-sm">Create your first circle to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {circles.map((circle, index) => (
            <motion.div key={circle.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04 }}
              className={`bg-slate-800/40 backdrop-blur-xl border rounded-2xl p-6 transition-all ${
                circle.status ? 'border-slate-700/50 hover:border-slate-600/50' : 'border-slate-700/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl overflow-hidden">
                  {circle.icon?.startsWith('http')
                    ? <img src={circle.icon} alt={circle.circle} className="w-full h-full object-cover rounded-xl" />
                    : circle.icon || '⭕'
                  }
                </div>
                <Switch checked={circle.status} onCheckedChange={() => toggleStatus(circle)} />
              </div>
              <h3 className="text-slate-100 mb-2 line-clamp-1">{circle.circle}</h3>
              {circle.member_count !== undefined && (
                <p className="text-slate-400 text-sm flex items-center gap-1">
                  <Users className="h-3 w-3" />{circle.member_count.toLocaleString()}
                </p>
              )}
              <div className="mt-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  circle.status ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-600/20 text-slate-400'
                }`}>
                  {circle.status ? 'Active' : 'Inactive'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
