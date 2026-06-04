import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Circle, 
  Smile, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../ui/button';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { id: 'souls', label: 'Souls', icon: MessageSquare, path: '/admin/souls' },
  { id: 'circles', label: 'Circles', icon: Circle, path: '/admin/circles' },
  { id: 'moods', label: 'Moods', icon: Smile, path: '/admin/moods' },
  { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 px-4 py-3">
        <div className="flex items-center justify-between">
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-2"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(item.path)
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
          </motion.div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <div className="w-64 fixed left-0 top-0 bottom-0 bg-slate-900/40 backdrop-blur-xl border-r border-slate-700/50 flex flex-col">
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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(item.path)
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-slate-300 hover:bg-slate-800/50'
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

        {/* Main Content */}
        <div className="ml-64 flex-1">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden pt-16 pb-20">
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-slate-700/50 px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive(item.path)
                    ? 'text-purple-300'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
