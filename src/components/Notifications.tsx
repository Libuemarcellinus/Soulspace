import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bell, BellOff, MessageCircle, Heart, Trash2, CheckCheck } from 'lucide-react';
import { Button } from './ui/button';
import { useApi } from '../hooks/useApi';
import { notificationsApi, ApiNotification } from '../lib/api';
import { toast } from 'sonner';

interface NotificationsProps {
  navigateTo: (screen: string, data?: any) => void;
}

function timeAgo(iso: string): string {
  if (!iso) return '';
  const ms = new Date(iso).getTime();
  if (isNaN(ms)) return '';
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function NotifIcon({ type }: { type?: string }) {
  if (type === 'reply' || type === 'echo') return <MessageCircle className="w-4 h-4 text-purple-400" />;
  if (type === 'like' || type === 'empathy') return <Heart className="w-4 h-4 text-pink-400" />;
  return <Bell className="w-4 h-4 text-slate-400" />;
}

export default function Notifications({ navigateTo }: NotificationsProps) {
  const { data: raw, isLoading, error, refetch } = useApi(() => notificationsApi.getAll(), []);

  // Optimistic overrides layered on top of server data
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const rawList: ApiNotification[] = Array.isArray(raw) ? raw : [];
  const notifications = rawList
    .filter(n => !deletedIds.has(n.id))
    .map(n => readIds.has(n.id) ? { ...n, read: true } : n);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (id: string) => {
    setReadIds(prev => new Set(prev).add(id));
    try {
      await notificationsApi.markRead(id);
    } catch {
      setReadIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    }
  };

  const handleDelete = async (id: string) => {
    setDeletedIds(prev => new Set(prev).add(id));
    try {
      await notificationsApi.delete(id);
    } catch {
      toast.error('Could not delete notification.');
      setDeletedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) return;
    setReadIds(prev => {
      const next = new Set(prev);
      unread.forEach(n => next.add(n.id));
      return next;
    });
    try {
      await Promise.all(unread.map(n => notificationsApi.markRead(n.id)));
    } catch { /* best-effort */ }
  };

  const handleClick = (notif: ApiNotification) => {
    if (!notif.read) handleMarkRead(notif.id);
    if (notif.soul_id) {
      navigateTo('post-detail', { post: { id: notif.soul_id } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pb-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-10 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50"
      >
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateTo('home')}
              className="text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-slate-100">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMarkAllRead}
                className="text-slate-400 hover:text-purple-400"
                title="Mark all as read"
              >
                <CheckCheck className="w-5 h-5" />
              </Button>
            ) : (
              <div className="w-10" />
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 animate-pulse h-16" />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && rawList.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-4">Could not load notifications.</p>
            <button
              onClick={() => refetch()}
              className="text-purple-400 hover:text-purple-300 text-sm underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center mx-auto mb-4">
              <BellOff className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400">No notifications yet</p>
            <p className="text-slate-600 text-sm mt-1">When someone replies to your soul, you'll see it here</p>
          </motion.div>
        )}

        {/* Notification list */}
        <AnimatePresence initial={false}>
          {notifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`mb-3 rounded-2xl border transition-all ${
                notif.read
                  ? 'bg-slate-800/30 border-slate-700/40'
                  : 'bg-slate-800/60 border-purple-500/30'
              }`}
            >
              <div className="flex items-start gap-3 p-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                  notif.read ? 'bg-slate-700/50' : 'bg-purple-500/20'
                }`}>
                  <NotifIcon type={notif.type} />
                </div>

                {/* Content — tappable area navigates to soul */}
                <button
                  className="flex-1 text-left min-w-0"
                  onClick={() => handleClick(notif)}
                >
                  <p className={`text-sm leading-snug mb-1 ${notif.read ? 'text-slate-400' : 'text-slate-200'}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-slate-600">{timeAgo(notif.created_at)}</p>
                </button>

                {/* Unread dot + delete */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-purple-400 mr-1" />
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
