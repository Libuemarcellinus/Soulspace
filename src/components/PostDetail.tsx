import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, MessageCircle, Flag, Ghost, Clock, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApi } from '../hooks/useApi';
import { soulsApi } from '../lib/api';
import { isLiked, persistLike, revertLike } from '../lib/likeStorage';

interface PostDetailProps {
  post: any;
  navigateTo: (screen: string, data?: any) => void;
}

export default function PostDetail({ post, navigateTo }: PostDetailProps) {
  const [liked, setLiked] = useState(() => isLiked(post?.id ?? ''));
  const [empathyCount, setEmpathyCount] = useState(post?.empathy ?? 0);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [reported, setReported] = useState(false);
  const [replyLikes, setReplyLikes] = useState<Record<string, number>>({});

  const { data: rawReplies, isLoading: repliesLoading, error: repliesError } = useApi(
    () => soulsApi.getReplies(post?.id),
    [post?.id]
  );
  const repliesUnavailable = !repliesLoading && repliesError !== null &&
    /404|not found/i.test(repliesError.message ?? '');
  const replies = Array.isArray(rawReplies) ? rawReplies : [];

  if (!post) {
    navigateTo('home');
    return null;
  }

  const handleLike = async () => {
    const alreadyLiked = liked;
    if (alreadyLiked) {
      setLiked(false);
      setEmpathyCount((c: number) => c - 1);
      revertLike(post.id);
    } else {
      setLiked(true);
      setEmpathyCount((c: number) => c + 1);
      persistLike(post.id);
    }
    try {
      await soulsApi.like(post.id);
    } catch {
      // Revert on failure
      if (alreadyLiked) {
        setLiked(true);
        setEmpathyCount((c: number) => c + 1);
        persistLike(post.id);
      } else {
        setLiked(false);
        setEmpathyCount((c: number) => c - 1);
        revertLike(post.id);
      }
    }
  };

  const handleReplyLike = async (replyId: string, currentCount: number) => {
    const prev = replyLikes[replyId] ?? currentCount;
    setReplyLikes(r => ({ ...r, [replyId]: prev + 1 }));
    try {
      await soulsApi.likeReply(replyId);
    } catch {
      setReplyLikes(r => ({ ...r, [replyId]: prev }));
    }
  };

  const handleReport = async () => {
    try {
      await soulsApi.report(post.id, 'inappropriate content');
    } catch {}
    setReported(true);
    setShowReportConfirm(false);
  };

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
            {reported ? (
              <span className="text-slate-500 text-xs pr-2">Reported</span>
            ) : showReportConfirm ? (
              <Button
                size="sm"
                onClick={handleReport}
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 text-xs"
              >
                Confirm Report
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowReportConfirm(true)}
                className="text-slate-400 hover:text-red-400"
              >
                <Flag className="w-5 h-5" />
              </Button>
            )}
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

          <p className="text-slate-200 text-lg leading-relaxed mb-6">{post.content}</p>

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

          <div className="flex items-center gap-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                liked ? 'text-pink-400' : 'text-slate-400 hover:text-pink-400'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>{empathyCount}</span>
            </motion.button>
            <button
              onClick={() => navigateTo('reply', { post })}
              className="flex items-center gap-2 text-purple-400"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{post.replies}</span>
            </button>
          </div>
        </motion.div>

        {/* Replies Section */}
        <div className="space-y-4">
          {repliesLoading ? (
            <>
              <div className="h-5 w-24 bg-slate-700 rounded animate-pulse mb-4" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-4 ml-6 animate-pulse h-20" />
              ))}
            </>
          ) : repliesUnavailable || replies.length === 0 ? (
            <div className="ml-6 p-4 bg-slate-800/20 border border-slate-700/30 rounded-2xl flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-slate-600 flex-shrink-0" />
              <p className="text-slate-500 text-sm">
                {repliesUnavailable ? 'Replies coming soon' : 'No echoes yet — be the first'}
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-slate-300 mb-4">Echoes ({replies.length})</h2>
              {replies.map((reply, index) => (
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-4 ml-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Ghost className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500 text-sm">
                      {reply.created_at
                        ? new Date(reply.created_at).toLocaleDateString()
                        : 'just now'}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-3">{reply.reply}</p>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReplyLike(reply.id, reply.like_count ?? 0)}
                    className="flex items-center gap-1 text-slate-500 hover:text-pink-400 transition-colors text-sm"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{replyLikes[reply.id] ?? reply.like_count ?? 0}</span>
                  </motion.button>
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Reply CTA */}
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
