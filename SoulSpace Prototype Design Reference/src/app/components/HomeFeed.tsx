import { useState } from 'react';
import { motion } from 'motion/react';
import { Ghost, Plus, Compass, User, TrendingUp, MessageCircle, Heart, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HomeFeedProps {
  navigateTo: (screen: string, data?: any) => void;
}

const mockPosts = [
  {
    id: 1,
    mood: 'anxious',
    moodColor: 'text-purple-400',
    content: "Sometimes I feel like I'm screaming into a void, but knowing someone might hear me here makes it easier to breathe.",
    timestamp: '2m ago',
    empathy: 47,
    replies: 12,
    expiresIn: '22h'
  },
  {
    id: 2,
    mood: 'hopeful',
    moodColor: 'text-emerald-400',
    content: "Today I smiled at a stranger and they smiled back. Small victories matter.",
    timestamp: '15m ago',
    empathy: 124,
    replies: 8,
    expiresIn: '21h'
  },
  {
    id: 3,
    mood: 'overwhelmed',
    moodColor: 'text-blue-400',
    content: "The weight of everyone's expectations feels like carrying an ocean. I just need someone to know I'm trying my best.",
    timestamp: '1h ago',
    empathy: 89,
    replies: 23,
    expiresIn: '18h'
  },
  {
    id: 4,
    mood: 'grateful',
    moodColor: 'text-pink-400',
    content: "Whoever posted about finding peace in small moments yesterday - thank you. I tried it and it helped.",
    timestamp: '3h ago',
    empathy: 156,
    replies: 19,
    expiresIn: '15h'
  },
  {
    id: 5,
    mood: 'lonely',
    moodColor: 'text-indigo-400',
    content: "Is it possible to be surrounded by people and still feel invisible?",
    timestamp: '5h ago',
    empathy: 203,
    replies: 34,
    expiresIn: '12h'
  }
];

export default function HomeFeed({ navigateTo }: HomeFeedProps) {
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const handleEmpathy = (postId: number) => {
    // Animation feedback only
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pb-24">
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
        {mockPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmpathy(post.id);
                }}
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
        ))}
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
