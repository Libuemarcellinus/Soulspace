import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Sparkles, Lock, AlertCircle, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../context/AuthContext';

interface OnboardingNewProps {
  navigateTo: (screen: string, data?: any) => void;
}

const moods = [
  { id: 'calm', label: 'Calm', emoji: '🌊', color: 'from-blue-400 to-cyan-400' },
  { id: 'hopeful', label: 'Hopeful', emoji: '🌟', color: 'from-emerald-400 to-teal-400' },
  { id: 'reflective', label: 'Reflective', emoji: '🌙', color: 'from-purple-400 to-indigo-400' },
  { id: 'joyful', label: 'Joyful', emoji: '✨', color: 'from-pink-400 to-rose-400' }
];

const moodWords: Record<string, string[]> = {
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
  const words = moodWords[mood] || moodWords.hopeful;
  const word = words[Math.floor(Math.random() * words.length)];
  const number = Math.floor(Math.random() * 90) + 10;
  const moodCapitalized = mood.charAt(0).toUpperCase() + mood.slice(1);
  return `${moodCapitalized}${word}${number}`;
};

const samplePosts = [
  { mood: 'Hopeful', emoji: '🌟', text: "Today's looking brighter!" },
  { mood: 'Reflective', emoji: '🌙', text: "Thinking about what really matters in life." },
  { mood: 'Calm', emoji: '🌊', text: "Found peace in the small moments today." }
];

export default function OnboardingNew({ navigateTo }: OnboardingNewProps) {
  const [step, setStep] = useState(1); // 1: Welcome, 2: Username, 3: Code, 4: Browse Intro
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, login } = useAuth();

  useEffect(() => {
    if (step === 2 && selectedMood) {
      generateSuggestions();
    }
  }, [step, selectedMood]);

  const generateSuggestions = () => {
    if (selectedMood) {
      setSuggestions([
        generateUsername(selectedMood),
        generateUsername(selectedMood),
        generateUsername(selectedMood)
      ]);
    }
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setTimeout(() => {
      setStep(2);
    }, 300);
  };

  const handlePickUsername = (pickedUsername: string) => {
    setUsername(pickedUsername);
    setStep(3);
  };

  const handleCustomSubmit = () => {
    if (customInput.length >= 3 && customInput.length <= 15) {
      const randomNumber = Math.floor(Math.random() * 90) + 10;
      const finalUsername = `${customInput}${randomNumber}`;
      handlePickUsername(finalUsername);
    }
  };

  const handleCodeChange = (value: string) => {
    const alphanumeric = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    setCode(alphanumeric.slice(0, 6));
    setError('');
  };

  const handleCodeContinue = async () => {
    if (code.length < 3) {
      setError('Code must be at least 3 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');
    let registerError: Error | null = null;
    try {
      await register(username, code);
      setStep(4);
      setIsSubmitting(false);
      return;
    } catch (e) {
      registerError = e instanceof Error ? e : new Error(String(e));
    }

    // Register failed — maybe this soul name already exists with this exact code
    try {
      await login(username, code);
      setStep(4);
    } catch (loginErr) {
      const regMsg = registerError?.message ?? '';
      const isTaken = /409|already|exist|taken/i.test(regMsg);
      const isNetwork = /fetch|network|connect/i.test(regMsg);
      if (isTaken) {
        setError('Soul name already claimed. Go back and pick a different one.');
      } else if (isNetwork) {
        setError('Cannot reach the server. Check your connection and try again.');
      } else {
        setError('Could not create your soul. Try a different name or code.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    navigateTo('home');
  };

  // STEP 1: WELCOME SCREEN
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-8 flex flex-col max-w-[390px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
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
                  <span className={`inline-block bg-gradient-to-r ${mood.color} bg-clip-text text-transparent`}>
                    {mood.label}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => navigateTo('register')}
            className="text-slate-500 text-sm hover:text-slate-400 transition-colors"
          >
            Already a ghost? Sign in
          </button>
        </motion.div>
      </div>
    );
  }

  // STEP 2: USERNAME SCREEN
  if (step === 2 && selectedMood) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-8 flex flex-col max-w-[390px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-4">{moodEmojis[selectedMood]}</div>
          <h1 className="text-slate-100 mb-2">You picked {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}!</h1>
          <p className="text-slate-400 text-sm">Pick a nickname</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl"
        >
          <p className="text-slate-400 text-sm text-center">
            Format: <span className={`inline-block bg-gradient-to-r ${moodColors[selectedMood]} bg-clip-text text-transparent`}>
              [Mood][Word][Number]
            </span>
          </p>
          <p className="text-slate-500 text-xs text-center mt-1">
            (e.g., HopefulBreeze17)
          </p>
        </motion.div>

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
              {suggestions.map((suggestedUsername, index) => (
                <motion.button
                  key={`${suggestedUsername}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePickUsername(suggestedUsername)}
                  className="w-full min-h-[44px] p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-purple-500/50 hover:bg-slate-800/60 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className={`inline-block bg-gradient-to-r ${moodColors[selectedMood]} bg-clip-text text-transparent`}>
                      {suggestedUsername}
                    </span>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                </motion.button>
              ))}
            </div>

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
      </div>
    );
  }

  // STEP 3: CODE SCREEN
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-8 flex flex-col max-w-[390px] mx-auto">
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl text-center"
        >
          <p className="text-slate-500 text-sm mb-1">Your nickname:</p>
          <p className="text-slate-100">{username}</p>
        </motion.div>

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

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 space-y-2"
            >
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
              {error.includes('Go back') && (
                <button
                  onClick={() => { setError(''); setStep(2); }}
                  className="w-full text-slate-400 text-sm hover:text-purple-400 transition-colors py-1"
                >
                  ← Pick a different soul name
                </button>
              )}
            </motion.div>
          )}

          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
            <p className="text-emerald-400 text-sm text-center">
              ✨ No reset needed! Remember this code to log back in.
            </p>
          </div>

          <Button
            onClick={handleCodeContinue}
            disabled={code.length < 3 || isSubmitting}
            className="w-full min-h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating your soul…' : 'Continue'}
          </Button>
        </motion.div>
      </div>
    );
  }

  // STEP 4: BROWSE INTRO SCREEN
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-8 flex flex-col max-w-[390px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-4">😊</div>
          <h1 className="text-slate-100 mb-2">Hi {username}!</h1>
          <p className="text-slate-400">Explore stories from souls like you</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 mb-6"
        >
          <p className="text-slate-300 mb-4 text-sm">Recent stories:</p>

          <div className="space-y-3 mb-8">
            {samplePosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{post.emoji}</span>
                  <span className="text-slate-400 text-sm">{post.mood} user</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed">"{post.text}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Button
            onClick={handleComplete}
            className="w-full min-h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Browse Stories
          </Button>
        </motion.div>
      </div>
    );
  }

  return null;
}
