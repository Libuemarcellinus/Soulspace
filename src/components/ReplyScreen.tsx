import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Send, Ghost } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

interface ReplyScreenProps {
  post: any;
  navigateTo: (screen: string, data?: any) => void;
}

export default function ReplyScreen({ post, navigateTo }: ReplyScreenProps) {
  const [reply, setReply] = useState('');

  if (!post) {
    navigateTo('home');
    return null;
  }

  const handleSendReply = () => {
    // Simulate sending reply
    setTimeout(() => navigateTo('post-detail', { post }), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
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
              onClick={() => navigateTo('post-detail', { post })}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-6 h-6" />
            </Button>
            <h1 className="text-slate-100">Echo Back</h1>
            <Button
              onClick={handleSendReply}
              disabled={!reply.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Original Post Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Ghost className={`w-4 h-4 ${post.moodColor}`} />
            <Badge variant="outline" className={`${post.moodColor} border-current/30 bg-current/10 text-xs`}>
              {post.mood}
            </Badge>
            <span className="text-slate-500 text-sm">{post.timestamp}</span>
          </div>
          <p className="text-slate-300 text-sm line-clamp-3">{post.content}</p>
        </motion.div>

        {/* Reply Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Share your thoughts, offer support, or just let them know they're heard..."
            className="min-h-[300px] bg-slate-800/40 border-slate-700/50 text-slate-200 placeholder:text-slate-500 rounded-3xl resize-none focus:border-purple-500/50"
            autoFocus
          />
        </motion.div>

        {/* Guidelines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 bg-slate-800/20 border border-slate-700/30 rounded-2xl"
        >
          <h3 className="text-slate-300 mb-2">Kind Echoes</h3>
          <ul className="text-slate-400 text-sm space-y-1">
            <li>• Be compassionate and supportive</li>
            <li>• Validate their feelings</li>
            <li>• Avoid judgment or unsolicited advice</li>
            <li>• Your echo will also expire in 24 hours</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
