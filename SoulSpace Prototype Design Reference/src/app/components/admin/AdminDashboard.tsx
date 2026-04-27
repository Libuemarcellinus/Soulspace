import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, AlertCircle, Trash2, Circle, Smile, UserX } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../ui/skeleton';

const stats = [
  { id: 'total-souls', label: 'Total Souls', value: 12453, icon: MessageSquare, color: 'from-blue-400 to-cyan-400' },
  { id: 'reported-souls', label: 'Reported Souls', value: 23, icon: AlertCircle, color: 'from-yellow-400 to-orange-400' },
  { id: 'removed-souls', label: 'Removed Souls', value: 87, icon: Trash2, color: 'from-red-400 to-pink-400' },
  { id: 'total-circles', label: 'Total Circles', value: 8, icon: Circle, color: 'from-purple-400 to-indigo-400' },
  { id: 'total-moods', label: 'Total Moods', value: 12, icon: Smile, color: 'from-emerald-400 to-teal-400' },
  { id: 'blocked-users', label: 'Blocked Users', value: 34, icon: UserX, color: 'from-rose-400 to-red-400' },
];

const moodData = [
  { mood: 'Calm', count: 3241 },
  { mood: 'Hopeful', count: 2876 },
  { mood: 'Reflective', count: 2654 },
  { mood: 'Joyful', count: 2123 },
  { mood: 'Anxious', count: 987 },
  { mood: 'Sad', count: 572 },
];

const recentSouls = [
  { id: 1, mood: 'Calm', content: 'Finally found peace in the small moments. The sunset today reminded me that endings can be beautiful too.', date: '2 hours ago' },
  { id: 2, mood: 'Hopeful', content: 'Starting therapy next week. Scared but ready to heal.', date: '4 hours ago' },
  { id: 3, mood: 'Reflective', content: 'Been thinking about how much I\'ve grown this year. Proud of myself for not giving up.', date: '6 hours ago' },
  { id: 4, mood: 'Joyful', content: 'Got my dream job! All the hard work paid off. Feeling grateful.', date: '8 hours ago' },
  { id: 5, mood: 'Anxious', content: 'Interview tomorrow. Can\'t sleep. Keep replaying worst case scenarios in my head.', date: '10 hours ago' },
  { id: 6, mood: 'Sad', content: 'Miss my grandma every day. Wish I could call her one more time.', date: '12 hours ago' },
  { id: 7, mood: 'Calm', content: 'Meditation is really helping. Learning to sit with my thoughts without judgment.', date: '14 hours ago' },
  { id: 8, mood: 'Hopeful', content: 'Bad days don\'t last forever. Tomorrow is a new chance.', date: '16 hours ago' },
  { id: 9, mood: 'Reflective', content: 'Realized I don\'t need closure from people who don\'t care. My peace matters more.', date: '18 hours ago' },
  { id: 10, mood: 'Joyful', content: 'Laughed until I cried with my best friend today. These moments are everything.', date: '20 hours ago' },
];

const moodColors: Record<string, string> = {
  Calm: 'from-blue-400 to-cyan-400',
  Hopeful: 'from-emerald-400 to-teal-400',
  Reflective: 'from-purple-400 to-indigo-400',
  Joyful: 'from-pink-400 to-rose-400',
  Anxious: 'from-yellow-400 to-orange-400',
  Sad: 'from-slate-400 to-gray-400',
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2 bg-slate-700/50" />
          <Skeleton className="h-4 w-64 bg-slate-700/50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32 bg-slate-700/50 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 bg-slate-700/50 rounded-2xl" />
        <Skeleton className="h-96 bg-slate-700/50 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-slate-100 text-3xl mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview of SoulSpace platform metrics</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-slate-100 text-3xl">{stat.value.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mood Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
      >
        <h2 className="text-slate-100 text-xl mb-6">Mood Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
              <XAxis dataKey="mood" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  color: '#f1f5f9',
                }}
              />
              <Bar dataKey="count" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Souls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
      >
        <h2 className="text-slate-100 text-xl mb-6">Recent Souls</h2>
        <div className="space-y-3">
          {recentSouls.map((soul) => (
            <div
              key={soul.id}
              className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4 hover:border-slate-600/50 transition-all"
            >
              <div className="flex items-start gap-3">
                <span className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${moodColors[soul.mood]} bg-clip-text text-transparent font-medium border border-slate-600/30`}>
                  {soul.mood}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-sm line-clamp-2">{soul.content}</p>
                  <p className="text-slate-500 text-xs mt-2">{soul.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
