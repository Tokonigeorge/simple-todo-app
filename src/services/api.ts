import axios from 'axios';
import { Team } from '../types/todo';

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
