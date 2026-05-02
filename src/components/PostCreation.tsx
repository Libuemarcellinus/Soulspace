import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Type, Mic, Palette, Send, Meh } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { useApi } from '../hooks/useApi';
import { moodsApi, soulsApi } from '../lib/api';
import { mockMoods, mapApiMood } from '../lib/mockData';

interface PostCreationProps {
  navigateTo: (screen: string, data?: any) => void;
  circle?: any; // if set, post goes to this circle instead of the main feed
}

export default function PostCreation({ navigateTo, circle }: PostCreationProps) {
  const [content, setContent] = useState('');
  const [selectedMoodLabel, setSelectedMoodLabel] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'doodle'>('text');
  const [isPosting, setIsPosting] = useState(false);

  const { data: rawMoods, isLoading: moodsLoading, refetch: retryMoods } = useApi(() => moodsApi.getActive(), []);
  const apiMoods = Array.isArray(rawMoods) && rawMoods.length > 0 ? rawMoods : null;
  const moodsReady = apiMoods !== null;
  const moodsFailed = !moodsLoading && !moodsReady;
  // Only show real API moods; fall back to mock for display only while still loading
  const moods = (apiMoods ?? mockMoods).map(mapApiMood);

  const selectedMood = moods.find(m => m.label === selectedMoodLabel) ?? null;
  // Block posting with mock mood IDs — the server rejects them with 400.
  // Posting requires real mood IDs from the server.
  const canPost = circle
    ? !!(content.trim() && !isPosting)
    : !!(content.trim() && selectedMood && !isPosting && moodsReady);

  const handlePost = async () => {
    if (!canPost) return;
    setIsPosting(true);
    try {
      if (circle) {
        await soulsApi.createCircleSoul(content.trim(), circle.id);
        navigateTo('circle-feed', { circle });
      } else {
        if (!selectedMood) return;
        await soulsApi.create(content.trim(), selectedMood.id);
        navigateTo('home');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to share your soul.';
      toast.error(message);
      setIsPosting(false);
    }
  };

  const handleCancel = () => {
    if (circle) navigateTo('circle-feed', { circle });
    else navigateTo('home');
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
              onClick={handleCancel}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-6 h-6" />
            </Button>
            <h1 className="text-slate-100">
              {circle ? `Post in ${circle.name}` : 'Share Your Soul'}
            </h1>
            <Button
              onClick={handlePost}
              disabled={!canPost}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              {isPosting ? 'Posting…' : moodsLoading && !circle ? 'Loading moods…' : 'Post'}
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Mood Selector — only for main feed posts */}
        {!circle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-slate-300 mb-3">How are you feeling?</label>
            {moodsFailed && (
              <div className="mb-3 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-between">
                <span className="text-yellow-400 text-sm">Couldn't reach server — select a mood once it reconnects.</span>
                <button onClick={() => retryMoods()} className="text-yellow-400 text-sm underline ml-3 shrink-0">Retry</button>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {moods.map((mood) => {
                const Icon = mood.icon ?? Meh;
                return (
                  <motion.button
                    key={mood.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMoodLabel(mood.label)}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      selectedMoodLabel === mood.label
                        ? mood.color
                        : 'bg-slate-800/40 text-slate-400 border-slate-700/50 hover:border-slate-600/50'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm">{mood.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Input Mode Toggle — voice & doodle hidden until built */}
        {false && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-4"
          >
            <Button
              variant={inputMode === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('text')}
              className={inputMode === 'text' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : ''}
            >
              <Type className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button
              variant={inputMode === 'voice' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('voice')}
              className={inputMode === 'voice' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : ''}
            >
              <Mic className="w-4 h-4 mr-2" />
              Voice
            </Button>
            <Button
              variant={inputMode === 'doodle' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('doodle')}
              className={inputMode === 'doodle' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : ''}
            >
              <Palette className="w-4 h-4 mr-2" />
              Doodle
            </Button>
          </motion.div>
        )}

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {(inputMode === 'text' || true) && (
            <div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, 500))}
                placeholder="Pour your heart out... Your words are safe here."
                className="min-h-[300px] bg-slate-800/40 border-slate-700/50 text-slate-200 placeholder:text-slate-500 rounded-3xl resize-none focus:border-purple-500/50"
              />
              <p className={`text-xs mt-2 text-right ${content.length >= 480 ? 'text-orange-400' : 'text-slate-500'}`}>
                {content.length}/500
              </p>
            </div>
          )}

          {false && inputMode === 'voice' && (
            <div className="min-h-[300px] bg-slate-800/40 border-2 border-slate-700/50 rounded-3xl flex flex-col items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center mb-4"
              >
                <Mic className="w-12 h-12 text-purple-400" />
              </motion.div>
              <p className="text-slate-400">Tap to start recording</p>
              <p className="text-slate-500 text-sm mt-2">Your voice will be transcribed</p>
            </div>
          )}

          {false && inputMode === 'doodle' && (
            <div className="min-h-[300px] bg-slate-800/40 border-2 border-slate-700/50 rounded-3xl flex flex-col items-center justify-center">
              <Palette className="w-16 h-16 text-purple-400 mb-4" />
              <p className="text-slate-400">Draw your emotions</p>
              <p className="text-slate-500 text-sm mt-2">Express what words can't</p>
            </div>
          )}
        </motion.div>

        {/* Privacy Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-slate-800/20 border border-slate-700/30 rounded-2xl"
        >
          <p className="text-slate-400 text-sm text-center">
            Your post will expire in 24 hours. All souls remain anonymous.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
