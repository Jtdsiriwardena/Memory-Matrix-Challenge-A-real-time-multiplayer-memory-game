
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Rocket, Loader2 } from 'lucide-react';

interface MatchmakingButtonProps {
  inQueue: boolean;
  roomId: string | null;
  onClick: () => void;
}

const MatchmakingButton: React.FC<MatchmakingButtonProps> = ({ inQueue, roomId, onClick }) => {
  const isDisabled = inQueue || roomId !== null;
  
  return (
    <motion.div
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className="relative"
    >
      {/* Glow effect for active state */}
      {inQueue && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-lg opacity-30"
        />
      )}
      
      {/* Main button */}
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`
          relative w-full flex items-center justify-center gap-3 px-6 py-4
          text-lg font-bold rounded-xl transition-all duration-300
          ${isDisabled 
            ? 'bg-gray-800/50 text-gray-400 cursor-not-allowed border border-gray-700/50' 
            : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl border border-cyan-500/30 hover:border-cyan-400/50'
          }
        `}
      >
        {/* Icon container with animation */}
        <div className="relative">
          {inQueue ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-6 h-6" />
            </motion.div>
          ) : roomId ? (
            <Users className="w-6 h-6" />
          ) : (
            <Rocket className="w-6 h-6" />
          )}
        </div>
        
        {/* Text */}
        <span>
          {roomId 
            ? 'Match Found!' 
            : inQueue 
            ? 'Searching Opponents...' 
            : 'Quick Match '
          }
        </span>

      </button>
      
      {/* Status messages */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 text-center"
      >
        
        {!roomId && !inQueue && (
          <div className="text-gray-400 text-sm">
            <div className="flex items-center justify-center gap-2">
              <Users className="w-3 h-3" />
              <span>Play against real players worldwide</span>
            </div>
          </div>
        )}
      </motion.div>

    </motion.div>
  );
};

export default MatchmakingButton;