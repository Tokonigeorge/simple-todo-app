import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Team, { Card, Project } from '../types/todo';

interface TodoState {
  teams: Team[];
  selectedProject: Project | null;
}

const initialState: TodoState = {
  teams: [],
  selectedProject: null,
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
    setSelectedProject: (state, action: PayloadAction<Project>) => {
      state.selectedProject = action.payload;
    },

    addCard: (
      state,
      action: PayloadAction<{ card: Card; columnId: string }>
    ) => {
      const { card, columnId } = action.payload;
      const project = state.selectedProject;
      if (project) {
        const column = project.board.columns.find(
          (column) => column.id === columnId
        );

        if (column) {
          column.cards.push(card);
        }
      }
    },
    moveCard: (
      state,
      action: PayloadAction<{
        cardId: string;
        sourceColumnId: string;
        targetColumnId: string;
      }>
    ) => {
      const { cardId, sourceColumnId, targetColumnId } = action.payload;
      const project = state.selectedProject;

      if (project) {
        const sourceColumn = project.board.columns.find(
          (column) => column.id === sourceColumnId
        );
        const targetColumn = project.board.columns.find(
          (column) => column.id === targetColumnId
        );

        if (sourceColumn && targetColumn) {
          const card = sourceColumn.cards.find((card) => card.id === cardId);
          if (card) {
            sourceColumn.cards = sourceColumn.cards.filter(
              (c) => c.id !== cardId
            );
            targetColumn.cards.push(card);
          }
        }
      }
    },
    deleteCard: (
      state,
      action: PayloadAction<{ cardId: string; columnId: string }>
    ) => {
      const { cardId, columnId } = action.payload;
      const project = state.selectedProject;

      if (project) {
        const column = project.board.columns.find(
          (column) => column.id === columnId
        );
        if (column) {
          column.cards = column.cards.filter((c) => c.id !== cardId);
        }
      }
    },
  },
});

export const {
  addTeam,
  addProject,
  setSelectedProject,
  addCard,
  moveCard,
  deleteCard,
} = todoSlice.actions;
export default todoSlice.reducer;
