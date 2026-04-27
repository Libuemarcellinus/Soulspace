import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface CodeScreenProps {
  navigateTo: (screen: string, data?: any) => void;
  username?: string;
  mood?: string;
}

export default function CodeScreen({ navigateTo, username = 'HopefulStar17', mood = 'hopeful' }: CodeScreenProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleCodeChange = (value: string) => {
    const alphanumeric = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    setCode(alphanumeric.slice(0, 6));
    setError('');
  };

  const handleContinue = () => {
    if (code.length < 3) {
      setError('Code must be at least 3 characters');
      return;
    }

    // Simulate code check
    const takenCodes = ['ABC123', 'TEST', 'SUN123'];
    if (takenCodes.includes(code)) {
      setError('Code taken, try another.');
      return;
    }

    navigateTo('browse-intro', { username, mood, code });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6 py-8 flex flex-col max-w-[390px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mx-auto mb-4"
        >
          <Lock className="w-8 h-8 text-purple-400" />
        </motion.div>
        <h1 className="text-slate-100 mb-2">Create Your Code</h1>
        <p className="text-slate-400 text-sm">This keeps your account secure</p>
      </motion.div>

      {/* Username Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl text-center"
      >
        <p className="text-slate-500 text-sm mb-1">Your nickname:</p>
        <p className="text-slate-100">{username}</p>
      </motion.div>

      {/* Code Input */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex-1"
      >
        <label className="text-slate-300 mb-2 block">
          Pick a code (3-6 letters/numbers)
        </label>
        
        <Input
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="e.g., SUN123"
          className="mb-2 bg-slate-800/40 border-slate-700/50 text-slate-100 text-center text-xl tracking-widest placeholder:text-slate-500 placeholder:tracking-normal placeholder:text-base"
          maxLength={6}
        />
        
        <p className="text-slate-500 text-xs mb-6">
          {code.length}/6 characters • Letters and numbers only
        </p>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Info Box */}
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
          <p className="text-emerald-400 text-sm text-center">
            ✨ No reset needed! Remember this code to log back in.
          </p>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={code.length < 3}
          className="w-full min-h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
        >
          Continue
        </Button>
      </motion.div>

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
