import { motion } from 'motion/react';
import { Ghost, Home, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorScreenProps {
  navigateTo: (screen: string) => void;
}

export default function ErrorScreen({ navigateTo }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {/* Sad Ghost */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="mb-8"
        >
          <Ghost className="w-32 h-32 text-purple-400/50 mx-auto" />
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-slate-100 text-4xl mb-4">404</h1>
          <h2 className="text-slate-300 mb-2">Lost in the Void</h2>
          <p className="text-slate-500">
            This soul seems to have vanished. Even ghosts can't find this page.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3"
        >
          <Button
            onClick={() => navigateTo('home')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-slate-600 text-slate-300 hover:bg-slate-800/40"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Page
          </Button>
        </motion.div>

        {/* Encouragement */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-slate-500 text-sm"
        >
          Sometimes we all need to find our way back. That's okay.
        </motion.p>
      </motion.div>
    </div>
  );
}
