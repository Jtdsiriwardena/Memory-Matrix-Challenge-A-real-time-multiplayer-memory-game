import { createSlice, PayloadAction} from '@reduxjs/toolkit';

interface TimerState {
  startTime: number | null; // timestamp when input phase starts
  elapsedMs: number;        // milliseconds elapsed
  running: boolean;
}

const initialState: TimerState = {
  startTime: null,
  elapsedMs: 0,
  running: false,
};

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer(state) {
      state.startTime = Date.now();
      state.elapsedMs = 0;
      state.running = true;
    },
    stopTimer(state) {
      if (state.startTime) {
        state.elapsedMs = Date.now() - state.startTime;
      }
      state.running = false;
      state.startTime = null;
    },
    resetTimer(state) {
      state.elapsedMs = 0;
      state.running = false;
      state.startTime = null;
    },

        // NEW: Update elapsedMs for live timer
    updateElapsed(state, action: PayloadAction<number>) {
      state.elapsedMs = action.payload;
    },
    
  },
});

export const { startTimer, stopTimer, resetTimer, updateElapsed } = timerSlice.actions;
export default timerSlice.reducer;
