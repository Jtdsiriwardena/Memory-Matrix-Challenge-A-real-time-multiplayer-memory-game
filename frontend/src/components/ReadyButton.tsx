
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReadyButtonProps {
  roomId: string | null;
  isReady: boolean;
  countdown: number | null;
  onClick: () => void;
}

const ReadyButton: React.FC<ReadyButtonProps> = ({ roomId, isReady, countdown, onClick }) => {
  return (
    <div className="relative min-h-[120px]">
      <AnimatePresence mode="wait">
        {roomId && !isReady ? (
          // Ready button
          <motion.div
            key="ready-button"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <motion.button
              onClick={onClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full relative group overflow-hidden rounded-2xl p-[2px]"
            >
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              {/* Button content */}
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl px-8 py-4 flex items-center justify-center gap-3 group-hover:from-green-500 group-hover:to-emerald-500 transition-all duration-300">
                {/* Pulsing ready icon */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 bg-white rounded-full shadow-lg shadow-white/50"
                />

                <span className="text-white text-xl font-bold tracking-wide">
                  I'M READY
                </span>

                <motion.svg
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </motion.svg>
              </div>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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
            </motion.button>
          </motion.div>
        ) : countdown === null ? (
          // Waiting for other players
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl px-6 py-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                {/* Animated waiting dots */}
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <span className="text-blue-300 font-semibold">
                  Waiting for other players
                </span>
              </div>

              {/* Player icons */}
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= 2 ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                  >
                    {i <= 2 ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          // Game starting with INLINE countdown
          <motion.div
            key="starting"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-2xl px-6 py-6 relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-yellow-500/10 blur-xl" />

              {/* Countdown number - INLINE */}
              <div className="relative">
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="flex flex-col items-center justify-center"
                >
                  {/* Large countdown number */}
                  <motion.div
                    animate={{
                      textShadow: [
                        '0 0 20px rgba(251, 146, 60, 0.8)',
                        '0 0 40px rgba(251, 146, 60, 1)',
                        '0 0 20px rgba(251, 146, 60, 0.8)',
                      ]
                    }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-300 via-orange-400 to-red-500 mb-2"
                  >
                    {countdown}
                  </motion.div>

                  {/* Label */}
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="text-xl"
                    >
                      🎮
                    </motion.span>
                    <motion.span
                      key={countdown === 0 ? "game-on" : "get-ready"}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className={`font-bold text-sm tracking-widest ${countdown === 0 ? "text-green-300" : "text-orange-300"
                        }`}
                    >
                      {countdown === 0 ? "GAME ON" : "GET READY!"}
                    </motion.span>

                  </div>
                </motion.div>

                {/* Pulsing ring around countdown */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-4 border-orange-400 pointer-events-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReadyButton;