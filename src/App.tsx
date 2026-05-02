import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SplashScreen from './components/SplashScreen';
import OnboardingNew from './components/OnboardingNew';
import HomeFeed from './components/HomeFeed';
import PostCreation from './components/PostCreation';
import PostDetail from './components/PostDetail';
import ReplyScreen from './components/ReplyScreen';
import SoulCircles from './components/SoulCircles';
import CircleFeed from './components/CircleFeed';
import Profile from './components/Profile';
import MoodPulse from './components/MoodPulse';
import DailyUnload from './components/DailyUnload';
import Settings from './components/Settings';
import HelpSafety from './components/HelpSafety';
import LegalPrivacy from './components/LegalPrivacy';
import ErrorScreen from './components/ErrorScreen';
import Register from './components/Register';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminSouls from './admin/AdminSouls';
import AdminCircles from './admin/AdminCircles';
import AdminMoods from './admin/AdminMoods';
import AdminUsers from './admin/AdminUsers';
import { useAuth } from './context/AuthContext';
import { soulsApi } from './lib/api';

const ADMIN_SCREENS = [
  'admin-login', 'admin-dashboard', 'admin-souls',
  'admin-circles', 'admin-moods', 'admin-users',
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedCircle, setSelectedCircle] = useState<any>(null);
  const auth = useAuth();

  // Admin access via URL hash — navigate to localhost:3000/#admin
  useEffect(() => {
    if (window.location.hash === '#admin') {
      window.location.hash = '';
      setCurrentScreen('admin-login');
    }
  }, []);

  // Auto-transition from splash to onboarding (or home if already authenticated)
  useEffect(() => {
    if (currentScreen === 'splash' && !auth.isLoading) {
      const timer = setTimeout(
        () => setCurrentScreen(auth.user ? 'home' : 'onboarding-new'),
        2000
      );
      return () => clearTimeout(timer);
    }
  }, [currentScreen, auth.isLoading, auth.user]);

  const navigateTo = (screen: string, data?: any) => {
    if (data?.post) setSelectedPost(data.post);
    if (data?.circle) setSelectedCircle(data.circle);
    setCurrentScreen(screen);
  };

  const renderAdminScreen = () => {
    switch (currentScreen) {
      case 'admin-login':
        return <AdminLogin navigateTo={navigateTo} />;
      case 'admin-dashboard':
        return <AdminLayout navigateTo={navigateTo} currentScreen="admin-dashboard"><AdminDashboard /></AdminLayout>;
      case 'admin-souls':
        return <AdminLayout navigateTo={navigateTo} currentScreen="admin-souls"><AdminSouls /></AdminLayout>;
      case 'admin-circles':
        return <AdminLayout navigateTo={navigateTo} currentScreen="admin-circles"><AdminCircles /></AdminLayout>;
      case 'admin-moods':
        return <AdminLayout navigateTo={navigateTo} currentScreen="admin-moods"><AdminMoods /></AdminLayout>;
      case 'admin-users':
        return <AdminLayout navigateTo={navigateTo} currentScreen="admin-users"><AdminUsers /></AdminLayout>;
      default:
        return null;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding-new':
        return <OnboardingNew navigateTo={navigateTo} />;
      case 'register':
        return <Register navigateTo={navigateTo} />;
      case 'home':
        return <HomeFeed navigateTo={navigateTo} />;
      case 'create':
        return <PostCreation navigateTo={navigateTo} />;
      case 'circle-create':
        return <PostCreation navigateTo={navigateTo} circle={selectedCircle} />;
      case 'post-detail':
        return <PostDetail post={selectedPost} navigateTo={navigateTo} />;
      case 'reply':
        return <ReplyScreen post={selectedPost} navigateTo={navigateTo} />;
      case 'circles':
        return <SoulCircles navigateTo={navigateTo} />;
      case 'circle-feed':
        return <CircleFeed circle={selectedCircle} navigateTo={navigateTo} />;
      case 'profile':
        return <Profile navigateTo={navigateTo} />;
      case 'mood-pulse':
        return <MoodPulse navigateTo={navigateTo} />;
      case 'daily-unload':
        return <DailyUnload navigateTo={navigateTo} />;
      case 'settings':
        return <Settings navigateTo={navigateTo} />;
      case 'help':
        return <HelpSafety navigateTo={navigateTo} />;
      case 'legal':
        return <LegalPrivacy navigateTo={navigateTo} />;
      case 'error':
        return <ErrorScreen navigateTo={navigateTo} />;
      default:
        return <ErrorScreen navigateTo={navigateTo} />;
    }
  };

  const isAdminScreen = ADMIN_SCREENS.includes(currentScreen);

  if (isAdminScreen) {
    return renderAdminScreen();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
