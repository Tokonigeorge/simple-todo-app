import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Team from '../types/todo';

interface TodoState {
  teams: Team[];
}

const initialState: TodoState = {
  teams: [],
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
    },
  },
});

export const { addTeam } = todoSlice.actions;
export default todoSlice.reducer;
