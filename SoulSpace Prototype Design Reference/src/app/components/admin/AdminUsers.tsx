import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserX, AlertCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface BlockedUser {
  id: number;
  username: string;
  reason: string;
  dateBlocked: string;
}

const blockedUsers: BlockedUser[] = [
  { id: 1, username: 'anonymous_soul_4521', reason: 'Spam and harassment', dateBlocked: '2 days ago' },
  { id: 2, username: 'quiet_heart_7834', reason: 'Posting inappropriate content', dateBlocked: '5 days ago' },
  { id: 3, username: 'midnight_thoughts_2341', reason: 'Violating community guidelines', dateBlocked: '1 week ago' },
  { id: 4, username: 'lost_wanderer_9182', reason: 'Multiple reports from users', dateBlocked: '2 weeks ago' },
  { id: 5, username: 'echo_chamber_5567', reason: 'Creating fake accounts', dateBlocked: '3 weeks ago' },
];

export default function AdminUsers() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<BlockedUser[]>(blockedUsers);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-slate-700/50" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-24 bg-slate-700/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-slate-100 text-3xl mb-2">Blocked Users</h1>
        <p className="text-slate-400">Users who have been blocked from the platform</p>
      </motion.div>

      {/* Blocked Users List */}
      {users.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center"
        >
          <div className="text-slate-500 text-4xl mb-4">✅</div>
          <h3 className="text-slate-300 mb-2">No blocked users yet</h3>
          <p className="text-slate-500 text-sm">Users who violate community guidelines will appear here</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
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
                    <h3 className="text-slate-100">{user.username}</h3>
                    <span className="text-slate-500 text-sm whitespace-nowrap">{user.dateBlocked}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-400 text-sm">{user.reason}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats */}
      {users.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Total blocked users</span>
            <span className="text-slate-100">{users.length}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
