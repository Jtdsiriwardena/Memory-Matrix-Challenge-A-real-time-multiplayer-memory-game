import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InputState {
  selectedCells: number[];
}

const initialState: InputState = {
  selectedCells: [],
};

export const inputSlice = createSlice({
  name: 'input',
  initialState,
  reducers: {
    setSelectedCells(state, action: PayloadAction<number[]>) {
      state.selectedCells = action.payload;
    },
    toggleCell(state, action: PayloadAction<number>) {
      if (state.selectedCells.includes(action.payload)) {
        state.selectedCells = state.selectedCells.filter((i) => i !== action.payload);
      } else {
        state.selectedCells.push(action.payload);
      }
    },
    resetCells(state) {
      state.selectedCells = [];
    },
  },
});

export const { setSelectedCells, toggleCell, resetCells } = inputSlice.actions;
export default inputSlice.reducer;
