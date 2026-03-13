
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayAgainButtonProps {
  visible: boolean;
  onClick: () => void;
}

const PlayAgainButton: React.FC<PlayAgainButtonProps> = ({ visible, onClick }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15 
          }}
          className="relative"
        >
          {/* Celebration confetti effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ 
                  x: '50%', 
                  y: '50%',
                  scale: 0,
                  rotate: 0 
                }}
                animate={{
                  x: `${50 + (Math.cos(i * Math.PI / 4) * 150)}%`,
                  y: `${50 + (Math.sin(i * Math.PI / 4) * 150)}%`,
                  scale: [0, 1, 0],
                  rotate: 360,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              >
                {['🎉', '🎊', '⭐', '✨', '🏆', '🎯', '🔥', '💫'][i]}
              </motion.div>
            ))}
          </div>

          {/* Main button */}
          <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full relative group overflow-hidden rounded-2xl p-[3px]"
          >
            {/* Animated rainbow border */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 via-cyan-500 via-blue-500 to-purple-500"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            {/* Button content */}
            <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl px-8 py-5 group-hover:from-green-500 group-hover:via-emerald-500 group-hover:to-teal-500 transition-all duration-300">
              {/* Pulsing background effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              
              <div className="relative flex items-center justify-center gap-3">
                {/* Rotating refresh icon */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                  className="flex-shrink-0"
                >
                  <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </motion.div>
                
                {/* Button text */}
                <div className="flex flex-col items-start">
                  <span className="text-white text-2xl font-black tracking-wide drop-shadow-lg">
                    PLAY AGAIN
                  </span>
                  <span className="text-green-200 text-xs font-semibold">
                    Challenge yourself!
                  </span>
                </div>
                
                {/* Animated double arrow */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex gap-1"
                >
                  <svg className="w-5 h-5 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <svg className="w-5 h-5 text-white drop-shadow-lg opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* Shine effect sweeping across */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "linear"
              }}
            />

            {/* Floating sparkles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-300 text-lg pointer-events-none"
                style={{
                  left: `${20 + i * 15}%`,
                  top: '50%',
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                ✨
              </motion.div>
            ))}

            {/* Outer glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/50 via-emerald-500/50 to-teal-500/50 blur-xl -z-10 group-hover:blur-2xl transition-all duration-300" />
          </motion.button>

          {/* Motivational text below button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full"
            >
              <motion.span
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xl"
              >
                🎯
              </motion.span>
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                Beat your high score!
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlayAgainButton;