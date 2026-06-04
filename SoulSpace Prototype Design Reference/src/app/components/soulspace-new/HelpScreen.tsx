import { motion } from 'motion/react';
import { ArrowLeft, HelpCircle, Mail, Book, Shield } from 'lucide-react';
import { Button } from '../ui/button';

interface HelpScreenProps {
  navigateTo: (screen: string, data?: any) => void;
}

const helpTopics = [
  {
    icon: HelpCircle,
    title: 'Getting Started',
    description: 'Learn how to create your nickname and start sharing'
  },
  {
    icon: Shield,
    title: 'Privacy & Safety',
    description: 'Your anonymity and how we protect it'
  },
  {
    icon: Book,
    title: 'Community Guidelines',
    description: 'How to be a positive part of Soulspace'
  },
  {
    icon: Mail,
    title: 'Contact Support',
    description: 'Get help from our team'
  }
];

export default function HelpScreen({ navigateTo }: HelpScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6 py-8 max-w-[390px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
          className="text-slate-400 hover:text-slate-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-slate-100">Help & Support</h1>
        <div className="w-10" />
      </motion.div>

      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl"
      >
        <p className="text-slate-300 text-center">
          We're here to help! 💜
        </p>
        <p className="text-slate-400 text-sm text-center mt-2">
          Find answers to common questions or reach out to our support team
        </p>
      </motion.div>

      {/* Help Topics */}
      <div className="space-y-3 mb-8">
        {helpTopics.map((topic, index) => {
          const Icon = topic.icon;
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-purple-500/50 hover:bg-slate-800/60 transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-100 mb-1">{topic.title}</h3>
                  <p className="text-slate-400 text-sm">{topic.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-slate-100 mb-4">Quick Answers</h2>
        
        <div className="space-y-3">
          <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl">
            <p className="text-slate-300 mb-2">What if I forget my code?</p>
            <p className="text-slate-400 text-sm">
              You can create a new nickname anytime. We don't store codes for privacy reasons.
            </p>
          </div>

          <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl">
            <p className="text-slate-300 mb-2">Are posts really anonymous?</p>
            <p className="text-slate-400 text-sm">
              Yes! Only your nickname is shown. We don't track or link posts to personal information.
            </p>
          </div>

          <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl">
            <p className="text-slate-300 mb-2">Can I share images?</p>
            <p className="text-slate-400 text-sm">
              Soulspace is text-only to keep the focus on authentic emotional expression.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          variant="outline"
          className="w-full min-h-[44px] border-slate-600 text-slate-300 hover:bg-slate-800/40"
        >
          <Mail className="w-5 h-5 mr-2" />
          Email Support
        </Button>
      </motion.div>
    </div>
  );
}
