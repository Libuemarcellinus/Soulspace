import { motion } from 'motion/react';
import { ArrowLeft, Heart, MessageCircle, Share2, Flag, Ghost, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface PostDetailProps {
  post: any;
  navigateTo: (screen: string, data?: any) => void;
}

const mockReplies = [
  {
    id: 1,
    content: "I feel you. You're not alone in this.",
    empathy: 23,
    timestamp: '1m ago',
    mood: 'supportive',
    moodColor: 'text-emerald-400'
  },
  {
    id: 2,
    content: "This resonates deeply. Thank you for sharing.",
    empathy: 18,
    timestamp: '5m ago',
    mood: 'grateful',
    moodColor: 'text-pink-400'
  },
  {
    id: 3,
    content: "Sending you strength. Your feelings are valid.",
    empathy: 31,
    timestamp: '12m ago',
    mood: 'caring',
    moodColor: 'text-purple-400'
  }
];

export default function PostDetail({ post, navigateTo }: PostDetailProps) {
  if (!post) {
    navigateTo('home');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pb-6">
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
            <h1 className="text-slate-100">Soul</h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-red-400"
            >
              <Flag className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Original Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 mb-6"
        >
          {/* Post Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ghost className={`w-5 h-5 ${post.moodColor}`} />
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
          <p className="text-slate-200 text-lg leading-relaxed mb-6">{post.content}</p>

          {/* Expiration Timer */}
          <div className="flex items-center gap-2 mb-6">
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
              className="flex items-center gap-2 text-slate-400 hover:text-pink-400 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>{post.empathy}</span>
            </motion.button>
            <button
              onClick={() => navigateTo('reply', { post })}
              className="flex items-center gap-2 text-purple-400"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{post.replies}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Replies Section */}
        <div className="space-y-4">
          <h2 className="text-slate-300 mb-4">Echoes ({mockReplies.length})</h2>
          
          {mockReplies.map((reply, index) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-4 ml-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Ghost className={`w-4 h-4 ${reply.moodColor}`} />
                <span className="text-slate-500 text-sm">{reply.timestamp}</span>
              </div>
              <p className="text-slate-300 mb-3">{reply.content}</p>
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 text-slate-400 hover:text-pink-400 transition-colors text-sm"
                >
                  <Heart className="w-4 h-4" />
                  <span>{reply.empathy}</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reply Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigateTo('reply', { post })}
          className="w-full mt-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-3xl p-4 text-purple-300 hover:border-purple-400/50 transition-all"
        >
          Add your echo...
        </motion.button>
      </div>
    </div>
  );
}
