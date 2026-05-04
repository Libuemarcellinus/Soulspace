import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, X, Pencil, Trash2, Check } from 'lucide-react';
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

interface Prompt {
  id: string;
  prompt: string;
  status: boolean | number | string;
}

export default function AdminDailyPrompts() {
  const [isLoading, setIsLoading] = useState(true);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  async function fetchPrompts() {
    try {
      const res = await adminRequest('admin/daily_prompt');
      if (res.ok) {
        const d = await res.json();
        const raw = Array.isArray(d) ? d : d.data || d.prompts || [];
        setPrompts(raw.map((p: any) => ({ ...p, id: p.prompt_id ?? p.id })));
      }
    } catch { /* silent */ } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchPrompts(); }, []);

  const isActive = (p: Prompt) =>
    p.status === true || p.status === 1 || p.status === '1' || p.status === 'active' || p.status === 'true';

  const toggleStatus = async (p: Prompt) => {
    const newStatus = !isActive(p);
    setPrompts(prev => prev.map(x => x.id === p.id ? { ...x, status: newStatus } : x));
    try {
      await adminRequest(`admin/daily_prompt?id=${p.id}&status=${newStatus}`, { method: 'PATCH' });
    } catch {
      setPrompts(prev => prev.map(x => x.id === p.id ? { ...x, status: p.status } : x));
    }
  };

  const handleCreate = async () => {
    if (!newPrompt.trim()) return;
    setIsCreating(true);
    setCreateError('');
    try {
      const res = await adminRequest('admin/daily_prompt', {
        method: 'POST',
        body: JSON.stringify({ prompt: newPrompt }),
      });
      if (res.ok) {
        setNewPrompt('');
        setIsCreateOpen(false);
        await fetchPrompts();
      } else {
        const text = await res.text().catch(() => '');
        let msg = '';
        try { const j = JSON.parse(text); msg = j.message || j.error || ''; } catch { /* silent */ }
        setCreateError(msg || `Failed (${res.status})`);
      }
    } catch (err) {
      setCreateError(err instanceof Error && err.name === 'AbortError' ? 'Request timed out.' : 'Network error.');
    } finally {
      setIsCreating(false);
    }
  };

  const startEdit = (p: Prompt) => {
    setEditingId(p.id);
    setEditText(p.prompt);
  };

  const saveEdit = async (p: Prompt) => {
    if (!editText.trim() || editText === p.prompt) { setEditingId(null); return; }
    setIsSavingEdit(true);
    const prev = p.prompt;
    setPrompts(px => px.map(x => x.id === p.id ? { ...x, prompt: editText } : x));
    try {
      const res = await adminRequest(`admin/daily_prompt?id=${p.id}`, {
        method: 'PUT',
        body: JSON.stringify({ prompt: editText }),
      });
      if (!res.ok) {
        setPrompts(px => px.map(x => x.id === p.id ? { ...x, prompt: prev } : x));
      }
    } catch {
      setPrompts(px => px.map(x => x.id === p.id ? { ...x, prompt: prev } : x));
    } finally {
      setIsSavingEdit(false);
      setEditingId(null);
    }
  };

  const handleDelete = async (p: Prompt) => {
    setIsDeleting(p.id);
    setPrompts(prev => prev.filter(x => x.id !== p.id));
    try {
      const res = await adminRequest(`admin/daily_prompt?id=${p.id}`, { method: 'DELETE' });
      if (!res.ok) {
        setPrompts(prev => [...prev, p]);
      }
    } catch {
      setPrompts(prev => [...prev, p]);
    } finally {
      setIsDeleting(null);
      setConfirmDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 bg-slate-700/50" />
          <Skeleton className="h-10 w-36 bg-slate-700/50 rounded-xl" />
        </div>
        <div className="space-y-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 bg-slate-700/50 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-100 text-3xl mb-2">Daily Prompts</h1>
          <p className="text-slate-400">Manage daily reflection prompts</p>
        </div>
        <Button
          onClick={() => { setIsCreateOpen(true); setCreateError(''); setNewPrompt(''); }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Prompt
        </Button>
      </motion.div>

      {prompts.length === 0 ? (
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="text-slate-500 text-4xl mb-4">📝</div>
          <h3 className="text-slate-300 mb-2">No prompts yet</h3>
          <p className="text-slate-500 text-sm">Create your first daily prompt to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prompts.map((p, index) => {
            const active = isActive(p);
            const isEditing = editingId === p.id;
            const isConfirmingDelete = confirmDeleteId === p.id;
            return (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`bg-slate-800/40 backdrop-blur-xl border rounded-2xl p-5 transition-all ${
                  active ? 'border-slate-700/50 hover:border-slate-600/50' : 'border-slate-700/30 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <Input
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(p); if (e.key === 'Escape') setEditingId(null); }}
                        className="bg-slate-900/50 border-slate-700/50 text-slate-100 mb-2"
                        autoFocus
                      />
                    ) : (
                      <p className="text-slate-200 text-sm leading-relaxed mb-2">{p.prompt}</p>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-600/20 text-slate-400'
                    }`}>
                      {active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Switch checked={active} onCheckedChange={() => toggleStatus(p)} />
                    {isEditing ? (
                      <>
                        <Button size="sm"
                          onClick={() => saveEdit(p)}
                          disabled={isSavingEdit}
                          className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 h-7 px-2"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline"
                          onClick={() => setEditingId(null)}
                          className="text-slate-300 border-slate-600 h-7 px-2"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : isConfirmingDelete ? (
                      <>
                        <Button size="sm"
                          onClick={() => handleDelete(p)}
                          disabled={isDeleting === p.id}
                          className="bg-red-500/30 hover:bg-red-500/40 text-red-200 border border-red-500/40 text-xs px-2 h-7"
                        >
                          {isDeleting === p.id ? '...' : 'Yes'}
                        </Button>
                        <Button size="sm" variant="outline"
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-slate-300 border-slate-600 text-xs px-2 h-7"
                        >
                          No
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="ghost"
                          onClick={() => startEdit(p)}
                          className="text-slate-400 hover:text-slate-200 h-7 px-2"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost"
                          onClick={() => setConfirmDeleteId(p.id)}
                          className="text-slate-400 hover:text-red-400 h-7 px-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
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
              <h2 className="text-slate-100 text-xl font-semibold">Add Daily Prompt</h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Prompt</Label>
                <Input placeholder="e.g. What made you smile today?" value={newPrompt}
                  onChange={e => setNewPrompt(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
                  className="bg-slate-900/50 border-slate-700/50 text-slate-100" />
              </div>
              {createError && <p className="text-red-400 text-sm">{createError}</p>}
              <Button onClick={handleCreate} disabled={!newPrompt.trim() || isCreating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50">
                {isCreating ? 'Adding...' : 'Add Prompt'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
