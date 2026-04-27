import { motion } from 'motion/react';
import { ArrowLeft, Users, TrendingUp, Heart, Brain, Moon, Sunrise, Compass, User, Ghost } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface SoulCirclesProps {
  navigateTo: (screen: string, data?: any) => void;
}

const circles = [
  {
    id: 1,
    name: 'Anxiety & Peace',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    members: '12.4k',
    activeNow: 847,
    description: 'Finding calm in the storm',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20',
    border: 'border-purple-500/30'
  },
  {
    id: 2,
    name: 'Heartbreak Haven',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    members: '18.2k',
    activeNow: 1203,
    description: 'Healing broken hearts together',
    gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30'
  },
  {
    id: 3,
    name: 'Night Thoughts',
    icon: Moon,
    color: 'from-indigo-500 to-blue-500',
    members: '9.8k',
    activeNow: 654,
    description: '3 AM confessions',
    gradient: 'bg-gradient-to-br from-indigo-500/20 to-blue-500/20',
    border: 'border-indigo-500/30'
  },
  {
    id: 4,
    name: 'New Beginnings',
    icon: Sunrise,
    color: 'from-emerald-500 to-teal-500',
    members: '15.6k',
    activeNow: 923,
    description: 'Starting over, starting fresh',
    gradient: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30'
  },
  {
    id: 5,
    name: 'Lost & Found',
    icon: Compass,
    color: 'from-blue-500 to-cyan-500',
    members: '11.3k',
    activeNow: 701,
    description: 'Finding your way',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30'
  },
  {
    id: 6,
    name: 'Self-Discovery',
    icon: User,
    color: 'from-violet-500 to-purple-500',
    members: '14.7k',
    activeNow: 892,
    description: 'Journey within',
    gradient: 'bg-gradient-to-br from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/30'
  }
];

export default function SoulCircles({ navigateTo }: SoulCirclesProps) {
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
            <h1 className="text-slate-100">Soul Circles</h1>
            <div className="w-10" />
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="text-slate-300 text-center mb-2">
            Find your tribe, share your truth
          </p>
          <p className="text-slate-500 text-sm text-center">
            Join circles of souls experiencing similar emotions
          </p>
        </motion.div>

        {/* Trending Circle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400 text-sm">Trending Now</span>
          </div>
          <button
            onClick={() => navigateTo('circle-feed', { circle: circles[1] })}
            className="w-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-2 border-pink-500/30 rounded-3xl p-6 hover:border-pink-400/50 transition-all text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-slate-100 mb-1">Heartbreak Haven</h3>
                  <p className="text-slate-400 text-sm">Healing broken hearts together</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-400">
                <Users className="w-4 h-4 inline mr-1" />
                {circles[1].members} souls
              </span>
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                {circles[1].activeNow} active now
              </Badge>
            </div>
          </button>
        </motion.div>

        {/* All Circles */}
        <div className="space-y-4">
          <h2 className="text-slate-300 mb-4">All Circles</h2>
          
          {circles.map((circle, index) => {
            const Icon = circle.icon;
            return (
              <motion.button
                key={circle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={() => navigateTo('circle-feed', { circle })}
                className={`w-full ${circle.gradient} border ${circle.border} rounded-2xl p-4 hover:border-opacity-50 transition-all text-left`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${circle.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-slate-100 mb-1">{circle.name}</h3>
                      <p className="text-slate-400 text-sm">{circle.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm mt-3">
                  <span className="text-slate-400">
                    <Users className="w-3 h-3 inline mr-1" />
                    {circle.members}
                  </span>
                  <span className="text-emerald-400">
                    {circle.activeNow} active
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
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
            <button className="flex flex-col items-center gap-1 text-purple-400">
              <Compass className="w-6 h-6" />
              <span className="text-xs">Circles</span>
            </button>
            <button
              onClick={() => navigateTo('mood-pulse')}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-purple-400 transition-colors"
            >
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
