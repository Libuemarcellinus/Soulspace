import { useState } from 'react';
import { motion } from 'motion/react';
import { Ghost, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
  navigateTo: (screen: string) => void;
}

export default function Register({ navigateTo }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, login } = useAuth();

  const handleSubmit = async () => {
    if (!username.trim() || !code.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await register(username.trim(), code.trim());
      navigateTo('home');
    } catch {
      try {
        await login(username.trim(), code.trim());
        navigateTo('home');
      } catch {
        setError('Could not sign in. Check your soul name and code.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 left-6 z-10"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateTo('onboarding-new')}
          className="text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </motion.div>

      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full text-center"
        >
          {/* Icon */}
          <motion.div
            animate={{ y: [0, -10, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mx-auto mb-12"
          >
            <Ghost className="w-16 h-16 text-purple-400" />
          </motion.div>

          {/* Title */}
          <div className="mb-4">
            <h1 className="text-slate-100 text-3xl mb-2">Become a Ghost.</h1>
            <h2 className="text-slate-100 text-3xl">Stay anonymous.</h2>
          </div>

          {/* Subtitle */}
          <p className="text-slate-400 leading-relaxed mb-8">
            Choose a soul name and a secret code. No email. No real name. Just you.
          </p>

          {/* Form */}
          <div className="space-y-3 text-left">
            <Input
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="Soul name"
              className="bg-slate-800/60 border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus:border-purple-500/50 h-14 rounded-2xl text-base"
            />
            <Input
              type="password"
              value={code}
              onChange={e => { setCode(e.target.value); setError(''); }}
              placeholder="Code"
              className="bg-slate-800/60 border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus:border-purple-500/50 h-14 rounded-2xl text-base"
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center pt-1"
              >
                {error}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom */}
      <div className="px-6 pb-12">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-14 text-lg shadow-lg shadow-purple-500/50 disabled:opacity-50"
        >
          <Ghost className="w-5 h-5 mr-2" />
          {isLoading ? 'Entering…' : 'Enter as a Ghost'}
        </Button>
        <p className="text-slate-500 text-sm text-center mt-4">
          Already a ghost? Use your soul name and code to sign back in.
        </p>
      </div>
    </div>
  );
}
