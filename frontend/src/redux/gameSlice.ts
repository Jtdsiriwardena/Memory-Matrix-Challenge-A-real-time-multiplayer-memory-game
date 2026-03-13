import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  phase: 'waiting' | 'showing' | 'input' | 'finished';
  pattern: number[];
  gridSize: number;
}

const initialState: GameState = {
  phase: 'waiting',
  pattern: [],
  gridSize: 4,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setPhase(state, action: PayloadAction<GameState['phase']>) {
      state.phase = action.payload;
    },
    setPattern(state, action: PayloadAction<number[]>) {
      state.pattern = action.payload;
    },
    setGridSize(state, action: PayloadAction<number>) {
      state.gridSize = action.payload;
    },
  },
});

export const { setPhase, setPattern, setGridSize } = gameSlice.actions;
export default gameSlice.reducer;
