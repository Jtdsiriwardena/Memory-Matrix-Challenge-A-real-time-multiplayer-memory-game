import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { toggleCell } from '../redux/inputSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Grid: React.FC = () => {
  const dispatch = useDispatch();
  const { gridSize, phase, pattern } = useSelector((state: RootState) => state.game);
  const selectedCells = useSelector((state: RootState) => state.input.selectedCells);

  const handleClick = (index: number) => {
    if (phase === 'input') dispatch(toggleCell(index));
  };

  // Calculate responsive cell size
  const getCellSize = () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth < 1024;
      if (isMobile) return 'w-16 h-16';
      if (isTablet) return 'w-20 h-20';
    }
    return 'w-24 h-24';
  };

  const cellSize = getCellSize();

  return (
    <div className="flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative"
      >
        {/* Grid glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-2xl rounded-3xl" />
        
        {/* Main grid */}
        <div
          className={`relative grid gap-2 md:gap-3 p-4 md:p-6 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10`}
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: gridSize * gridSize }, (_, i) => {
            const isPattern = pattern[i] === 1;
            const isSelected = selectedCells.includes(i);
            const isShowing = phase === 'showing';
            const isInput = phase === 'input';
            const isFinished = phase === 'finished';

            // Determine cell state for finished phase
            let cellState: 'correct' | 'wrong' | 'missed' | 'selected' | 'pattern' | 'default' = 'default';
            
            if (isFinished) {
              // After game: show player's selections
              if (isSelected) {
                cellState = 'selected';
              } else {
                cellState = 'default';
              }
            } else if (isShowing) {
              cellState = isPattern ? 'pattern' : 'default';
            } else if (isInput) {
              cellState = isSelected ? 'selected' : 'default';
            }

            return (
              <motion.div
                key={i}
                onClick={() => handleClick(i)}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: i * 0.02,
                }}
                className={`${cellSize} relative cursor-pointer select-none`}
                style={{
                  cursor: isInput ? 'pointer' : 'default',
                }}
              >
                {/* Cell container with perspective */}
                <motion.div
                  className="relative w-full h-full"
                  whileHover={isInput ? { scale: 1.05 } : {}}
                  whileTap={isInput ? { scale: 0.95 } : {}}
                >
                  {/* Base cell */}
                  <div className={`
                    absolute inset-0 rounded-xl border-2 transition-all duration-300
                    ${cellState === 'pattern' && isShowing
                      ? 'bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 border-orange-300 shadow-lg shadow-orange-500/50' 
                      : cellState === 'selected' && (isInput || isFinished)
                      ? 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 border-emerald-300 shadow-lg shadow-green-500/50'
                      : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 hover:border-gray-500'
                    }
                  `}>
                    {/* Inner glow effect */}
                    <div className={`
                      absolute inset-0.5 rounded-lg transition-opacity duration-300
                      ${(cellState === 'pattern' && isShowing) || (cellState === 'selected' && (isInput || isFinished))
                        ? 'bg-gradient-to-br from-white/30 to-transparent opacity-100'
                        : 'opacity-0'
                      }
                    `} />

                    {/* Grid cell number (optional - can be removed) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`
                        text-xs font-bold transition-opacity duration-300
                        ${(cellState === 'pattern' && isShowing) || (cellState === 'selected' && (isInput || isFinished))
                          ? 'text-white/90 opacity-100'
                          : 'text-gray-500 opacity-40'
                        }
                      `}>
                        {/* {i + 1} */}
                      </span>
                    </div>
                  </div>

                  {/* Pattern pulse animation (showing phase) */}
                  <AnimatePresence>
                    {isShowing && isPattern && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 opacity-50"
                      />
                    )}
                  </AnimatePresence>

                  {/* Selection ripple effect (input phase) */}
                  <AnimatePresence>
                    {isSelected && isInput && (
                      <>
                        <motion.div
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 2, opacity: 0 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0 rounded-xl border-4 border-green-400"
                        />
                        
                        {/* Checkmark icon */}
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Player's selection display (finished phase) */}
                  <AnimatePresence>
                    {isSelected && isFinished && (
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sparkle effect on pattern cells (showing phase) */}
                  <AnimatePresence>
                    {isShowing && isPattern && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute -top-1 -right-1"
                      >
                        <span className="text-yellow-300 text-xl">✨</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hover indicator for input phase */}
                  {isInput && !isSelected && (
                    <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute inset-0 rounded-xl border-2 border-dashed border-cyan-400/50 animate-pulse" />
                    </div>
                  )}

                  {/* 3D depth effect */}
                  <div className={`
                    absolute -bottom-1 left-0 right-0 h-1 rounded-b-xl transition-all duration-300
                    ${(cellState === 'pattern' && isShowing) || (cellState === 'selected' && (isInput || isFinished))
                      ? 'bg-black/50'
                      : 'bg-black/30'
                    }
                  `} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Grid corner decorations */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400 rounded-tl-lg" />
        <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-purple-400 rounded-tr-lg" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-purple-400 rounded-bl-lg" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-pink-400 rounded-br-lg" />
      </motion.div>
    </div>
  );
};

export default Grid;