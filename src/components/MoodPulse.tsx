import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Ghost, Compass, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface MoodPulseProps {
  navigateTo: (screen: string) => void;
}

const globalMoods = [
  { mood: 'Hopeful', percentage: 32, trend: 'up', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  { mood: 'Anxious', percentage: 24, trend: 'down', color: 'bg-purple-500', textColor: 'text-purple-400' },
  { mood: 'Grateful', percentage: 18, trend: 'up', color: 'bg-pink-500', textColor: 'text-pink-400' },
  { mood: 'Overwhelmed', percentage: 15, trend: 'same', color: 'bg-blue-500', textColor: 'text-blue-400' },
  { mood: 'Lonely', percentage: 11, trend: 'down', color: 'bg-indigo-500', textColor: 'text-indigo-400' },
];

const timeData = [
  { time: '12am', anxiety: 45, hope: 20, lonely: 35 },
  { time: '3am', anxiety: 65, hope: 15, lonely: 55 },
  { time: '6am', anxiety: 35, hope: 30, lonely: 25 },
  { time: '9am', anxiety: 40, hope: 45, lonely: 20 },
  { time: '12pm', anxiety: 30, hope: 55, lonely: 15 },
  { time: '3pm', anxiety: 35, hope: 50, lonely: 20 },
  { time: '6pm', anxiety: 45, hope: 40, lonely: 30 },
  { time: '9pm', anxiety: 50, hope: 35, lonely: 40 },
];

export default function MoodPulse({ navigateTo }: MoodPulseProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pb-24">
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
            <h1 className="text-slate-100">Mood Pulse</h1>
            <div className="w-10" />
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <p className="text-slate-300 mb-2">Global emotional landscape</p>
          <p className="text-slate-500 text-sm">What the world is feeling right now</p>
        </motion.div>

        {/* Live Pulse Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-emerald-400"
              />
              <span className="text-slate-300">Live Pulse</span>
            </div>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
              <Activity className="w-3 h-3 mr-1" />
              84.2k souls active
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-4xl text-slate-100 mb-2">Hopeful</div>
            <p className="text-slate-400">is the dominant emotion right now</p>
          </div>
        </motion.div>

        {/* Mood Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-slate-300 mb-4">Current Distribution</h3>
          <div className="space-y-4">
            {globalMoods.map((item, index) => (
              <motion.div
                key={item.mood}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200">{item.mood}</span>
                    {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                    {item.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                  </div>
                  <span className={item.textColor}>{item.percentage}%</span>
                </div>
                <div className="h-2 bg-slate-800/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 24-Hour Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-slate-300 mb-4">24-Hour Emotional Wave</h3>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
            <div className="flex items-end justify-between h-48 gap-2">
              {timeData.map((data, index) => (
                <div key={data.time} className="flex-1 flex flex-col justify-end items-center gap-1">
                  <div className="w-full flex flex-col gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${data.hope}%` }}
                      transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                      className="w-full bg-emerald-500 rounded-t"
                      style={{ minHeight: '4px' }}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${data.anxiety}%` }}
                      transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                      className="w-full bg-purple-500"
                      style={{ minHeight: '4px' }}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${data.lonely}%` }}
                      transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                      className="w-full bg-indigo-500"
                      style={{ minHeight: '4px' }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 mt-2">{data.time}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-400">Hope</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-slate-400">Anxiety</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-slate-400">Lonely</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-slate-800/20 border border-slate-700/30 rounded-2xl"
        >
          <p className="text-slate-400 text-sm text-center">
            You're part of a global community. Your feelings matter, and you're never alone in them.
          </p>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-slate-900/90 border-t border-slate-800/50">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-around">
            <button
              onClick={() => navigateTo('home')}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-purple-400 transition-colors"
            >
              <Ghost className="w-6 h-6" />
              <span className="text-xs">Feed</span>
            </button>
            <button
              onClick={() => navigateTo('circles')}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-purple-400 transition-colors"
            >
              <Compass className="w-6 h-6" />
              <span className="text-xs">Circles</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-purple-400">
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Pulse</span>
            </button>
            <button
              onClick={() => navigateTo('profile')}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-purple-400 transition-colors"
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Ghost</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
