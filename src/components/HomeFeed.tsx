import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Ghost, Plus, Compass, User, TrendingUp, MessageCircle, Heart, Clock, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApi } from '../hooks/useApi';
import { soulsApi } from '../lib/api';
import { mockSouls, mapApiSoul } from '../lib/mockData';
import { getAllLiked, persistLike, revertLike } from '../lib/likeStorage';
import ReconnectingBanner from './ReconnectingBanner';

interface HomeFeedProps {
  navigateTo: (screen: string, data?: any) => void;
}

function PostSkeleton() {
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-700 rounded-full" />
          <div className="w-16 h-5 bg-slate-700 rounded-full" />
        </div>
        <div className="w-12 h-4 bg-slate-700 rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="w-full h-4 bg-slate-700 rounded" />
        <div className="w-4/5 h-4 bg-slate-700 rounded" />
        <div className="w-3/5 h-4 bg-slate-700 rounded" />
      </div>
      <div className="h-1 bg-slate-700 rounded-full mb-4" />
      <div className="flex gap-6">
        <div className="w-12 h-5 bg-slate-700 rounded" />
        <div className="w-12 h-5 bg-slate-700 rounded" />
      </div>
    </div>
  );
}

const PAGE_SIZE = 20;

export default function HomeFeed({ navigateTo }: HomeFeedProps) {
  const [page, setPage] = useState(1);
  const [accPosts, setAccPosts] = useState<ReturnType<typeof mapApiSoul>[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const seenIds = useRef<Set<string>>(new Set());

  const { data: rawSouls, isLoading, error, refetch } = useApi(
    () => soulsApi.getActive(1, PAGE_SIZE),
    []
  );

  // Merge fresh poll data into existing list (update counts without shuffling order)
  useEffect(() => {
    if (!Array.isArray(rawSouls)) return;
    const fresh = rawSouls.map(mapApiSoul);
    setAccPosts(prev => {
      if (prev.length === 0) {
        fresh.forEach(p => seenIds.current.add(p.id));
        return fresh;
      }
      // Update existing posts in place; append truly new ones to top
      const map = new Map(prev.map(p => [p.id, p]));
      fresh.forEach(p => {
        map.set(p.id, p);
        seenIds.current.add(p.id);
      });
      return [...map.values()];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawSouls]);

  // Poll every 5 s while the tab is visible so counts update for all viewers
  useEffect(() => {
    const id = setInterval(() => { if (!document.hidden) refetch(); }, 5000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const more = await soulsApi.getActive(nextPage, PAGE_SIZE);
      if (!Array.isArray(more) || more.length === 0) {
        setHasMore(false);
      } else {
        const mapped = more.map(mapApiSoul).filter(p => !seenIds.current.has(p.id));
        mapped.forEach(p => seenIds.current.add(p.id));
        setAccPosts(prev => [...prev, ...mapped]);
        if (more.length < PAGE_SIZE) setHasMore(false);
        setPage(nextPage);
      }
    } catch {
      // silently fail — user can retry
    }
    setLoadingMore(false);
  };

  const isFallback = !isLoading && error !== null;
  const mockPostsMapped = mockSouls.map(mapApiSoul);
  const allPosts = isLoading || isFallback
    ? mockPostsMapped
    : accPosts.length > 0
      ? accPosts
      : mockPostsMapped;

  const [likedPosts, setLikedPosts] = useState<Set<string>>(() => getAllLiked());
  const [countOverrides, setCountOverrides] = useState<Record<string, number>>({});
  const blurPreviews = localStorage.getItem('soulspace_setting_blurPreviews') === 'true';

  const handleEmpathy = async (postId: string, currentCount: number) => {
    if (postId.startsWith('mock-')) return;
    const alreadyLiked = likedPosts.has(postId);
    // Optimistic toggle
    if (alreadyLiked) {
      setLikedPosts(prev => { const next = new Set(prev); next.delete(postId); return next; });
      setCountOverrides(prev => ({ ...prev, [postId]: currentCount - 1 }));
      revertLike(postId);
    } else {
      setLikedPosts(prev => new Set(prev).add(postId));
      setCountOverrides(prev => ({ ...prev, [postId]: currentCount + 1 }));
      persistLike(postId);
    }
    try {
      await soulsApi.like(postId);
    } catch {
      // Revert optimistic update on failure
      if (alreadyLiked) {
        setLikedPosts(prev => new Set(prev).add(postId));
        setCountOverrides(prev => ({ ...prev, [postId]: currentCount }));
        persistLike(postId);
      } else {
        setLikedPosts(prev => { const next = new Set(prev); next.delete(postId); return next; });
        setCountOverrides(prev => ({ ...prev, [postId]: currentCount }));
        revertLike(postId);
      }
    }
  };

  // In-memory override for the current session; server count is truth on next load
  const displayCount = (post: { id: string; empathy: number }) =>
    countOverrides[post.id] ?? post.empathy;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pb-24">
      <ReconnectingBanner show={isFallback} />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-10 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50"
      >
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Ghost className="w-8 h-8 text-purple-400" />
              </motion.div>
              <h1 className="text-slate-100">SoulFeed</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-purple-400"
              onClick={() => navigateTo('mood-pulse')}
            >
              <TrendingUp className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Daily Unload Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto px-4 mt-6"
      >
        <button
          onClick={() => navigateTo('daily-unload')}
          className="w-full bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-3xl p-4 hover:border-purple-400/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-slate-300">Today's Unload</p>
              <p className="text-slate-400 text-sm">What's weighing on your soul?</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Ghost className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </button>
      </motion.div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
        {allPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 hover:border-slate-600/50 transition-all cursor-pointer"
            onClick={() => navigateTo('post-detail', { post })}
          >
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Ghost className={`w-4 h-4 ${post.moodColor}`} />
                <Badge variant="outline" className={`${post.moodColor} border-current/30 bg-current/10`}>
                  {post.mood}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Clock className="w-3 h-3" />
                <span>{post.timestamp}</span>
              </div>
            </div>

            {/* Content */}
            <p className={`text-slate-200 leading-relaxed mb-4 transition-all ${blurPreviews ? 'blur-sm select-none' : ''}`}>
              {post.content}
            </p>

            {/* Expiration Timer */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: '100%' }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 2 }}
                />
              </div>
              <span className="text-slate-500 text-xs">expires in {post.expiresIn}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmpathy(post.id, displayCount(post));
                }}
                className={`flex items-center gap-2 transition-colors ${
                  likedPosts.has(post.id)
                    ? 'text-pink-400'
                    : 'text-slate-400 hover:text-pink-400'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>{displayCount(post)}</span>
              </motion.button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('reply', { post });
                }}
                className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{post.replies}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      {!isFallback && accPosts.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 mt-4">
          {hasMore ? (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full flex items-center justify-center gap-2 py-3 text-slate-400 hover:text-purple-400 transition-colors text-sm disabled:opacity-50"
            >
              {loadingMore
                ? <span className="animate-pulse">Loading...</span>
                : <><ChevronDown className="w-4 h-4" />Load more souls</>
              }
            </button>
          ) : (
            <p className="text-center text-slate-600 text-xs py-3">You've seen all the souls</p>
          )}
        </div>
      )}

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigateTo('create')}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50 flex items-center justify-center"
      >
        <Plus className="w-8 h-8 text-white" />
      </motion.button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-slate-900/90 border-t border-slate-800/50">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-1 text-purple-400">
              <Ghost className="w-6 h-6" />
              <span className="text-xs">Feed</span>
            </button>
            <button
              onClick={() => navigateTo('circles')}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-purple-400 transition-colors"
            >
              <Compass className="w-6 h-6" />
              <span className="text-xs">Circles</span>
            </button>
            <button
              onClick={() => navigateTo('mood-pulse')}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-purple-400 transition-colors"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Pulse</span>
            </button>
            <button
              onClick={() => navigateTo('profile')}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-purple-400 transition-colors"
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Ghost</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
