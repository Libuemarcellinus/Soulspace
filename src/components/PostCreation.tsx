import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Type, Mic, Palette, Send, Smile, Frown, Meh, Heart, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

interface PostCreationProps {
  navigateTo: (screen: string) => void;
}

const moods = [
  { id: 'anxious', label: 'Anxious', icon: Frown, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'hopeful', label: 'Hopeful', icon: Smile, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'overwhelmed', label: 'Overwhelmed', icon: Zap, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'grateful', label: 'Grateful', icon: Heart, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'lonely', label: 'Lonely', icon: Meh, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { id: 'neutral', label: 'Just Existing', icon: Meh, color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
];

export default function PostCreation({ navigateTo }: PostCreationProps) {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'doodle'>('text');

  const handlePost = () => {
    // Simulate posting
    setTimeout(() => navigateTo('home'), 500);
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
              <X className="w-6 h-6" />
            </Button>
            <h1 className="text-slate-100">Share Your Soul</h1>
            <Button
              onClick={handlePost}
              disabled={!content.trim() || !selectedMood}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              Post
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-slate-300 mb-3">How are you feeling?</label>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {moods.map((mood) => {
              const Icon = mood.icon;
              return (
                <motion.button
                  key={mood.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedMood === mood.id
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

        {/* Input Mode Toggle */}
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

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {inputMode === 'text' && (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Pour your heart out... Your words are safe here."
              className="min-h-[300px] bg-slate-800/40 border-slate-700/50 text-slate-200 placeholder:text-slate-500 rounded-3xl resize-none focus:border-purple-500/50"
            />
          )}

          {inputMode === 'voice' && (
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

          {inputMode === 'doodle' && (
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
