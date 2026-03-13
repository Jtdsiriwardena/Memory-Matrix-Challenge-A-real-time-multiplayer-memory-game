
import React from 'react';
import { motion } from 'framer-motion';

interface UsernameFormProps {
  username: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string;
}

const UsernameForm: React.FC<UsernameFormProps> = ({ username, onChange, onSubmit, error }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main content card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15,
          duration: 0.6 
        }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glow effect behind card */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
        
        {/* Glass morphism card */}
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          {/* Animated title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-3 tracking-tight"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                ease: "linear" 
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Memory Matrix
            </motion.h1>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="inline-block"
            >
              <span className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-sm font-bold rounded-full shadow-lg">
                CHALLENGE MODE
              </span>
            </motion.div>
          </motion.div>

          {/* Subtitle with icon */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-200 mb-8 flex items-center justify-center gap-2"
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl"
            >
              🧠
            </motion.span>
            <span>Enter your username to begin the challenge</span>
          </motion.p>

          {/* Form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* Input field */}
            <div className="mb-6">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  type="text"
                  value={username}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Player name..."
                  autoFocus
                  className={`w-full px-6 py-4 bg-white/5 backdrop-blur-sm border-2 ${
                    error ? 'border-red-500' : 'border-white/20 focus:border-cyan-400'
                  } rounded-2xl text-white placeholder-gray-400 text-lg font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:shadow-lg focus:shadow-cyan-500/20`}
                />
                
                {/* Input icon */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </motion.div>
              
              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-red-400 text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </motion.div>
              )}
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full relative group overflow-hidden rounded-2xl p-[2px] transition-all duration-300"
            >
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-gradient-xy" />
              
              {/* Button content */}
              <div className="relative bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl px-8 py-4 flex items-center justify-center gap-3 group-hover:from-cyan-500 group-hover:to-purple-500 transition-all duration-300">
                <span className="text-white text-lg font-bold tracking-wide">
                  START GAME
                </span>
                
                <motion.svg
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </div>
            </motion.button>
          </motion.form>
        </div>
      </motion.div>

      {/* Footer hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-0 right-0 text-center text-white/60 text-sm"
      >
        <motion.p
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Press Enter to continue ⏎
        </motion.p>
      </motion.div>
    </div>
  );
};

export default UsernameForm;