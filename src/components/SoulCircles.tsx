import { motion } from 'motion/react';
import { ArrowLeft, Users, TrendingUp, Heart, Ghost, Compass, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApi } from '../hooks/useApi';
import { circlesApi } from '../lib/api';
import { mockCircles, mapApiCircle } from '../lib/mockData';
import ReconnectingBanner from './ReconnectingBanner';

interface SoulCirclesProps {
  navigateTo: (screen: string, data?: any) => void;
}

export default function SoulCircles({ navigateTo }: SoulCirclesProps) {
  const { data: rawCircles, isLoading, error } = useApi(() => circlesApi.getActive(), []);
  const isFallback = !isLoading && error !== null;
  const circlesArray = Array.isArray(rawCircles) ? rawCircles : null;
  const circles = (circlesArray ?? (isFallback ? mockCircles : [])).map(mapApiCircle);

  const trendingCircle = circles[1] ?? circles[0];

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
        {isLoading && !isFallback ? (
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
            <div className="w-full bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 animate-pulse h-32" />
          </motion.div>
        ) : trendingCircle ? (
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
              onClick={() => navigateTo('circle-feed', { circle: trendingCircle })}
              className={`w-full ${trendingCircle.gradient} border-2 ${trendingCircle.border} rounded-3xl p-6 hover:border-opacity-50 transition-all text-left`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${trendingCircle.color} flex items-center justify-center`}>
                    {(() => { const Icon = trendingCircle.icon; return <Icon className="w-6 h-6 text-white" />; })()}
                  </div>
                  <div>
                    <h3 className="text-slate-100 mb-1">{trendingCircle.name}</h3>
                    <p className="text-slate-400 text-sm">{trendingCircle.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-400">
                  <Users className="w-4 h-4 inline mr-1" />
                  {trendingCircle.members} souls
                </span>
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  {trendingCircle.activeNow} active now
                </Badge>
              </div>
            </button>
          </motion.div>
        ) : null}

        {/* All Circles */}
        <div className="space-y-4">
          <h2 className="text-slate-300 mb-4">All Circles</h2>

          {isLoading && !isFallback
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 animate-pulse h-20"
                />
              ))
            : circles.map((circle, index) => {
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
