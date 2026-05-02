import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Bell, Eye, Moon, Volume2, HelpCircle, FileText, LogOut, ChevronRight, Ghost, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/api';

interface SettingsProps {
  navigateTo: (screen: string) => void;
}

function loadSetting(key: string, defaultValue: boolean): boolean {
  try {
    const stored = localStorage.getItem(`soulspace_setting_${key}`);
    return stored !== null ? stored === 'true' : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveSetting(key: string, value: boolean) {
  try {
    localStorage.setItem(`soulspace_setting_${key}`, String(value));
  } catch {}
}

export default function Settings({ navigateTo }: SettingsProps) {
  const [notifications, setNotifications] = useState(() => loadSetting('notifications', false));
  const [notifStatus, setNotifStatus] = useState<'idle' | 'denied'>('idle');
  const [blurPreviews, setBlurPreviews] = useState(() => loadSetting('blurPreviews', false));
  const { logout, user } = useAuth();

  const toggle = (key: string, setter: (v: boolean) => void, value: boolean) => {
    setter(value);
    saveSetting(key, value);
  };

  const handleNotificationsToggle = async (value: boolean) => {
    if (!value) {
      toggle('notifications', setNotifications, false);
      authApi.updateSettings({ push_notifications: false }).catch(() => {});
      return;
    }
    if (!('Notification' in window)) {
      toggle('notifications', setNotifications, false);
      return;
    }
    if (Notification.permission === 'denied') {
      setNotifStatus('denied');
      return;
    }
    if (Notification.permission === 'granted') {
      toggle('notifications', setNotifications, true);
      authApi.updateSettings({ push_notifications: true }).catch(() => {});
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      toggle('notifications', setNotifications, true);
      authApi.updateSettings({ push_notifications: true }).catch(() => {});
      setNotifStatus('idle');
    } else {
      setNotifStatus('denied');
      toggle('notifications', setNotifications, false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigateTo('onboarding-new');
  };

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
        {/* Current User */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-slate-800/40 border border-slate-700/50 rounded-3xl flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Ghost className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-200">{user.username}</p>
              <p className="text-slate-500 text-sm">Ghost Mode Active</p>
            </div>
          </motion.div>
        )}

        {/* Privacy & Anonymity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-slate-300 mb-4">Privacy & Anonymity</h2>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden">
            {/* Ghost Mode — always on, locked */}
            <div className="p-4 flex items-center justify-between opacity-70">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-slate-200">Ghost Mode</p>
                  <p className="text-slate-500 text-sm">Always on — SoulSpace is anonymous by design</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-purple-400">Always On</span>
              </div>
            </div>
            <Separator className="bg-slate-700/50" />
            {/* Blur Previews — functional */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-slate-200">Blur Previews</p>
                  <p className="text-slate-500 text-sm">Hide post content in feed until opened</p>
                </div>
              </div>
              <Switch
                checked={blurPreviews}
                onCheckedChange={(v) => {
                  toggle('blurPreviews', setBlurPreviews, v);
                  authApi.updateSettings({ blur_preview: v }).catch(() => {});
                }}
              />
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
                  <p className="text-slate-500 text-sm">
                    {notifStatus === 'denied'
                      ? 'Blocked by browser — enable in site settings'
                      : 'Get notified of replies and echoes'}
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={handleNotificationsToggle}
              />
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
            {/* Dark Mode — locked */}
            <div className="p-4 flex items-center justify-between opacity-70">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-slate-200">Dark Mode</p>
                  <p className="text-slate-500 text-sm">SoulSpace only supports dark mode</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-purple-400">Always On</span>
              </div>
            </div>
            <Separator className="bg-slate-700/50" />
            {/* Sound Effects — coming soon */}
            <div className="p-4 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-slate-200">Sound Effects</p>
                  <p className="text-slate-500 text-sm">Calming ambient sounds</p>
                </div>
              </div>
              <span className="text-xs text-slate-500 border border-slate-600/50 rounded-full px-2 py-0.5">Soon</span>
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
            onClick={handleSignOut}
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>

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
