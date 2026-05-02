import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, Sparkles, RefreshCw, Meh } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { dailyApi, moodsApi, soulsApi } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { mockMoods, mapApiMood } from '../lib/mockData';

interface DailyUnloadProps {
  navigateTo: (screen: string) => void;
}

const localPrompts = [
  "What's weighing on your soul today?",
  "If you could tell the world one thing without judgment, what would it be?",
  "What emotion are you tired of carrying?",
  "What small moment brought you peace today?",
  "What do you wish someone would ask you?",
  "What truth have you been avoiding?",
  "What would you tell your younger self right now?",
];

export default function DailyUnload({ navigateTo }: DailyUnloadProps) {
  const [promptId, setPromptId] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState(localPrompts[0]);
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMoodLabel, setSelectedMoodLabel] = useState<string | null>(null);

  const { data: rawMoods, isLoading: moodsLoading } = useApi(() => moodsApi.getActive(), []);
  const apiMoods = Array.isArray(rawMoods) && rawMoods.length > 0 ? rawMoods : null;
  const moods = (apiMoods ?? mockMoods).map(mapApiMood);
  const selectedMood = moods.find(m => m.label === selectedMoodLabel) ?? null;

  useEffect(() => {
    dailyApi.getPrompt()
      .then((data) => {
        setPromptId(data.id);
        setCurrentPrompt(data.prompt);
      })
      .catch(() => {
        // daily/prompt not available — use local prompts
        setCurrentPrompt(localPrompts[Math.floor(Math.random() * localPrompts.length)]);
      });
  }, []);

  const getNewPrompt = () => {
    if (promptId) {
      dailyApi.getPrompt()
        .then((data) => {
          setPromptId(data.id);
          setCurrentPrompt(data.prompt);
        })
        .catch(() => {
          setCurrentPrompt(localPrompts[Math.floor(Math.random() * localPrompts.length)]);
        });
    } else {
      setCurrentPrompt(localPrompts[Math.floor(Math.random() * localPrompts.length)]);
    }
  };

  const handleSave = async () => {
    if (!response.trim()) { navigateTo('home'); return; }
    if (promptId) {
      try { await dailyApi.submit(promptId, response.trim()); } catch { /* silent */ }
    }
    navigateTo('home');
  };

  const handleShare = async () => {
    if (!response.trim() || !selectedMood) return;
    setIsSubmitting(true);
    try {
      if (promptId) {
        await dailyApi.submit(promptId, response.trim()).catch(() => {});
      }
      await soulsApi.create(response.trim(), selectedMood.id);
      navigateTo('home');
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      toast.error(msg || 'Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              onClick={() => navigateTo('home')}
              className="text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-slate-100">Daily Unload</h1>
            <div className="w-10" />
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-slate-100 mb-2">Today's Sacred Space</h2>
          <p className="text-slate-400 text-sm">
            Take a moment to unload what you're carrying. This is your safe space.
          </p>
        </motion.div>

        {/* Daily Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-3xl p-8 mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-slate-400 text-sm mb-2">Today's Prompt</p>
              <motion.h3
                key={currentPrompt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-slate-100 text-xl"
              >
                {currentPrompt}
              </motion.h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={getNewPrompt}
              className="text-purple-400 hover:text-purple-300"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Response Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Let it all out... No one is judging. This is your moment."
            className="min-h-[300px] bg-slate-800/40 border-slate-700/50 text-slate-200 placeholder:text-slate-500 rounded-3xl resize-none focus:border-purple-500/50 mb-6"
            autoFocus
          />
        </motion.div>

        {/* Mood Picker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <label className="block text-slate-300 mb-3 text-sm">
            How are you feeling right now?
          </label>
          <div className="grid grid-cols-3 gap-3">
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

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          <Button
            variant="outline"
            onClick={handleSave}
            className="flex-1 border-slate-600 text-slate-400 hover:text-slate-200"
          >
            Save Privately
          </Button>
          <Button
            onClick={handleShare}
            disabled={!response.trim() || !selectedMood || isSubmitting || moodsLoading}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Sharing…' : moodsLoading ? 'Loading moods…' : 'Share with Souls'}
          </Button>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-slate-800/20 border border-slate-700/30 rounded-2xl"
        >
          <p className="text-slate-400 text-sm text-center">
            Your daily unload helps you process emotions and connect with others who understand.
            All shares remain anonymous and expire in 24 hours.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
