import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Filter, Edit3, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface BrowseFeedProps {
  navigateTo: (screen: string, data?: any) => void;
  username?: string;
  mood?: string;
  isReturning?: boolean;
}

const moods = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'calm', label: 'Calm', emoji: '🌊' },
  { id: 'hopeful', label: 'Hopeful', emoji: '🌟' },
  { id: 'reflective', label: 'Reflective', emoji: '🌙' },
  { id: 'joyful', label: 'Joyful', emoji: '✨' }
];

const samplePosts = [
  { id: 1, user: 'HopefulBreeze23', mood: 'hopeful', emoji: '🌟', text: "Finally found the courage to start that project I've been putting off. Small steps!", hearts: 47, replies: 12, time: '2h ago' },
  { id: 2, user: 'ReflectiveMoon88', mood: 'reflective', emoji: '🌙', text: "Sometimes the quiet moments teach us more than the loud ones. Sitting with my thoughts tonight.", hearts: 83, replies: 24, time: '4h ago' },
  { id: 3, user: 'CalmWave12', mood: 'calm', emoji: '🌊', text: "Made tea, watched the rain, and let everything else fade away. Peace exists in the present.", hearts: 124, replies: 31, time: '6h ago' },
  { id: 4, user: 'JoyfulGlow45', mood: 'joyful', emoji: '✨', text: "Laughed so hard today my face hurt. These are the moments we live for!", hearts: 95, replies: 18, time: '8h ago' },
  { id: 5, user: 'HopefulStar67', mood: 'hopeful', emoji: '🌟', text: "Tomorrow is a fresh start. Whatever happened today, we get to try again.", hearts: 156, replies: 42, time: '10h ago' }
];

export default function BrowseFeed({ navigateTo, username = 'HopefulStar17', mood = 'hopeful', isReturning = false }: BrowseFeedProps) {
  const [selectedMood, setSelectedMood] = useState('all');
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const handleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const filteredPosts = selectedMood === 'all' 
    ? samplePosts 
    : samplePosts.filter(post => post.mood === selectedMood);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20 max-w-[390px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-slate-100">Stories</h1>
              <p className="text-slate-400 text-sm">Welcome, {username}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-purple-400"
              onClick={() => navigateTo('settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Mood Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
                  selectedMood === mood.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <span className="mr-1">{mood.emoji}</span>
                {mood.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User's Post (if returning) */}
      {isReturning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
              Your post
            </Badge>
          </div>
          <div className="p-4 bg-slate-800/60 border-2 border-purple-500/30 rounded-2xl mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌟</span>
              <span className="text-purple-400">{username}</span>
              <span className="text-slate-500 text-xs">• 1d ago</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed mb-3">
              "Feeling calm and ready for whatever comes next. One day at a time."
            </p>
            <div className="flex items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> 23
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> 7
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Posts Feed */}
      <div className="px-6 pt-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-slate-600/50 transition-all"
            >
              {/* Post Header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{post.emoji}</span>
                <span className="text-slate-400 text-sm">{post.user}</span>
                <span className="text-slate-600 text-xs">• {post.time}</span>
              </div>

              {/* Post Content */}
              <p className="text-slate-200 text-sm leading-relaxed mb-3">
                "{post.text}"
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${
                    likedPosts.includes(post.id)
                      ? 'text-pink-400'
                      : 'text-slate-400 hover:text-pink-400'
                  }`}
                >
                  <motion.div
                    animate={likedPosts.includes(post.id) ? { scale: [1, 1.2, 1] } : {}}
                  >
                    <Heart 
                      className="w-4 h-4" 
                      fill={likedPosts.includes(post.id) ? 'currentColor' : 'none'}
                    />
                  </motion.div>
                  <span>{post.hearts + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                </motion.button>

                <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.replies}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigateTo('share-story', { username, mood })}
        className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50 flex items-center justify-center"
      >
        <Edit3 className="w-6 h-6 text-white" />
      </motion.button>

      {/* AdMob Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 h-[50px] bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 flex items-center justify-center max-w-[390px] mx-auto">
        <p className="text-slate-600 text-xs">AdMob 300x50</p>
      </div>

      {/* Help Button - Floating */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed top-4 right-4"
      >
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-slate-300"
          onClick={() => navigateTo('help')}
        >
          Help
        </Button>
      </motion.div>
    </div>
  );
}
