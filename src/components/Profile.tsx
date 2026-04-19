import { motion } from 'motion/react';
import { ArrowLeft, Ghost, Settings as SettingsIcon, Flame, Heart, MessageCircle, TrendingUp, Shield, User, Compass, Clock, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { soulsApi } from '../lib/api';
import { mockSouls, mapApiSoul } from '../lib/mockData';
import ReconnectingBanner from './ReconnectingBanner';

interface ProfileProps {
  navigateTo: (screen: string, data?: any) => void;
}

const badges = [
  { id: 1, name: 'Kind Soul', icon: '💜', description: 'Shared empathy 100 times' },
  { id: 2, name: 'Night Owl', icon: '🌙', description: 'Posted during late hours' },
  { id: 3, name: 'Listener', icon: '👂', description: 'Replied to 50 souls' },
  { id: 4, name: 'Vulnerable', icon: '🌸', description: 'Share 10 deep thoughts' },
  { id: 5, name: 'Circle Leader', icon: '⭐', description: 'Active in 5 circles' },
  { id: 6, name: 'Healer', icon: '✨', description: 'Help 1000 souls' },
];

export default function Profile({ navigateTo }: ProfileProps) {
  const { user } = useAuth();
  const { data: rawSouls, isLoading, error } = useApi(() => soulsApi.getPrivate(), []);
  const isFallback = !isLoading && error !== null;
  const soulsArray = Array.isArray(rawSouls) ? rawSouls : null;
  const mySouls = (soulsArray ?? (isFallback ? mockSouls.slice(0, 3) : [])).map(mapApiSoul);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pb-24">
      <ReconnectingBanner show={isFallback} />

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
            <h1 className="text-slate-100">Ghost Mode</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateTo('settings')}
              className="text-slate-400 hover:text-purple-400"
            >
              <SettingsIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Ghost Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-500/50 flex items-center justify-center mb-4">
            <Ghost className="w-16 h-16 text-purple-400" />
          </div>
          <h2 className="text-slate-100 mb-2">
            {user ? user.username : 'Anonymous Soul'}
          </h2>
          <Badge variant="outline" className="text-purple-400 border-purple-500/30 bg-purple-500/10">
            <Shield className="w-3 h-3 mr-1" />
            Ghost Mode Active
          </Badge>
        </motion.div>

        {/* Stats Grid — real data not available yet, show '--' */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {[
            { label: 'Souls Touched', icon: Heart, color: 'text-pink-400' },
            { label: 'Echoes Shared', icon: MessageCircle, color: 'text-purple-400' },
            { label: 'Days Active', icon: Flame, color: 'text-orange-400' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-center"
              >
                <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className={`text-2xl ${stat.color} mb-1`}>--</div>
                <div className="text-slate-400 text-xs">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Current Streak — no real data yet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-slate-100 mb-1">Current Streak</h3>
              <p className="text-slate-400 text-sm">Keep sharing your soul</p>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-8 h-8 text-orange-400" />
              <span className="text-3xl text-orange-400">--</span>
            </div>
          </div>
        </motion.div>

        {/* Badges — all locked until backend provides badge data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-slate-300 mb-4">Achievements</h3>
          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="p-4 rounded-2xl border-2 text-center bg-slate-800/20 border-slate-700/30 opacity-50"
              >
                <div className="relative inline-block mb-2">
                  <span className="text-3xl">{badge.icon}</span>
                  <Lock className="w-3 h-3 text-slate-500 absolute -bottom-1 -right-1" />
                </div>
                <div className="text-sm mb-1 text-slate-500">{badge.name}</div>
                <div className="text-xs text-slate-600">{badge.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Your Souls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <h3 className="text-slate-300 mb-4">Your Souls</h3>
          {isLoading && !isFallback ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 animate-pulse h-20"
                />
              ))}
            </div>
          ) : mySouls.length === 0 ? (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 text-center">
              <Ghost className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No souls shared yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mySouls.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 cursor-pointer hover:border-slate-600/50 transition-all"
                  onClick={() => navigateTo('post-detail', { post })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className={`${post.moodColor} border-current/30 bg-current/10 text-xs`}>
                      {post.mood}
                    </Badge>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.empathy}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.replies}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
            <button
              onClick={() => navigateTo('mood-pulse')}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-purple-400 transition-colors"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Pulse</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-purple-400">
              <User className="w-6 h-6" />
              <span className="text-xs">Ghost</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
