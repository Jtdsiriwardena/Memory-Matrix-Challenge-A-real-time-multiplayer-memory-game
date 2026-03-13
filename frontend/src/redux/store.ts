import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import inputReducer from './inputSlice';
import leaderboardReducer from './leaderboardSlice';
import timerReducer from './timerSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    input: inputReducer,
    leaderboard: leaderboardReducer,
    timer: timerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
