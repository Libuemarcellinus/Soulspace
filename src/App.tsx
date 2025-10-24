import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding';
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedCircle, setSelectedCircle] = useState<any>(null);

  // Auto-transition from splash to onboarding
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => setCurrentScreen('onboarding'), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const navigateTo = (screen: string, data?: any) => {
    if (data?.post) setSelectedPost(data.post);
    if (data?.circle) setSelectedCircle(data.circle);
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <Onboarding navigateTo={navigateTo} />;
      case 'home':
        return <HomeFeed navigateTo={navigateTo} />;
      case 'create':
        return <PostCreation navigateTo={navigateTo} />;
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
