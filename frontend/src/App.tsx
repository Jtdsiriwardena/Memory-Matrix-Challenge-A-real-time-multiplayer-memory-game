import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { store, RootState } from './redux/store';
import { socket } from './socket/socket';
import Grid from './components/Grid';
import Leaderboard from './components/Leaderboard';
import PatternDisplay from './components/PatternDisplay';
import UsernameForm from './components/UsernameForm';
import MatchmakingButton from './components/MatchmakingButton';
import ReadyButton from './components/ReadyButton';
import SubmitButton from './components/SubmitButton';
import PlayAgainButton from './components/PlayAgainButton';
import { setPattern, setPhase } from './redux/gameSlice';
import { resetCells } from './redux/inputSlice';
import { setLeaderboard } from './redux/leaderboardSlice';
import { startTimer, stopTimer, resetTimer, updateElapsed } from './redux/timerSlice';

const PlayerApp: React.FC = () => {
  const dispatch = useDispatch();
  const timer = useSelector((state: RootState) => state.timer);
  const pattern = useSelector((state: RootState) => state.game.pattern);
  const phase = useSelector((state: RootState) => state.game.phase);

  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [roundComplete, setRoundComplete] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [inQueue, setInQueue] = useState(false);

  const [playerId] = useState('player_' + Math.floor(Math.random() * 10000));
  const [username, setUsername] = useState('');
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer.running && timer.startTime) {
      interval = setInterval(() => dispatch(updateElapsed(Date.now() - timer.startTime!)), 50);
    }
    return () => clearInterval(interval);
  }, [timer.running, timer.startTime, dispatch]);

  // Socket listeners
  useEffect(() => {
    socket.on('pattern:start', (data) => {
      dispatch(setPattern(data.pattern));
      dispatch(setPhase('showing'));
      dispatch(resetCells());
      dispatch(resetTimer());

      setTimeout(() => {
        dispatch(setPhase('input'));
        dispatch(startTimer());
      }, 2000);
    });
    socket.on('leaderboard:update', (data) => dispatch(setLeaderboard(data)));
    socket.on('player:score', (data) => console.log('Score:', data.score));
    socket.on('room:countdown', (data: { count: number }) => setCountdown(data.count));
    socket.on('round:complete', () => setRoundComplete(true));
    socket.on('room:reset', () => {
      dispatch(resetTimer());
      dispatch(resetCells());
      dispatch(setPhase('waiting'));
      setIsReady(false);
      setCountdown(null);
      setRoundComplete(false); // Hide leaderboard when play again is clicked
    });
    socket.on('matchmaking:found', (data: { roomId: string }) => {
      setRoomId(data.roomId);
      setInQueue(false);
    });

    return () => {
      socket.off();
    };
  }, [dispatch]);

  if (!usernameSubmitted)
    return (
      <UsernameForm
        username={username}
        onChange={setUsername}
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = username.trim();
          if (trimmed.length < 2) return setUsernameError('At least 2 chars');
          setUsernameError('');
          setUsernameSubmitted(true);
          socket.emit('player:setUsername', { playerId, username: trimmed });
        }}
        error={usernameError}
      />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
              x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main container */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
        >
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30"
            >
              <span className="text-2xl">🧠</span>
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Memory Matrix
              </h1>
              <p className="text-sm text-gray-300">Challenge Mode</p>
            </div>
          </div>

          {/* Player info */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 shadow-xl"
          >
            <div className="text-xs text-gray-300 mb-1">Playing as</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-gray-900">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="text-lg font-bold text-white">{username}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* BEFORE/DURING GAME: Two-column layout */}
        {!roundComplete && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left sidebar - Controls */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-4"
            >
              {/* Matchmaking card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎮</span>
                  Matchmaking
                </h3>
                <MatchmakingButton
                  inQueue={inQueue}
                  roomId={roomId}
                  onClick={() => {
                    socket.emit('matchmaking:join');
                    setInQueue(true);
                  }}
                />

                {roomId && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    whileHover={{ scale: 1.03 }}
                    className="
    mt-4 p-4 rounded-xl
    bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20
    border border-green-400/30
    backdrop-blur-md
    shadow-lg shadow-green-500/20
  "
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {/* Animated status dot */}
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                      </span>

                      <div className="text-xs uppercase tracking-widest text-green-300">
                        Connected to Room
                      </div>
                    </div>

                    <div className="font-mono text-green-400 font-bold text-lg tracking-wider select-all">
                      {roomId}
                    </div>
                  </motion.div>

                )}
              </div>

              {/* Ready button card */}
              {roomId && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl"
                >
                  <ReadyButton
                    roomId={roomId}
                    isReady={isReady}
                    countdown={countdown}
                    onClick={() => {
                      socket.emit('player:ready', { playerId, roomId });
                      setIsReady(true);
                    }}
                  />
                </motion.div>
              )}

              {/* Timer card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl"
              >
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Time Elapsed</h3>
                <div className="flex items-baseline gap-2">
                  <motion.div
                    key={timer.elapsedMs}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
                  >
                    {(timer.elapsedMs / 1000).toFixed(2)}
                  </motion.div>
                  <span className="text-xl text-gray-400 font-semibold">sec</span>
                </div>

                {/* Timer visual bar */}
                <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: timer.running ? '100%' : '0%' }}
                    transition={{ duration: 10, ease: "linear" }}
                  />
                </div>

                {/* Phase indicator */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Phase:</span>
                  <motion.span
                    key={phase}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${phase === 'showing' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                      phase === 'input' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                        phase === 'finished' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30' :
                          'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                      }`}
                  >
                    {phase.toUpperCase()}
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Game grid */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Game grid card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 md:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Game Board</h2>
                  {phase === 'showing' && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 font-semibold text-sm"
                    >
                      👀 Memorize the pattern!
                    </motion.div>
                  )}
                  {phase === 'input' && (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 font-semibold text-sm"
                    >
                      ✨ Select cells now!
                    </motion.div>
                  )}
                </div>

                <Grid />

                {/* Submit button */}
                <div className="mt-6">
                  <SubmitButton
                    disabled={phase !== 'input'}
                    onClick={() => {
                      const state = store.getState();
                      const userInput = state.input.selectedCells.map((i) => state.game.pattern[i] === 1 ? 1 : 0);
                      dispatch(stopTimer());
                      socket.emit('player:submit', { playerId, input: userInput, timeMs: state.timer.elapsedMs, roomId });
                      dispatch(setPhase('finished'));
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* AFTER GAME (ROUND COMPLETE): Results layout with leaderboard */}
        <AnimatePresence>
          {roundComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Play Again Button - Top */}
              <PlayAgainButton
                visible={roundComplete}
                onClick={() => socket.emit('room:playAgain', roomId)}
              />

              {/* Leaderboard - MOVED HERE - Above comparison grids */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <Leaderboard />
              </motion.div>

              {/* Comparison Grid: Your Answer vs Correct Pattern */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Your Answer */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 md:p-8 shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Your Answer</h2>
                      <p className="text-sm text-gray-300">What you selected</p>
                    </div>
                  </div>
                  <Grid />
                </motion.div>

                {/* Right: Correct Pattern */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {pattern.length > 0 && <PatternDisplay pattern={pattern} gridSize={4} />}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <PlayerApp />
  </Provider>
);

export default App;