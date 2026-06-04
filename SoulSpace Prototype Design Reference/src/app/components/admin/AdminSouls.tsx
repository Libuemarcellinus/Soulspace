import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trash2, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

const allSouls = [
  { id: 1, mood: 'Calm', content: 'Finally found peace in the small moments. The sunset today reminded me that endings can be beautiful too.', date: '2 hours ago', reported: false },
  { id: 2, mood: 'Hopeful', content: 'Starting therapy next week. Scared but ready to heal.', date: '4 hours ago', reported: false },
  { id: 3, mood: 'Reflective', content: 'Been thinking about how much I\'ve grown this year. Proud of myself for not giving up.', date: '6 hours ago', reported: false },
  { id: 4, mood: 'Joyful', content: 'Got my dream job! All the hard work paid off. Feeling grateful.', date: '8 hours ago', reported: false },
  { id: 5, mood: 'Anxious', content: 'This is spam content that violates community guidelines.', date: '10 hours ago', reported: true },
  { id: 6, mood: 'Sad', content: 'Miss my grandma every day. Wish I could call her one more time.', date: '12 hours ago', reported: false },
  { id: 7, mood: 'Calm', content: 'Inappropriate content that should be removed.', date: '14 hours ago', reported: true },
  { id: 8, mood: 'Hopeful', content: 'Bad days don\'t last forever. Tomorrow is a new chance.', date: '16 hours ago', reported: false },
];

const removedSouls = [
  { id: 101, mood: 'Anxious', content: 'Spam content that was removed by moderators.', date: 'Removed 1 day ago', reported: true },
  { id: 102, mood: 'Sad', content: 'Inappropriate content violating community guidelines.', date: 'Removed 2 days ago', reported: true },
  { id: 103, mood: 'Reflective', content: 'Content removed due to multiple reports.', date: 'Removed 3 days ago', reported: true },
];

const moodColors: Record<string, string> = {
  Calm: 'from-blue-400 to-cyan-400',
  Hopeful: 'from-emerald-400 to-teal-400',
  Reflective: 'from-purple-400 to-indigo-400',
  Joyful: 'from-pink-400 to-rose-400',
  Anxious: 'from-yellow-400 to-orange-400',
  Sad: 'from-slate-400 to-gray-400',
};

export default function AdminSouls() {
  const [isLoading, setIsLoading] = useState(true);
  const [souls, setSouls] = useState(allSouls);
  const [removed, setRemoved] = useState(removedSouls);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveSoul = (id: number) => {
    const soul = souls.find(s => s.id === id);
    if (soul) {
      setSouls(souls.filter(s => s.id !== id));
      setRemoved([{ ...soul, date: 'Removed just now' }, ...removed]);
    }
  };

  const reportedSouls = souls.filter(s => s.reported);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-slate-700/50" />
        <Skeleton className="h-12 w-full bg-slate-700/50 rounded-xl" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-24 bg-slate-700/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-slate-100 text-3xl mb-2">Souls Management</h1>
        <p className="text-slate-400">Manage posts across the platform</p>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
            All ({souls.length})
          </TabsTrigger>
          <TabsTrigger value="reported" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
            Reported ({reportedSouls.length})
          </TabsTrigger>
          <TabsTrigger value="removed" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
            Removed ({removed.length})
          </TabsTrigger>
        </TabsList>

        {/* All Souls */}
        <TabsContent value="all" className="mt-6">
          {souls.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
              <div className="text-slate-500 text-4xl mb-4">💭</div>
              <h3 className="text-slate-300 mb-2">No souls yet</h3>
              <p className="text-slate-500 text-sm">Posts will appear here when users start sharing</p>
            </div>
          ) : (
            <div className="space-y-3">
              {souls.map((soul, index) => (
                <motion.div
                  key={soul.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${moodColors[soul.mood]} bg-clip-text text-transparent font-medium border border-slate-600/30 whitespace-nowrap`}>
                      {soul.mood}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-sm mb-2">{soul.content}</p>
                      <p className="text-slate-500 text-xs">{soul.date}</p>
                    </div>
                    {soul.reported && (
                      <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Reported Souls */}
        <TabsContent value="reported" className="mt-6">
          {reportedSouls.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
              <div className="text-slate-500 text-4xl mb-4">✅</div>
              <h3 className="text-slate-300 mb-2">No reported souls</h3>
              <p className="text-slate-500 text-sm">Reported posts will appear here for review</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reportedSouls.map((soul, index) => (
                <motion.div
                  key={soul.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-800/40 backdrop-blur-xl border border-yellow-600/30 rounded-xl p-4 hover:border-yellow-600/50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${moodColors[soul.mood]} bg-clip-text text-transparent font-medium border border-slate-600/30 whitespace-nowrap`}>
                      {soul.mood}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-sm mb-2">{soul.content}</p>
                      <p className="text-slate-500 text-xs">{soul.date}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveSoul(soul.id)}
                      className="flex-shrink-0 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Removed Souls */}
        <TabsContent value="removed" className="mt-6">
          {removed.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
              <div className="text-slate-500 text-4xl mb-4">🗑️</div>
              <h3 className="text-slate-300 mb-2">No removed souls</h3>
              <p className="text-slate-500 text-sm">Removed posts will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {removed.map((soul, index) => (
                <motion.div
                  key={soul.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-800/40 backdrop-blur-xl border border-red-600/30 rounded-xl p-4 opacity-60"
                >
                  <div className="flex items-start gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${moodColors[soul.mood]} bg-clip-text text-transparent font-medium border border-slate-600/30 whitespace-nowrap`}>
                      {soul.mood}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-400 text-sm mb-2 line-through">{soul.content}</p>
                      <p className="text-slate-500 text-xs">{soul.date}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
