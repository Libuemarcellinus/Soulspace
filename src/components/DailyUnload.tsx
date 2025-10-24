import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface DailyUnloadProps {
  navigateTo: (screen: string) => void;
}

const prompts = [
  "What's weighing on your soul today?",
  "If you could tell the world one thing without judgment, what would it be?",
  "What emotion are you tired of carrying?",
  "What small moment brought you peace today?",
  "What do you wish someone would ask you?",
  "What truth have you been avoiding?",
  "What would you tell your younger self right now?",
];

export default function DailyUnload({ navigateTo }: DailyUnloadProps) {
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);
  const [response, setResponse] = useState('');

  const getNewPrompt = () => {
    const newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(newPrompt);
  };

  const handleSubmit = () => {
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

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <Button
            variant="outline"
            onClick={() => navigateTo('home')}
            className="flex-1 border-slate-600 text-slate-400 hover:text-slate-200"
          >
            Save Privately
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!response.trim()}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            <Send className="w-4 h-4 mr-2" />
            Share with Souls
          </Button>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-slate-800/20 border border-slate-700/30 rounded-2xl"
        >
          <p className="text-slate-400 text-sm text-center">
            Your daily unload helps you process emotions and connect with others who understand. 
            All shares remain anonymous and expire in 24 hours.
          </p>
        </motion.div>

        {/* Streak Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-slate-500 text-sm">
            🔥 You've unloaded for <span className="text-orange-400">7 days</span> in a row
          </p>
        </motion.div>
      </div>
    </div>
  );
}
