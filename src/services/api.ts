import axios from 'axios';
import { CardStatus, ICard, Project, Team } from '../types/todo';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const teamService = {
  // Get all teams
  getAllTeams: async () => {
    const response = await api.get<Team[]>('/teams');
    return response.data;
  },

  // Get team by id
  getTeamById: async (id: string) => {
    const response = await api.get<Team>(`/teams/${id}`);
    return response.data;
  },

  // Create team
  createTeam: async (team: Omit<Team, 'id'>) => {
    const response = await api.post<Team>('/teams', team);
    return response.data;
  },

  // Update team
  updateTeam: async (id: string, team: Partial<Team>) => {
    const response = await api.patch<Team>(`/teams/${id}`, team);
    return response.data;
  },

  // Delete team
  deleteTeam: async (id: string) => {
    await api.delete(`/teams/${id}`);
  },
};

export const userService = {
  saveUser: async (user: any) => {
    const userData = {
      id: user.uid,
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLoginAt: new Date().toISOString(),
    };

    try {
      const existingUser = await userService.getUserByUid(user.uid);

      if (existingUser) {
        const response = await api.put(`/users/${user.uid}`, userData);
        return response.data;
      } else {
        const response = await api.post('/users', userData);
        return response.data;
      }
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  getUserByUid: async (uid: string) => {
    try {
      const response = await api.get(`/users/${uid}`);
      return response.data;
    } catch (error) {
      if ((error as any).response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  updateUser: async (uid: string, userData: any) => {
    const response = await api.put(`/users/${uid}`, userData);
    return response.data;
  },

  deleteUser: async (uid: string) => {
    try {
      await api.delete(`/users/${uid}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/current');
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export const projectService = {
  createProject: async (teamId: string, project: Omit<Project, 'id'>) => {
    const team = await teamService.getTeamById(teamId);
    const updatedTeam = {
      ...team,
      projects: [...team.projects, { ...project, id: uuidv4() }],
    };
    const response = await teamService.updateTeam(teamId, updatedTeam);
    return response.projects[response.projects.length - 1];
  },

  getProjectById: async (teamId: string, projectId: string) => {
    const response = await teamService.getTeamById(teamId);
    return response.projects.find((project) => project.id === projectId);
  },

  updateProject: async (
    teamId: string,
    projectId: string,
    project: Partial<Project>
  ) => {
    const team = await teamService.getTeamById(teamId);
    const updatedProjects = team.projects.map((p) =>
      p.id === projectId ? { ...p, ...project } : p
    );
    const response = await teamService.updateTeam(teamId, {
      ...team,
      projects: updatedProjects,
    });
    return response.projects.find((p) => p.id === projectId);
  },
};

export const cardService = {
  moveCard: async (
    teamId: string,
    projectId: string,
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string
  ) => {
    const team = await teamService.getTeamById(teamId);
    const project = team.projects.find((p) => p.id === projectId);
    if (!team || !project) {
      return;
    }
    const sourceColumn = project.board.columns.find(
      (c) => c.id === sourceColumnId
    );
    const targetColumn = project.board.columns.find(
      (c) => c.id === targetColumnId
    );
    if (!sourceColumn || !targetColumn) {
      return;
    }
    const card = sourceColumn.cards.find((c) => c.id === cardId);
    if (!card) {
      return;
    }
    const updatedProject = team.projects.map((p) => {
      if (p.id === projectId) {
        const updatedColumns = p.board.columns.map((c) => {
          if (c.id === sourceColumnId) {
            return {
              ...c,
              cards: c.cards.filter((card) => card.id !== cardId),
            };
          }
          if (c.id === targetColumnId) {
            return {
              ...c,
              cards: [
                ...c.cards,
                {
                  ...card,
                  status: targetColumn.name
                    .toLowerCase()
                    .replace(' ', '_') as CardStatus,
                },
              ],
            };
          }
          return c;
        });
        return {
          ...p,
          board: {
            ...p.board,
            columns: updatedColumns,
          },
        };
      }
      return p;
    });
    await teamService.updateTeam(teamId, { projects: updatedProject });
  },

  addCard: async (
    teamId: string,
    projectId: string,
    columnId: string,
    card: ICard
  ) => {
    const team = await teamService.getTeamById(teamId);
    const updatedProject = team.projects.map((p) => {
      if (p.id === projectId) {
        const updatedColumns = p.board.columns.map((c) => {
          if (c.id === columnId) {
            return { ...c, cards: [...c.cards, card] };
          }
          return c;
        });
        return { ...p, board: { ...p.board, columns: updatedColumns } };
      }
      return p;
    });
    await teamService.updateTeam(teamId, { projects: updatedProject });
  },
};
