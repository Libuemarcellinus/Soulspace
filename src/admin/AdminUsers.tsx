import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserX, AlertCircle } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://soulspace-ye8o.onrender.com/api/';

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
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

interface BlockedUser {
  id: string;
  username?: string;
  blocked_username?: string;
  reason?: string;
  created_at?: string;
  blocked_at?: string;
}

export default function AdminUsers() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<BlockedUser[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminRequest('admin/all_blocked');
        if (res.ok) {
          const d = await res.json();
          setUsers(Array.isArray(d) ? d : d.data || d.users || []);
        }
      } catch { /* silent */ } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-slate-700/50" />
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-24 bg-slate-700/50 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-slate-100 text-3xl mb-2">Blocked Users</h1>
        <p className="text-slate-400">Users who have been blocked from the platform</p>
      </motion.div>

      {users.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="text-slate-500 text-4xl mb-4">✅</div>
          <h3 className="text-slate-300 mb-2">No blocked users yet</h3>
          <p className="text-slate-500 text-sm">Users who violate community guidelines will appear here</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {users.map((user, index) => {
            const displayName = user.username || user.blocked_username || `User ${user.id?.slice(0, 8)}`;
            const date = user.blocked_at || user.created_at || '';
            return (
              <motion.div key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/40 backdrop-blur-xl border border-red-600/30 rounded-xl p-5 hover:border-red-600/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-red-500/10 flex-shrink-0">
                    <UserX className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-slate-100">{displayName}</h3>
                      <span className="text-slate-500 text-sm whitespace-nowrap">{timeAgo(date)}</span>
                    </div>
                    {user.reason && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-400 text-sm">{user.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {users.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Total blocked users</span>
            <span className="text-slate-100 font-bold">{users.length}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
