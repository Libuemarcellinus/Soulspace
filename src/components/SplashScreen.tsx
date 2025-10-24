import { motion } from 'motion/react';
import { Ghost } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        {/* Animated Ghost Logo with Heartbeat */}
        <motion.div
          className="relative mb-8"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.4)',
                '0 0 40px rgba(168, 85, 247, 0.6)',
                '0 0 20px rgba(168, 85, 247, 0.4)'
              ]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Ghost className="w-16 h-16 text-purple-400" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center"
        >
          <motion.h1 
            className="text-slate-100 text-3xl mb-3"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SoulSpace
          </motion.h1>
          <p className="text-slate-400 tracking-wider">Your sanctuary for authentic emotions</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
