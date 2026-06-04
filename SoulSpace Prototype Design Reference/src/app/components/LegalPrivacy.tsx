import { motion } from 'motion/react';
import { ArrowLeft, Shield, Eye, Lock, Database, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface LegalPrivacyProps {
  navigateTo: (screen: string) => void;
}

export default function LegalPrivacy({ navigateTo }: LegalPrivacyProps) {
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
            <h1 className="text-slate-100">Privacy & Terms</h1>
            <div className="w-10" />
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
            <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          </TabsList>

          <TabsContent value="privacy">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Privacy Commitment */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-purple-400 flex-shrink-0" />
                  <div>
                    <h2 className="text-slate-100 mb-2">Our Privacy Commitment</h2>
                    <p className="text-slate-300 text-sm">
                      Your anonymity and emotional safety are our top priorities. We've designed SoulSpace from the ground up to protect your identity.
                    </p>
                  </div>
                </div>
              </div>

              {/* What We Collect */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-slate-200 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  What We Collect
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-300 mb-1">• Anonymous Activity Data</p>
                    <p className="text-slate-500">Post content, mood selections, and interactions (all anonymous)</p>
                  </div>
                  <Separator className="bg-slate-700/50" />
                  <div>
                    <p className="text-slate-300 mb-1">• Basic Technical Data</p>
                    <p className="text-slate-500">Device type, browser, and general location (city-level only)</p>
                  </div>
                  <Separator className="bg-slate-700/50" />
                  <div>
                    <p className="text-slate-300 mb-1">• What We DON'T Collect</p>
                    <p className="text-slate-500">Names, emails, phone numbers, photos, or any personally identifiable information</p>
                  </div>
                </div>
              </div>

              {/* Data Protection */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-slate-200 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-400" />
                  How We Protect Your Data
                </h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• End-to-end encryption for all posts and messages</li>
                  <li>• Automatic deletion of all content after 24 hours</li>
                  <li>• No IP address tracking or device fingerprinting</li>
                  <li>• Anonymous IDs that change regularly</li>
                  <li>• No data sharing with third parties, ever</li>
                </ul>
              </div>

              {/* Your Rights */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-slate-200 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  Your Rights
                </h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Delete your account and all data at any time</li>
                  <li>• Request a copy of your anonymous data</li>
                  <li>• Opt out of analytics tracking</li>
                  <li>• Control what content you see</li>
                </ul>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="terms">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Terms Overview */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-slate-200 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Terms of Service
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  By using SoulSpace, you agree to these terms. We've kept them simple and human.
                </p>
              </div>

              {/* User Responsibilities */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-slate-200 mb-4">Your Responsibilities</h3>
                <ul className="space-y-3 text-slate-300 text-sm">
                  <li>• Be kind and respectful to all community members</li>
                  <li>• Don't post harmful, illegal, or abusive content</li>
                  <li>• Respect others' anonymity and privacy</li>
                  <li>• Don't attempt to identify other users</li>
                  <li>• Seek professional help for serious mental health concerns</li>
                </ul>
              </div>

              {/* Content Policy */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-slate-200 mb-4">Content Policy</h3>
                <p className="text-slate-300 text-sm mb-3">
                  SoulSpace is a safe space for authentic emotions. We prohibit:
                </p>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Harassment or bullying</li>
                  <li>• Hate speech or discrimination</li>
                  <li>• Spam or commercial content</li>
                  <li>• Graphic violence or self-harm instructions</li>
                  <li>• Impersonation or deception</li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-slate-200 mb-4">Important Disclaimer</h3>
                <p className="text-slate-300 text-sm">
                  SoulSpace is a peer support community, not a medical or therapeutic service. 
                  Content shared here should not be considered professional medical advice. 
                  If you're experiencing a mental health crisis, please contact professional services immediately.
                </p>
              </div>

              {/* Updates */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-slate-200 mb-4">Changes to Terms</h3>
                <p className="text-slate-300 text-sm">
                  We may update these terms occasionally. We'll notify you of any significant changes 
                  and give you the opportunity to review before they take effect.
                </p>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-slate-500 text-sm"
        >
          Last updated: October 21, 2025
        </motion.div>
      </div>
    </div>
  );
}
