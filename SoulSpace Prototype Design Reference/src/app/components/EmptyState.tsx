import { motion } from 'motion/react';
import { Ghost } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  title = "No souls here yet",
  description = "Be the first to share your emotions in this space.",
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="mb-6"
      >
        <Ghost className="w-24 h-24 text-purple-400/30 mx-auto" />
      </motion.div>
      
      <h3 className="text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-xs">{description}</p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
