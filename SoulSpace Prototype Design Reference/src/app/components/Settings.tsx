import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Bell, Eye, Moon, Volume2, HelpCircle, FileText, LogOut, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

interface SettingsProps {
  navigateTo: (screen: string) => void;
}

export default function Settings({ navigateTo }: SettingsProps) {
  const [ghostMode, setGhostMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [blurPreviews, setBlurPreviews] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

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
              onClick={() => navigateTo('profile')}
              className="text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-slate-100">Settings</h1>
            <div className="w-10" />
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Privacy & Anonymity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-slate-300 mb-4">Privacy & Anonymity</h2>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-slate-200">Ghost Mode</p>
                  <p className="text-slate-500 text-sm">Stay completely anonymous</p>
                </div>
              </div>
              <Switch checked={ghostMode} onCheckedChange={setGhostMode} />
            </div>
            <Separator className="bg-slate-700/50" />
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-slate-200">Blur Previews</p>
                  <p className="text-slate-500 text-sm">Hide content until opened</p>
                </div>
              </div>
              <Switch checked={blurPreviews} onCheckedChange={setBlurPreviews} />
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-slate-300 mb-4">Notifications</h2>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-slate-200">Push Notifications</p>
                  <p className="text-slate-500 text-sm">Get notified of replies</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-slate-300 mb-4">Appearance</h2>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-slate-200">Dark Mode</p>
                  <p className="text-slate-500 text-sm">Easy on the eyes</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <Separator className="bg-slate-700/50" />
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-slate-200">Sound Effects</p>
                  <p className="text-slate-500 text-sm">Calming ambient sounds</p>
                </div>
              </div>
              <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
            </div>
          </div>
        </motion.div>

        {/* Support & Legal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-slate-300 mb-4">Support & Legal</h2>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden">
            <button
              onClick={() => navigateTo('help')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-purple-400" />
                <p className="text-slate-200">Help & Safety</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </button>
            <Separator className="bg-slate-700/50" />
            <button
              onClick={() => navigateTo('legal')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple-400" />
                <p className="text-slate-200">Privacy & Terms</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline"
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>

        {/* Version */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-slate-500 text-sm"
        >
          SoulSpace v1.0.0
        </motion.div>
      </div>
    </div>
  );
}
