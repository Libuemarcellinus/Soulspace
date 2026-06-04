import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface UsernameScreenProps {
  navigateTo: (screen: string, data?: any) => void;
  mood?: string;
}

const moodWords = {
  calm: ['Breeze', 'Wave', 'Moon', 'Leaf'],
  hopeful: ['Star', 'Glow', 'Nebula', 'Echo'],
  reflective: ['Moon', 'Echo', 'Wave', 'Leaf'],
  joyful: ['Glow', 'Star', 'Breeze', 'Nebula']
};

const moodEmojis: Record<string, string> = {
  calm: '🌊',
  hopeful: '🌟',
  reflective: '🌙',
  joyful: '✨'
};

const moodColors: Record<string, string> = {
  calm: 'from-blue-400 to-cyan-400',
  hopeful: 'from-emerald-400 to-teal-400',
  reflective: 'from-purple-400 to-indigo-400',
  joyful: 'from-pink-400 to-rose-400'
};

const generateUsername = (mood: string) => {
  const words = moodWords[mood as keyof typeof moodWords] || moodWords.hopeful;
  const word = words[Math.floor(Math.random() * words.length)];
  const number = Math.floor(Math.random() * 90) + 10;
  const moodCapitalized = mood.charAt(0).toUpperCase() + mood.slice(1);
  return `${moodCapitalized}${word}${number}`;
};

export default function UsernameScreen({ navigateTo, mood = 'hopeful' }: UsernameScreenProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    generateSuggestions();
  }, []);

  const generateSuggestions = () => {
    setSuggestions([
      generateUsername(mood),
      generateUsername(mood),
      generateUsername(mood)
    ]);
  };

  const handlePick = (username: string) => {
    navigateTo('code', { mood, username });
  };

  const handleCustomSubmit = () => {
    if (customInput.length >= 3 && customInput.length <= 15) {
      const randomNumber = Math.floor(Math.random() * 90) + 10;
      const finalUsername = `${customInput}${randomNumber}`;
      handlePick(finalUsername);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6 py-8 flex flex-col max-w-[390px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-5xl mb-4">{moodEmojis[mood]}</div>
        <h1 className="text-slate-100 mb-2">You picked {mood.charAt(0).toUpperCase() + mood.slice(1)}!</h1>
        <p className="text-slate-400 text-sm">Pick a nickname</p>
      </motion.div>

      {/* Pattern Explanation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl"
      >
        <p className="text-slate-400 text-sm text-center">
          Format: <span className={`bg-gradient-to-r ${moodColors[mood]} bg-clip-text text-transparent`}>
            [Mood][Word][Number]
          </span>
        </p>
        <p className="text-slate-500 text-xs text-center mt-1">
          (e.g., HopefulBreeze17)
        </p>
      </motion.div>

      {/* Suggestions */}
      {!showCustom && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-300">Suggestions for you:</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateSuggestions}
              className="text-slate-400 hover:text-purple-400"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>

          <div className="space-y-3 mb-6">
            {suggestions.map((username, index) => (
              <motion.button
                key={`${username}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePick(username)}
                className="w-full min-h-[44px] p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-purple-500/50 hover:bg-slate-800/60 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <span className={`bg-gradient-to-r ${moodColors[mood]} bg-clip-text text-transparent`}>
                    {username}
                  </span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => setShowCustom(true)}
              className="w-full min-h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Make My Own
            </Button>
          </div>
        </motion.div>
      )}

      {/* Custom Input */}
      {showCustom && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1"
        >
          <p className="text-slate-300 mb-4">Create your own nickname:</p>
          
          <Input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value.slice(0, 15))}
            placeholder="Enter 3-15 characters"
            className="mb-2 bg-slate-800/40 border-slate-700/50 text-slate-100 placeholder:text-slate-500"
            maxLength={15}
          />
          
          <p className="text-slate-500 text-xs mb-6">
            {customInput.length}/15 characters • A number will be added (e.g., {customInput || 'Sky'}17)
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleCustomSubmit}
              disabled={customInput.length < 3}
              className="w-full min-h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
            >
              Continue
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCustom(false)}
              className="w-full min-h-[44px] border-slate-600 text-slate-300 hover:bg-slate-800/40"
            >
              Back to Suggestions
            </Button>
          </div>
        </motion.div>
      )}

      {/* Help Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
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
