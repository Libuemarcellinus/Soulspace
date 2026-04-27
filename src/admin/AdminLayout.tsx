import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  MessageSquare,
  Circle,
  Smile,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/button';

interface AdminLayoutProps {
  navigateTo: (screen: string) => void;
  currentScreen: string;
  children: React.ReactNode;
}

const navItems = [
  { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'admin-souls',     label: 'Souls',     icon: MessageSquare },
  { id: 'admin-circles',   label: 'Circles',   icon: Circle },
  { id: 'admin-moods',     label: 'Moods',     icon: Smile },
  { id: 'admin-users',     label: 'Users',     icon: Users },
];

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

export default function AdminLayout({ navigateTo, currentScreen, children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDesktop = useIsDesktop();

  const handleLogout = () => {
    localStorage.removeItem('soulspace_admin_token');
    navigateTo('admin-login');
  };

  const handleNavClick = (screen: string) => {
    navigateTo(screen);
    setIsMobileMenuOpen(false);
  };

  const isActive = (screen: string) => currentScreen === screen;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

      {/* ── MOBILE ── */}
      {!isDesktop && (
        <>
          {/* Mobile Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50">
            <div className="flex items-center justify-between px-4 py-4 min-h-[64px]">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌟</span>
                <span className="text-slate-100">SoulSpace Admin</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-300"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Mobile dropdown menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 px-4 pb-4 z-50"
                >
                  <div className="space-y-1 pt-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive(item.id)
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'text-slate-300 hover:bg-slate-800/50'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Content */}
          <div className="pt-20 pb-24">
            <div className="p-4">
              {children}
            </div>
          </div>

          {/* Mobile Bottom Nav */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50">
            <div className="flex items-center justify-around px-2 py-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                      isActive(item.id) ? 'text-purple-300' : 'text-slate-400'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── DESKTOP ── */}
      {isDesktop && (
        <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', width: '100%' }}>
          {/* Sidebar */}
          <div className="w-64 fixed left-0 top-0 bottom-0 bg-slate-900/60 backdrop-blur-xl border-r border-slate-700/50 flex flex-col z-40">
            {/* Logo */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🌟</span>
                <div>
                  <h1 className="text-slate-100">SoulSpace</h1>
                  <p className="text-slate-400 text-sm">Admin Panel</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.id)
                        ? 'bg-purple-500/20 text-purple-300 border-l-2 border-purple-500'
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-700/50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main content */}
          <div style={{ marginLeft: '256px', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>
            <div style={{ padding: '32px' }}>
              {children}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
