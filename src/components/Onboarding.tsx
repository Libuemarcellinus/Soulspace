import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { Ghost, Clock, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingProps {
  navigateTo: (screen: string) => void;
}

export default function Onboarding({ navigateTo }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const x = useMotionValue(0);

  const slides = [
    {
      title: 'No names. No faces.',
      subtitle: 'Just you.',
      icon: Ghost,
      description: 'Share your deepest emotions without revealing who you are. Every soul is anonymous here.'
    },
    {
      title: 'Post anything.',
      subtitle: 'It vanishes in 24h.',
      icon: Clock,
      description: 'Express yourself freely. All posts disappear after 24 hours, leaving no permanent trace.'
    },
    {
      title: 'Ready to be',
      subtitle: 'truly yourself?',
      icon: Ghost,
      description: 'Join a community where vulnerability is strength and empathy is everything.',
      isFinal: true
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSkip = () => {
    navigateTo('home');
  };

  const handleGetStarted = () => {
    navigateTo('home');
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (info.offset.x > swipeThreshold && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
      {/* Skip Button */}
      {!currentSlideData.isFinal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-6 right-6 z-10"
        >
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-slate-400 hover:text-slate-200"
          >
            Skip
          </Button>
        </motion.div>
      )}

      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-md w-full text-center cursor-grab active:cursor-grabbing"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-12"
            >
              {currentSlide === 1 ? (
                <div className="relative mx-auto w-32 h-32">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center border-2 border-purple-500/30">
                      <Clock className="w-12 h-12 text-purple-400" />
                    </div>
                  </motion.div>
                  <motion.div
                    className="absolute -top-2 -right-2 text-2xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⏰
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: currentSlideData.isFinal ? [0.7, 1, 0.7] : 1
                  }}
                  transition={{ 
                    duration: currentSlideData.isFinal ? 2 : 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mx-auto"
                >
                  <Icon className="w-16 h-16 text-purple-400" />
                </motion.div>
              )}
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-4"
            >
              <h1 className="text-slate-100 text-3xl mb-2">{currentSlideData.title}</h1>
              <h2 className="text-slate-100 text-3xl">{currentSlideData.subtitle}</h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-slate-400 leading-relaxed"
            >
              {currentSlideData.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Section */}
      <div className="px-6 pb-12">
        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="group"
            >
              <motion.div
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'w-2 bg-slate-700 group-hover:bg-slate-600'
                }`}
                layoutId={index === currentSlide ? 'active-dot' : undefined}
              />
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {currentSlideData.isFinal ? (
            <Button
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-14 text-lg shadow-lg shadow-purple-500/50"
            >
              <Ghost className="w-5 h-5 mr-2" />
              Enter as a Ghost
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-14"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </motion.div>

        {/* Swipe Hint */}
        {!currentSlideData.isFinal && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-slate-500 text-sm text-center mt-4"
          >
            Swipe or tap to continue
          </motion.p>
        )}
      </div>
    </div>
  );
}
