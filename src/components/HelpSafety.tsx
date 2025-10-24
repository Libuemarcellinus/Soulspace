import { motion } from 'motion/react';
import { ArrowLeft, Shield, AlertCircle, Phone, MessageSquare, Heart, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface HelpSafetyProps {
  navigateTo: (screen: string) => void;
}

const crisisResources = [
  {
    name: 'National Suicide Prevention Lifeline',
    number: '988',
    description: '24/7 crisis support',
    icon: Phone
  },
  {
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: 'Free 24/7 support via text',
    icon: MessageSquare
  },
  {
    name: 'International Association for Suicide Prevention',
    number: 'Visit IASP online',
    description: 'Global crisis resources',
    icon: ExternalLink
  }
];

export default function HelpSafety({ navigateTo }: HelpSafetyProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pb-6">
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
              onClick={() => navigateTo('settings')}
              className="text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-slate-100">Help & Safety</h1>
            <div className="w-10" />
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Crisis Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/30 rounded-3xl p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-slate-100 mb-2">In Crisis?</h2>
              <p className="text-slate-300 text-sm mb-4">
                If you're having thoughts of self-harm or suicide, please reach out for immediate help. You're not alone.
              </p>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                <Phone className="w-4 h-4 mr-2" />
                Call 988 Now
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Crisis Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-slate-300 mb-4">Crisis Resources</h2>
          <div className="space-y-4">
            {crisisResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-slate-200 mb-1">{resource.name}</h3>
                      <p className="text-purple-400 mb-1">{resource.number}</p>
                      <p className="text-slate-500 text-sm">{resource.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Community Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-slate-300 mb-4">Community Guidelines</h2>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-slate-200 mb-1">Be Kind & Compassionate</h3>
                  <p className="text-slate-400 text-sm">Everyone here is vulnerable. Treat others with empathy.</p>
                </div>
              </div>
              <Separator className="bg-slate-700/50" />
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-slate-200 mb-1">Respect Anonymity</h3>
                  <p className="text-slate-400 text-sm">Never try to identify or dox other users.</p>
                </div>
              </div>
              <Separator className="bg-slate-700/50" />
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-slate-200 mb-1">No Harmful Content</h3>
                  <p className="text-slate-400 text-sm">No harassment, hate speech, or dangerous advice.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Report Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-slate-300 mb-4">Report Concerns</h2>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
            <p className="text-slate-300 mb-4">
              If you see content that violates our guidelines or concerns you, please report it.
            </p>
            <Button variant="outline" className="w-full border-slate-600 text-slate-300">
              Report Content
            </Button>
          </div>
        </motion.div>

        {/* Additional Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 bg-slate-800/20 border border-slate-700/30 rounded-2xl"
        >
          <p className="text-slate-400 text-sm text-center">
            SoulSpace is a peer support community, not a replacement for professional mental health care. 
            If you need ongoing support, please consult a licensed therapist.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
