import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';

interface Mood {
  id: number;
  name: string;
  icon: string;
  active: boolean;
}

const initialMoods: Mood[] = [
  { id: 1, name: 'Calm', icon: '🌊', active: true },
  { id: 2, name: 'Hopeful', icon: '🌟', active: true },
  { id: 3, name: 'Reflective', icon: '🌙', active: true },
  { id: 4, name: 'Joyful', icon: '✨', active: true },
  { id: 5, name: 'Anxious', icon: '😰', active: true },
  { id: 6, name: 'Sad', icon: '😢', active: true },
  { id: 7, name: 'Grateful', icon: '🙏', active: true },
  { id: 8, name: 'Peaceful', icon: '☮️', active: true },
  { id: 9, name: 'Energized', icon: '⚡', active: true },
  { id: 10, name: 'Overwhelmed', icon: '🌀', active: true },
  { id: 11, name: 'Content', icon: '😌', active: true },
  { id: 12, name: 'Curious', icon: '🔍', active: false },
];

export default function AdminMoods() {
  const [isLoading, setIsLoading] = useState(true);
  const [moods, setMoods] = useState<Mood[]>(initialMoods);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newMoodName, setNewMoodName] = useState('');
  const [newMoodIcon, setNewMoodIcon] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMoodStatus = (id: number) => {
    setMoods(moods.map(mood => 
      mood.id === id ? { ...mood, active: !mood.active } : mood
    ));
  };

  const handleCreateMood = () => {
    if (newMoodName && newMoodIcon) {
      const newMood: Mood = {
        id: Date.now(),
        name: newMoodName,
        icon: newMoodIcon,
        active: true,
      };
      setMoods([newMood, ...moods]);
      setNewMoodName('');
      setNewMoodIcon('');
      setIsCreateOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 bg-slate-700/50" />
          <Skeleton className="h-10 w-32 bg-slate-700/50 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Skeleton key={i} className="h-36 bg-slate-700/50 rounded-2xl" />
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-slate-100 text-3xl mb-2">Moods</h1>
          <p className="text-slate-400">Manage available mood tags</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Mood
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800/95 backdrop-blur-xl border-slate-700/50 text-slate-100">
            <DialogHeader>
              <DialogTitle>Create New Mood</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="mood-name">Mood Name</Label>
                <Input
                  id="mood-name"
                  placeholder="e.g., Inspired"
                  value={newMoodName}
                  onChange={(e) => setNewMoodName(e.target.value)}
                  className="bg-slate-900/50 border-slate-700/50 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mood-icon">Mood Icon (Emoji)</Label>
                <Input
                  id="mood-icon"
                  placeholder="e.g., 💡"
                  value={newMoodIcon}
                  onChange={(e) => setNewMoodIcon(e.target.value)}
                  className="bg-slate-900/50 border-slate-700/50 text-slate-100"
                  maxLength={2}
                />
              </div>
              <Button 
                onClick={handleCreateMood}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Create Mood
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Moods Grid */}
      {moods.length === 0 ? (
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="text-slate-500 text-4xl mb-4">😊</div>
          <h3 className="text-slate-300 mb-2">No moods yet</h3>
          <p className="text-slate-500 text-sm">Create your first mood to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {moods.map((mood, index) => (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className={`bg-slate-800/40 backdrop-blur-xl border rounded-2xl p-6 hover:border-slate-600/50 transition-all ${
                mood.active ? 'border-slate-700/50' : 'border-slate-700/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{mood.icon}</div>
                <Switch
                  checked={mood.active}
                  onCheckedChange={() => toggleMoodStatus(mood.id)}
                />
              </div>
              <h3 className="text-slate-100 mb-3">{mood.name}</h3>
              <div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  mood.active 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-slate-600/20 text-slate-400'
                }`}>
                  {mood.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
