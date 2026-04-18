import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, MessageCircle, Clock, Ghost, Plus, Compass, TrendingUp, User, UserPlus, UserMinus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApi } from '../hooks/useApi';
import { soulsApi, circlesApi } from '../lib/api';
import { mockCircleSouls, mapApiSoul } from '../lib/mockData';
import ReconnectingBanner from './ReconnectingBanner';

interface CircleFeedProps {
  circle: any;
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
      </div>
      <div className="h-1 bg-slate-700 rounded-full mb-4" />
      <div className="flex gap-6">
        <div className="w-12 h-5 bg-slate-700 rounded" />
        <div className="w-12 h-5 bg-slate-700 rounded" />
      </div>
    </div>
  );
}

export default function CircleFeed({ circle, navigateTo }: CircleFeedProps) {
  if (!circle) {
    navigateTo('circles');
    return null;
  }

  const { data: rawSouls, isLoading, error } = useApi(
    () => soulsApi.getCircleSouls(circle.id),
    [circle.id]
  );
  const isFallback = !isLoading && error !== null;
  const soulsArray = Array.isArray(rawSouls) ? rawSouls : null;
  const posts = (soulsArray ?? (isFallback ? mockCircleSouls : [])).map(mapApiSoul);

  const { data: myCircles } = useApi(() => circlesApi.myCircles(), []);
  const isJoined = myCircles?.some(c => c.id === circle.id) ?? false;
  const [joinedOptimistic, setJoinedOptimistic] = useState<boolean | null>(null);
  const joined = joinedOptimistic ?? isJoined;
  const [joiningLoading, setJoiningLoading] = useState(false);

  const handleJoinLeave = async () => {
    setJoiningLoading(true);
    setJoinedOptimistic(!joined);
    try {
      if (joined) {
        await circlesApi.leave(circle.id);
      } else {
        await circlesApi.join(circle.id);
      }
    } catch {
      setJoinedOptimistic(joined);
    } finally {
      setJoiningLoading(false);
    }
  };

  const Icon = circle.icon;

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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateTo('circles')}
              className="text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${circle.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-slate-100">{circle.name}</h1>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </motion.div>

      {/* Circle Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`max-w-2xl mx-auto px-4 mt-6 ${circle.gradient} border ${circle.border} rounded-3xl p-6`}
      >
        <p className="text-slate-300 mb-3">{circle.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">{circle.members} souls</span>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
              {circle.activeNow} active now
            </Badge>
          </div>
          <Button
            size="sm"
            disabled={joiningLoading}
            onClick={handleJoinLeave}
            className={joined
              ? 'bg-slate-700/60 text-slate-300 hover:bg-red-500/20 hover:text-red-400 border border-slate-600/50'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            }
          >
            {joined
              ? <><UserMinus className="w-4 h-4 mr-1" />Leave</>
              : <><UserPlus className="w-4 h-4 mr-1" />Join</>
            }
          </Button>
        </div>
      </motion.div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
        {isLoading && !isFallback ? (
          Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <PostSkeleton />
            </motion.div>
          ))
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
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
              <p className="text-slate-200 leading-relaxed mb-4">{post.content}</p>

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
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-slate-400 hover:text-pink-400 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>{post.empathy}</span>
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
          ))
        )}
      </div>

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
            <button
              onClick={() => navigateTo('home')}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-purple-400 transition-colors"
            >
              <Ghost className="w-6 h-6" />
              <span className="text-xs">Feed</span>
            </button>
            <button
              onClick={() => navigateTo('circles')}
              className="flex flex-col items-center gap-1 text-purple-400"
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
