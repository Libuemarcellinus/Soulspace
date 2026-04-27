import { motion } from 'motion/react';
import { BookOpen, MessageCircle, Edit3 } from 'lucide-react';
import { Button } from '../ui/button';

interface BrowseIntroScreenProps {
  navigateTo: (screen: string, data?: any) => void;
  username?: string;
  mood?: string;
}

const samplePosts = [
  { mood: 'Hopeful', emoji: '🌟', text: "Today's looking brighter!" },
  { mood: 'Reflective', emoji: '🌙', text: "Thinking about what really matters in life." },
  { mood: 'Calm', emoji: '🌊', text: "Found peace in the small moments today." }
];

export default function BrowseIntroScreen({ navigateTo, username = 'HopefulStar17', mood = 'hopeful' }: BrowseIntroScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6 py-8 flex flex-col max-w-[390px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-5xl mb-4">😊</div>
        <h1 className="text-slate-100 mb-2">Hi {username}!</h1>
        <p className="text-slate-400">Explore stories from souls like you</p>
      </motion.div>

      {/* Sample Posts Preview */}
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

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <Button
          onClick={() => navigateTo('browse', { username, mood })}
          className="w-full min-h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Browse Stories
        </Button>

        <Button
          variant="outline"
          onClick={() => navigateTo('chats', { username, mood })}
          className="w-full min-h-[44px] border-slate-600 text-slate-300 hover:bg-slate-800/40"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Browse Chats
        </Button>

        <Button
          variant="outline"
          onClick={() => navigateTo('share-story', { username, mood })}
          className="w-full min-h-[44px] border-slate-600 text-slate-300 hover:bg-slate-800/40"
        >
          <Edit3 className="w-5 h-5 mr-2" />
          Share Story
        </Button>
      </motion.div>

      {/* AdMob Placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 h-[50px] bg-slate-800/20 border border-slate-700/30 rounded-lg flex items-center justify-center"
      >
        <p className="text-slate-600 text-xs">AdMob 300x50</p>
      </motion.div>

      {/* Help Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-4"
      >
        <Button
          variant="ghost"
          className="w-full text-slate-400 hover:text-slate-300"
          onClick={() => navigateTo('help')}
        >
          Need Help?
        </Button>
      </motion.div>
    </div>
  );
}
