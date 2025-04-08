import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Team, { Project } from '../types/todo';

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
      state.teams.push({ ...action.payload });
    },
    addProject: (state, action: PayloadAction<Project>) => {
      const team = state.teams.find(
        (team) => team.id === action.payload.teamId
      );

      if (team) {
        team.projects.push(action.payload);
      }
    },
  },
});

export const { addTeam, addProject } = todoSlice.actions;
export default todoSlice.reducer;
