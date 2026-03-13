
import React from 'react';
import { motion } from 'framer-motion';

interface SubmitButtonProps {
  disabled: boolean;
  onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ disabled, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative"
    >
      {disabled ? (
        // Disabled state
        <div className="relative overflow-hidden rounded-2xl p-[2px] opacity-50 cursor-not-allowed">
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl px-8 py-4">
            <div className="flex items-center justify-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </motion.div>
              <span className="text-gray-400 text-lg font-bold tracking-wide">
                COMPLETE SELECTION
              </span>
            </div>
          </div>
        </div>
      ) : (
        // Active state
        <motion.button
          onClick={onClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full relative group overflow-hidden rounded-2xl p-[2px]"
        >
          {/* Animated gradient border */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500"
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
          <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl px-8 py-4 group-hover:from-orange-500 group-hover:via-red-500 group-hover:to-pink-500 transition-all duration-300">
            {/* Pulsing background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20 rounded-2xl"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            
            <div className="relative flex items-center justify-center gap-3">
              {/* Animated submit icon */}
              <motion.div
                animate={{ 
                  x: [0, 5, 0],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              
              <span className="text-white text-xl font-black tracking-wider drop-shadow-lg">
                SUBMIT ANSWER
              </span>
              
              {/* Arrow icon */}
              <motion.svg
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-6 h-6 text-white drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </div>
          </div>

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
            animate={{
              x: ['-200%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: "linear"
            }}
          />

          {/* Sparkle particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-300 text-sm pointer-events-none"
              style={{
                top: '50%',
                left: `${20 + i * 30}%`,
              }}
              animate={{
                y: [-20, -40, -20],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              ✨
            </motion.div>
          ))}

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/50 via-red-500/50 to-pink-500/50 blur-xl -z-10 group-hover:blur-2xl transition-all duration-300" />
        </motion.button>
      )}

      {/* Helper text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: disabled ? 0.6 : 1 }}
        transition={{ duration: 0.3 }}
        className="mt-3 text-center"
      >
        {disabled ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Select cells to unlock submit</span>
          </div>
        ) : (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center justify-center gap-2 text-orange-300 text-sm font-semibold"
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚡
            </motion.span>
            <span>Ready to submit your answer!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Keyboard shortcut hint */}
      {!disabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full border border-white/10">
            <span className="text-xs text-gray-400">Press</span>
            <kbd className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-xs font-mono text-white">
              Enter
            </kbd>
            <span className="text-xs text-gray-400">to submit</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SubmitButton;