// src/pages/Project.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProjectPage from './Project';
import '@testing-library/jest-dom';
import { teamService } from '../services/api';
import todoReducer from '../slice/todoSlice';
import { CardStatus, ProjectStatus } from '../types/todo';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the API services
vi.mock('../services/api', () => ({
  teamService: {
    getAllTeams: vi.fn(),
    getTeamById: vi.fn(),
  },
  cardService: {
    moveCard: vi.fn(),
    addCard: vi.fn(),
    deleteCard: vi.fn(),
    updateCard: vi.fn(),
  },
}));

// Mock the custom hook
vi.mock('../hooks/useCardOperations', () => ({
  useCardOperations: () => ({
    handleMoveCard: vi.fn(),
    handleAddCard: vi.fn(),
    handleDeleteCard: vi.fn(),
    handleUpdateCard: vi.fn(),
    error: null,
  }),
}));

const initialState = {
  todo: {
    teams: [
      {
        id: '1',
        name: 'Team Name',
        projects: [
          {
            id: '1',
            teamId: '1',
            status: 'active' as 'active' | 'completed' | 'archived',
            name: 'Project Name',
            description: 'Project Description',
            board: {
              id: '1',
              progress: 0,
              columns: [
                { id: 'col1', name: 'Todo', cards: [] },
                { id: 'col2', name: 'In Progress', cards: [] },
                { id: 'col3', name: 'Done', cards: [] },
              ],
            },
          },
        ],
        members: [],
      },
    ],
    selectedProject: null,
  },
};

const createTestStore = (preloadedState = initialState) => {
  return configureStore({
    reducer: {
      todo: todoReducer,
    },
    preloadedState,
  });
};

describe('ProjectPage Component', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
    vi.mocked(teamService.getAllTeams).mockResolvedValue(
      initialState.todo.teams
    );
  });

  const renderProjectPage = async (state = initialState) => {
    store = createTestStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/project/1']}>
          <Routes>
            <Route path='/project/:id' element={<ProjectPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders ProjectPage component with project details', async () => {
    await renderProjectPage();

    expect(screen.getByText('Project Name')).toBeInTheDocument();
    expect(screen.getByText(/Back/i)).toBeInTheDocument();
    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
  });

  it('navigates back when "Back" button is clicked', async () => {
    await renderProjectPage();

    const backButton = screen.getByText(/Back/i);
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('navigates away when team is not found', async () => {
    await renderProjectPage({
      todo: {
        teams: [],
        selectedProject: null,
      },
    });

    expect(screen.getByText('Team not found')).toBeInTheDocument();
  });
});
