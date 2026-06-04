import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface ShareStoryProps {
  navigateTo: (screen: string, data?: any) => void;
  username?: string;
  mood?: string;
}

const moods = [
  { id: 'calm', label: 'Calm', emoji: '🌊' },
  { id: 'hopeful', label: 'Hopeful', emoji: '🌟' },
  { id: 'reflective', label: 'Reflective', emoji: '🌙' },
  { id: 'joyful', label: 'Joyful', emoji: '✨' }
];

export default function ShareStory({ navigateTo, username = 'HopefulStar17', mood = 'hopeful' }: ShareStoryProps) {
  const [selectedMood, setSelectedMood] = useState(mood);
  const [content, setContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleContentChange = (value: string) => {
    if (value.length <= maxChars) {
      setContent(value);
      setCharCount(value.length);
    }
  };

  const handleShare = () => {
    if (content.trim()) {
      // Simulate sharing
      setTimeout(() => {
        navigateTo('browse', { username, mood: selectedMood });
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6 py-8 flex flex-col max-w-[390px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateTo('browse', { username, mood })}
          className="text-slate-400 hover:text-slate-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-slate-100">Share Your Story</h1>
        <div className="w-10" />
      </motion.div>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl"
      >
        <p className="text-slate-500 text-sm mb-1">Posting as:</p>
        <p className="text-slate-100">{username}</p>
      </motion.div>

      {/* Mood Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <label className="text-slate-300 mb-3 block text-sm">How are you feeling?</label>
        <div className="grid grid-cols-2 gap-3">
          {moods.map((moodOption) => (
            <button
              key={moodOption.id}
              onClick={() => setSelectedMood(moodOption.id)}
              className={`min-h-[44px] p-3 rounded-xl border-2 transition-all ${
                selectedMood === moodOption.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{moodOption.emoji}</span>
                <span className="text-slate-300 text-sm">{moodOption.label}</span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content Input */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex-1 mb-6"
      >
        <label className="text-slate-300 mb-2 block text-sm">Your story:</label>
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Share what's on your mind... (text only)"
          className="min-h-[200px] bg-slate-800/40 border-slate-700/50 text-slate-100 placeholder:text-slate-500 resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-slate-500 text-xs">Text only, no images</p>
          <p className={`text-xs ${charCount > maxChars * 0.9 ? 'text-amber-400' : 'text-slate-500'}`}>
            {charCount}/{maxChars}
          </p>
        </div>
      </motion.div>

      {/* Share Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <Button
          onClick={handleShare}
          disabled={!content.trim()}
          className="w-full min-h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
        >
          <Send className="w-5 h-5 mr-2" />
          Share Story
        </Button>

        {/* Info */}
        <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl">
          <p className="text-slate-400 text-xs text-center">
            ✨ Your story will be shared anonymously with the Soulspace community
          </p>
        </div>
      </motion.div>

      {/* Help Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <Button
          variant="ghost"
          className="w-full text-slate-400 hover:text-slate-300"
          onClick={() => navigateTo('help')}
        >
          Need Help?
        </Button>
      </motion.div>
    </div>
  );
}
