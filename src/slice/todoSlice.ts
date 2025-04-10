import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Team, Project, ICard, ProjectStatus, CardStatus } from '../types/todo';
import { projectService, teamService } from '../services/api';

interface TodoState {
  teams: Team[];
  selectedProject: Project | null;
}

const initialState: TodoState = {
  teams: [],
  selectedProject: null,
};

export const fetchTeams = createAsyncThunk('todo/fetchTeams', async () => {
  const teams = await teamService.getAllTeams();
  return teams;
});

export const createTeam = createAsyncThunk(
  'todo/createTeam',
  async (team: Omit<Team, 'id'>, { rejectWithValue }) => {
    try {
      const newTeam = await teamService.createTeam(team);
      return newTeam;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createProject = createAsyncThunk(
  'todo/createProject',
  async ({
    teamId,
    project,
  }: {
    teamId: string;
    project: Omit<Project, 'id'>;
  }) => {
    const newProject = await projectService.createProject(teamId, project);
    return { teamId, project: newProject };
  }
);

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
      action: PayloadAction<{ card: ICard; columnId: string }>
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
            card.status =
              targetColumn.name === 'To Do'
                ? CardStatus.TODO
                : targetColumn.name === 'In Progress'
                ? CardStatus.IN_PROGRESS
                : CardStatus.DONE;
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
    updateCard: (
      state,
      action: PayloadAction<{ columnId: string; card: ICard }>
    ) => {
      const { columnId, card } = action.payload;
      const project = state.selectedProject;
      if (project) {
        const column = project.board.columns.find(
          (column) => column.id === columnId
        );
        if (column) {
          const cardIndex = column.cards.findIndex((c) => c.id === card.id);
          if (cardIndex !== -1) {
            column.cards[cardIndex] = card;
          }
        }
      }
    },
    updateProject: (
      state,
      action: PayloadAction<{ projectId: string; status: string }>
    ) => {
      const project = state.selectedProject;
      if (project && project.id === action.payload.projectId) {
        project.status = action.payload.status as ProjectStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProject.fulfilled, (state, action) => {
      const team = state.teams.find((t) => t.id === action.payload.teamId);
      if (team) {
        team.projects.push(action.payload.project);
      }
    });
    builder.addCase(createTeam.fulfilled, (state, action) => {
      state.teams.push(action.payload);
    });
    builder.addCase(fetchTeams.fulfilled, (state, action) => {
      state.teams = action.payload;
    });
  },
});

export const {
  addTeam,
  addProject,
  setSelectedProject,
  addCard,
  moveCard,
  deleteCard,
  updateCard,
  updateProject,
} = todoSlice.actions;
export default todoSlice.reducer;
