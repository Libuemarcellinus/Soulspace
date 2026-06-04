import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface WelcomeScreenProps {
  navigateTo: (screen: string, data?: any) => void;
}

const moods = [
  { id: 'calm', label: 'Calm', emoji: '🌊', color: 'from-blue-400 to-cyan-400' },
  { id: 'hopeful', label: 'Hopeful', emoji: '🌟', color: 'from-emerald-400 to-teal-400' },
  { id: 'reflective', label: 'Reflective', emoji: '🌙', color: 'from-purple-400 to-indigo-400' },
  { id: 'joyful', label: 'Joyful', emoji: '✨', color: 'from-pink-400 to-rose-400' }
];

export default function WelcomeScreen({ navigateTo }: WelcomeScreenProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setTimeout(() => {
      navigateTo('username', { mood: moodId });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6 py-8 flex flex-col max-w-[390px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="text-6xl mb-4"
        >
          🌟
        </motion.div>
        <h1 className="text-slate-100 text-2xl mb-2">Welcome to Soulspace!</h1>
        <p className="text-slate-400">Share anonymously.</p>
      </motion.div>

      {/* Mood Selection */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-300 text-center mb-6"
        >
          How are you feeling today?
        </motion.p>

        <div className="grid grid-cols-2 gap-4">
          {moods.map((mood, index) => (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodSelect(mood.id)}
              className={`min-h-[44px] p-4 rounded-2xl border-2 transition-all ${
                selectedMood === mood.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">{mood.emoji}</span>
                <span className={`bg-gradient-to-r ${mood.color} bg-clip-text text-transparent`}>
                  {mood.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

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
