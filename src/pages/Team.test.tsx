// src/pages/Team.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TeamPage from './Team';
import '@testing-library/jest-dom';
import todoReducer from '../slice/todoSlice';
import { teamService } from '../services/api';
import { toast } from 'react-hot-toast';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock API services
vi.mock('../services/api', () => ({
  teamService: {
    getTeamById: vi.fn(),
  },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
const initialState = {
  todo: {
    teams: [
      {
        id: '1',
        name: 'Team Name',
        description: 'Team Description',
        members: [{ id: '1', name: 'John Doe', email: 'john@example.com' }],
        projects: [
          {
            id: 'p1',
            name: 'Project 1',
            description: 'Project Description',
            status: 'active' as const,
            teamId: '1',
            board: {
              id: 'b1',
              progress: 0,
              columns: [],
            },
          },
        ],
      },
    ],
  },
};

describe('TeamPage Component', () => {
  const createTestStore = (preloadedState = initialState) => {
    return configureStore({
      reducer: {
        todo: todoReducer,
      },
      preloadedState,
    });
  };

  const renderTeamPage = async (state = initialState) => {
    const store = createTestStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/team/1']}>
          <Routes>
            <Route path='/team/:id' element={<TeamPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(teamService.getTeamById).mockResolvedValue(
      initialState.todo.teams[0]
    );
  });

  it('renders team details when team is found', async () => {
    await renderTeamPage();

    await waitFor(() => {
      expect(screen.getByText('Team Name')).toBeInTheDocument();
      expect(screen.getByText('Team Description')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  it('navigates back when back button is clicked', async () => {
    await renderTeamPage();

    await waitFor(() => {
      expect(screen.getByText(/Back/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Back/i));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('handles team not found error', async () => {
    vi.mocked(teamService.getTeamById).mockRejectedValueOnce(
      new Error('Team not found')
    );

    await renderTeamPage();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('displays existing projects and allows navigation to project page', async () => {
    await renderTeamPage();

    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project Description')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Project 1'));
    expect(mockNavigate).toHaveBeenCalledWith('/project/p1');
  });

  it('displays team members count correctly', async () => {
    await renderTeamPage();

    await waitFor(() => {
      expect(screen.getByText('Team Members: 1')).toBeInTheDocument();
    });
  });
});
