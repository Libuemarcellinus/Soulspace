import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Users, Upload, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';

interface Circle {
  id: number;
  name: string;
  icon: string;
  members: number;
  active: boolean;
}

const initialCircles: Circle[] = [
  { id: 1, name: 'Anxiety Support', icon: '🌊', members: 1243, active: true },
  { id: 2, name: 'Depression', icon: '🌧️', members: 987, active: true },
  { id: 3, name: 'Self Love', icon: '💜', members: 2134, active: true },
  { id: 4, name: 'Breakups', icon: '💔', members: 756, active: true },
  { id: 5, name: 'Healing Journey', icon: '🌱', members: 1567, active: true },
  { id: 6, name: 'Late Night Thoughts', icon: '🌙', members: 1891, active: true },
  { id: 7, name: 'Gratitude', icon: '✨', members: 2456, active: true },
  { id: 8, name: 'New Beginnings', icon: '🌅', members: 1234, active: false },
];

export default function AdminCircles() {
  const [isLoading, setIsLoading] = useState(true);
  const [circles, setCircles] = useState<Circle[]>(initialCircles);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleIcon, setNewCircleIcon] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleCircleStatus = (id: number) => {
    setCircles(circles.map(circle => 
      circle.id === id ? { ...circle, active: !circle.active } : circle
    ));
  };

  const handleCreateCircle = () => {
    if (newCircleName && newCircleIcon) {
      const newCircle: Circle = {
        id: Date.now(),
        name: newCircleName,
        icon: newCircleIcon,
        members: 0,
        active: true,
      };
      setCircles([newCircle, ...circles]);
      setNewCircleName('');
      setNewCircleIcon('');
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-40 bg-slate-700/50 rounded-2xl" />
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
          <h1 className="text-slate-100 text-3xl mb-2">Circles</h1>
          <p className="text-slate-400">Manage community circles</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Circle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800/95 backdrop-blur-xl border-slate-700/50 text-slate-100">
            <DialogHeader>
              <DialogTitle>Create New Circle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="circle-name">Circle Name</Label>
                <Input
                  id="circle-name"
                  placeholder="e.g., Healing Journey"
                  value={newCircleName}
                  onChange={(e) => setNewCircleName(e.target.value)}
                  className="bg-slate-900/50 border-slate-700/50 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="circle-icon">Circle Icon (Emoji)</Label>
                <Input
                  id="circle-icon"
                  placeholder="e.g., 🌱"
                  value={newCircleIcon}
                  onChange={(e) => setNewCircleIcon(e.target.value)}
                  className="bg-slate-900/50 border-slate-700/50 text-slate-100"
                  maxLength={2}
                />
              </div>
              <Button 
                onClick={handleCreateCircle}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Create Circle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Circles Grid */}
      {circles.length === 0 ? (
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="text-slate-500 text-4xl mb-4">⭕</div>
          <h3 className="text-slate-300 mb-2">No circles yet</h3>
          <p className="text-slate-500 text-sm">Create your first circle to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {circles.map((circle, index) => (
            <motion.div
              key={circle.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-slate-800/40 backdrop-blur-xl border rounded-2xl p-6 hover:border-slate-600/50 transition-all ${
                circle.active ? 'border-slate-700/50' : 'border-slate-700/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{circle.icon}</div>
                <Switch
                  checked={circle.active}
                  onCheckedChange={() => toggleCircleStatus(circle.id)}
                />
              </div>
              <h3 className="text-slate-100 mb-2">{circle.name}</h3>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Users className="h-4 w-4" />
                <span>{circle.members.toLocaleString()} members</span>
              </div>
              <div className="mt-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  circle.active 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-slate-600/20 text-slate-400'
                }`}>
                  {circle.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
