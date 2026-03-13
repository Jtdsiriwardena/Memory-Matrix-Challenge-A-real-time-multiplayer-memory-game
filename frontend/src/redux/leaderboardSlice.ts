import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PlayerScore {
  playerId: string;
  username: string;
  score: number;
  timeMs?: number;
}

interface LeaderboardState {
  scores: PlayerScore[];
}

const initialState: LeaderboardState = {
  scores: [],
};

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setLeaderboard(state, action: PayloadAction<PlayerScore[]>) {
      state.scores = action.payload;
    },
  },
});

export const { setLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;