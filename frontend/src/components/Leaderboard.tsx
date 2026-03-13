import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { PlayerScore } from '../redux/leaderboardSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Leaderboard: React.FC = () => {
  const leaderboard = useSelector((state: RootState) => state.leaderboard.scores);

  const getRankConfig = (index: number) => {
    switch (index) {
      case 0:
        return {
          medal: '🥇',
          gradient: 'from-yellow-400 via-yellow-500 to-orange-500',
          textColor: 'text-yellow-400',
          bgGlow: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          shadowColor: 'shadow-yellow-500/50',
        };
      case 1:
        return {
          medal: '🥈',
          gradient: 'from-gray-300 via-gray-400 to-gray-500',
          textColor: 'text-gray-300',
          bgGlow: 'bg-gray-500/20',
          borderColor: 'border-gray-400/30',
          shadowColor: 'shadow-gray-500/50',
        };
      case 2:
        return {
          medal: '🥉',
          gradient: 'from-orange-400 via-orange-500 to-amber-600',
          textColor: 'text-orange-400',
          bgGlow: 'bg-orange-500/20',
          borderColor: 'border-orange-400/30',
          shadowColor: 'shadow-orange-500/50',
        };
      default:
        return {
          medal: `${index + 1}`,
          gradient: 'from-gray-600 to-gray-700',
          textColor: 'text-gray-400',
          bgGlow: 'bg-white/5',
          borderColor: 'border-white/10',
          shadowColor: 'shadow-transparent',
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30"
          >
            <span className="text-xl">🏆</span>
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
            <p className="text-xs text-gray-400">
              {leaderboard.length} {leaderboard.length === 1 ? 'player' : 'players'}
            </p>
          </div>
        </div>

        {/* Live indicator */}
        {leaderboard.length > 0 && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-400/30 rounded-full"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-xs text-red-400 font-semibold">LIVE</span>
          </motion.div>
        )}
      </div>

      {/* Leaderboard container */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 blur-2xl rounded-3xl" />

        {/* Main card */}
        <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <AnimatePresence mode="popLayout">
            {leaderboard.length === 0 ? (
              // Empty state
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-12 text-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4 opacity-30"
                >
                  🎮
                </motion.div>
                <p className="text-gray-400 font-medium">No scores yet</p>
                <p className="text-gray-500 text-sm mt-2">Be the first to compete!</p>
              </motion.div>
            ) : (
              // Leaderboard entries
              <div className="divide-y divide-white/5">
                {leaderboard.map((entry: PlayerScore, index: number) => {
                  const config = getRankConfig(index);
                  const isTopThree = index < 3;

                  return (
                    <motion.div
                      key={entry.playerId}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        delay: index * 0.05,
                      }}
                      className={`
                        relative group
                        ${isTopThree ? `${config.bgGlow} ${config.borderColor}` : 'hover:bg-white/5'}
                        transition-all duration-300
                      `}
                    >
                      {/* Top 3 glow effect */}
                      {isTopThree && (
                        <div className={`absolute inset-0 ${config.shadowColor} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      )}

                      <div className="relative flex items-center gap-4 p-4">
                        {/* Rank badge */}
                        <motion.div
                          whileHover={isTopThree ? { scale: 1.1, rotate: [0, -5, 5, 0] } : {}}
                          className={`
                            flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg
                            ${isTopThree 
                              ? `bg-gradient-to-br ${config.gradient} shadow-lg ${config.shadowColor}` 
                              : 'bg-white/10 text-gray-400'
                            }
                          `}
                        >
                          {config.medal}
                        </motion.div>

                        {/* Player info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {/* Player avatar */}
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                              ${isTopThree 
                                ? `bg-gradient-to-br ${config.gradient} text-white` 
                                : 'bg-gray-700 text-gray-300'
                              }
                            `}>
                              {(entry.username || entry.playerId).charAt(0).toUpperCase()}
                            </div>

                            {/* Username */}
                            <span className={`
                              font-bold truncate
                              ${isTopThree ? 'text-white text-lg' : 'text-gray-300'}
                            `}>
                              {entry.username || entry.playerId}
                            </span>

                            {/* Crown for #1 */}
                            {index === 0 && (
                              <motion.span
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-yellow-400 text-lg"
                              >
                                👑
                              </motion.span>
                            )}
                          </div>

                          {/* Rank text for top 3 */}
                          {isTopThree && (
                            <div className={`text-xs ${config.textColor} font-semibold`}>
                              {index === 0 ? 'Champion' : index === 1 ? 'Runner-up' : 'Third Place'}
                            </div>
                          )}
                        </div>

                        {/* Score */}
                        <div className="flex-shrink-0 text-right">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 200,
                              delay: index * 0.05 + 0.2 
                            }}
                            className={`
                              text-2xl font-black
                              ${isTopThree 
                                ? `text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}` 
                                : 'text-gray-300'
                              }
                            `}
                          >
                            {entry.score.toFixed(0)}
                          </motion.div>
                          <div className="text-xs text-gray-500 font-medium">points</div>
                        </div>

                        {/* Animated chevron for top 3 */}
                        {isTopThree && (
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className={config.textColor}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.div>
                        )}
                      </div>

                      {/* Progress bar for top 3 */}
                      {isTopThree && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ 
                              duration: 1, 
                              delay: index * 0.05 + 0.3,
                              ease: "easeOut" 
                            }}
                            className={`h-full bg-gradient-to-r ${config.gradient}`}
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Corner decorations */}
        {leaderboard.length > 0 && (
          <>
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-yellow-400 rounded-tl-lg" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-orange-400 rounded-tr-lg" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-orange-400 rounded-bl-lg" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-pink-400 rounded-br-lg" />
          </>
        )}
      </div>

      {/* Footer stats */}
      {leaderboard.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex items-center justify-between text-xs text-gray-400 px-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Updated in real-time</span>
          </div>
          {leaderboard.length > 3 && (
            <span>{leaderboard.length - 3} more players</span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Leaderboard;