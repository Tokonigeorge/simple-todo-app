import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Board from './Board';
import todoReducer from '../../slice/todoSlice';
import { Team, ICard } from '../../types/todo';

// Mock the FilterComponent
vi.mock('../FilterComponent', () => ({
  default: ({ filter, setFilter, team }: any) => (
    <div data-testid='filter-component'>
      <button onClick={() => setFilter({ priority: 'high', assignee: 'all' })}>
        Set High Priority
      </button>
    </div>
  ),
}));

// Mock the Columns component
vi.mock('./Columns', () => ({
  default: ({ column, moveCard, deleteCard, addCard }: any) => (
    <div data-testid={`column-${column.id}`}>
      {column.cards.map((card: ICard) => (
        <div key={card.id} data-testid={`card-${card.id}`}>
          {card.name}
        </div>
      ))}
    </div>
  ),
}));

describe('Board Component', () => {
  const mockTeam: Team = {
    id: '1',
    name: 'Test Team',
    members: [{ id: '1', name: 'John Doe', email: 'john@example.com' }],
    projects: [],
  };

  const mockProject = {
    id: '1',
    name: 'Test Project',
    board: {
      columns: [
        {
          id: 'col1',
          name: 'Todo',
          cards: [
            {
              id: 'card1',
              name: 'Test Card',
              status: 'todo',
              priority: 'high',
            },
          ],
        },
        {
          id: 'col2',
          name: 'Done',
          cards: [
            {
              id: 'card2',
              name: 'Done Card',
              status: 'done',
              priority: 'low',
            },
          ],
        },
      ],
    },
  };

  const mockProps = {
    moveCard: vi.fn(),
    deleteCard: vi.fn(),
    addCard: vi.fn(),
    team: mockTeam,
    updateCard: vi.fn(),
  };

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        todo: todoReducer,
      },
      preloadedState: {
        todo: {
          selectedProject: mockProject,
        },
      },
    });
    vi.clearAllMocks();
  });

  const renderBoard = () => {
    render(
      <Provider store={store}>
        <Board {...mockProps} />
      </Provider>
    );
  };

  it('renders board with columns and progress bar', () => {
    renderBoard();

    expect(screen.getByTestId('filter-component')).toBeInTheDocument();
    expect(screen.getByTestId('column-col1')).toBeInTheDocument();
    expect(screen.getByTestId('column-col2')).toBeInTheDocument();
  });

  it('calculates and displays progress correctly', () => {
    renderBoard();

    // 1 out of 2 cards is done, so progress should be 50%
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  it('filters cards based on priority', async () => {
    renderBoard();

    const setPriorityButton = screen.getByText('Set High Priority');
    fireEvent.click(setPriorityButton);

    await waitFor(() => {
      // Only high priority cards should be visible
      expect(screen.getByTestId('card-card1')).toBeInTheDocument();
      expect(screen.queryByTestId('card-card2')).not.toBeInTheDocument();
    });
  });
});
