import React from 'react';
import { motion } from 'framer-motion';

interface PatternDisplayProps {
  pattern: number[];
  gridSize?: number;
}

const PatternDisplay: React.FC<PatternDisplayProps> = ({ pattern, gridSize = 4 }) => {
  if (!pattern || pattern.length === 0) {
    return null;
  }

  const correctCount = pattern.filter(cell => cell === 1).length;
  const totalCells = pattern.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="relative"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30"
          >
            <span className="text-xl">🎯</span>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              Correct Pattern
            </h3>
            <p className="text-sm text-gray-300">
              {correctCount} out of {totalCells} cells were active
            </p>
          </div>
        </div>
      </motion.div>

      {/* Pattern grid container */}
      <div className="relative">
        {/* Glow effect background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-3xl rounded-3xl" />
        
        {/* Main grid */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 md:p-8 shadow-2xl"
        >
          {/* Grid */}
          <div
            className="grid gap-2 md:gap-3 mx-auto w-fit"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            {pattern.map((cell, index) => {
              const isActive = cell === 1;
              
              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.4 + (index * 0.03),
                  }}
                  className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 relative"
                >
                  {/* Cell container */}
                  <div className={`
                    relative w-full h-full rounded-xl border-2 transition-all duration-500
                    ${isActive 
                      ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 border-cyan-300 shadow-lg shadow-blue-500/50' 
                      : 'bg-gradient-to-br from-gray-700/50 to-gray-800/50 border-gray-600/50'
                    }
                  `}>
                    {/* Inner glow */}
                    <div className={`
                      absolute inset-0.5 rounded-lg transition-opacity duration-500
                      ${isActive 
                        ? 'bg-gradient-to-br from-white/30 to-transparent opacity-100' 
                        : 'opacity-0'
                      }
                    `} />

                    {/* Checkmark icon for active cells */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          delay: 0.5 + (index * 0.03),
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <svg 
                          className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white drop-shadow-lg" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={3} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                      </motion.div>
                    )}

                    {/* Empty cell indicator */}
                    {!isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ delay: 0.5 + (index * 0.03) }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-gray-500 rounded-full" />
                      </motion.div>
                    )}

                    {/* Active cell pulse effect */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.6 + (index * 0.03),
                        }}
                        className="absolute inset-0 rounded-xl border-2 border-cyan-400"
                      />
                    )}

                    {/* Sparkle effect on active cells */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: 0.7 + (index * 0.03),
                        }}
                        className="absolute -top-1 -right-1 text-yellow-300 text-sm"
                      >
                        ✨
                      </motion.div>
                    )}

                    {/* 3D depth effect */}
                    <div className={`
                      absolute -bottom-1 left-0 right-0 h-1 rounded-b-xl transition-all duration-500
                      ${isActive ? 'bg-black/60' : 'bg-black/20'}
                    `} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stats display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 pt-6 border-t border-white/10"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                  className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"
                >
                  {correctCount}
                </motion.div>
                <div className="text-xs text-gray-400 mt-1">Active Cells</div>
              </div>
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                >
                  {totalCells - correctCount}
                </motion.div>
                <div className="text-xs text-gray-400 mt-1">Empty Cells</div>
              </div>
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1, type: "spring" }}
                  className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"
                >
                  {Math.round((correctCount / totalCells) * 100)}%
                </motion.div>
                <div className="text-xs text-gray-400 mt-1">Coverage</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Corner decorations */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400 rounded-tl-lg" />
        <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-blue-400 rounded-tr-lg" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-blue-400 rounded-bl-lg" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-purple-400 rounded-br-lg" />
      </div>

      {/* Info text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-6 flex items-start gap-3 bg-blue-500/10 border border-blue-400/20 rounded-2xl p-4"
      >
        <div className="flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-blue-300 font-medium">
            Cells marked with <span className="inline-flex items-center mx-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span> were the correct answer positions
          </p>
          <p className="text-xs text-blue-300/60 mt-1">
            Compare this pattern with your selection to improve your memory!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PatternDisplay;