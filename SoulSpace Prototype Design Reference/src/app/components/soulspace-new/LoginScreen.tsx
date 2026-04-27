import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface LoginScreenProps {
  navigateTo: (screen: string, data?: any) => void;
}

export default function LoginScreen({ navigateTo }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleCodeChange = (value: string) => {
    const alphanumeric = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    setCode(alphanumeric.slice(0, 6));
    setError('');
  };

  const handleLogin = () => {
    if (!username || code.length < 3) {
      setError('Please enter your nickname and code');
      return;
    }

    // Simulate login success
    navigateTo('browse-returning', { username, mood: 'hopeful' });
  };

  const handleNewNickname = () => {
    navigateTo('welcome');
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
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="text-6xl mb-4"
        >
          😊
        </motion.div>
        <h1 className="text-slate-100 mb-2">Welcome back!</h1>
        <p className="text-slate-400">Log in to continue your journey</p>
      </motion.div>

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1"
      >
        {/* Username Input */}
        <div className="mb-4">
          <label className="text-slate-300 mb-2 block text-sm">Your nickname</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., HopefulStar17"
            className="bg-slate-800/40 border-slate-700/50 text-slate-100 placeholder:text-slate-500"
          />
        </div>

        {/* Code Input */}
        <div className="mb-6">
          <label className="text-slate-300 mb-2 block text-sm">Enter your code:</label>
          <Input
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="3-6 characters"
            className="bg-slate-800/40 border-slate-700/50 text-slate-100 text-center text-xl tracking-widest placeholder:text-slate-500 placeholder:tracking-normal placeholder:text-base"
            maxLength={6}
          />
          <p className="text-slate-500 text-xs mt-2">
            {code.length}/6 characters
          </p>
        </div>

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

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            onClick={handleLogin}
            className="w-full min-h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Log In
          </Button>

          <Button
            variant="outline"
            onClick={handleNewNickname}
            className="w-full min-h-[44px] border-slate-600 text-slate-300 hover:bg-slate-800/40"
          >
            Forgot Code? Create New Nickname
          </Button>
        </div>

        {/* Info */}
        <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
          <p className="text-slate-400 text-sm text-center">
            💡 Don't remember your code? You can create a new nickname instead.
          </p>
        </div>
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
