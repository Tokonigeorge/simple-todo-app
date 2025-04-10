import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { CardStatus } from '../../types/todo';
// Mock the Modal component
vi.mock('../Modal', () => ({
  default: ({ children, onClose }: any) => (
    <div data-testid='modal'>
      {children}
      <button onClick={onClose}>Close Modal</button>
    </div>
  ),
}));

describe('Card Component', () => {
  const mockCard: ICard = {
    id: 'card1',
    name: 'Test Card',
    description: 'Test Description',
    priority: 'high',
    status: CardStatus.TODO,
    dueDate: '2024-12-31',
    tags: ['test', 'important'],
    assignee: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  };

  const mockProps = {
    card: mockCard,
    columnId: 'col1',
    onMoveCard: vi.fn(),
    handleDeleteCard: vi.fn(),
    editCard: vi.fn(),
    existingCard: null,
  };

  const renderCard = () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <Card {...mockProps} />
      </DndProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders card with all information', () => {
    renderCard();

    expect(screen.getByText(mockCard.name)).toBeInTheDocument();
    expect(screen.getByText(mockCard.description)).toBeInTheDocument();
    expect(screen.getByText(mockCard.priority)).toBeInTheDocument();
    expect(screen.getByText(mockCard.assignee?.name)).toBeInTheDocument();
    mockCard.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('shows delete confirmation modal when delete button is clicked', () => {
    renderCard();

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this card?')
    ).toBeInTheDocument();
  });

  it('calls handleDeleteCard when confirming deletion', () => {
    renderCard();

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    const confirmDelete = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(confirmDelete);

    expect(mockProps.handleDeleteCard).toHaveBeenCalledWith(
      mockCard.id,
      mockProps.columnId
    );
  });

  it('calls editCard when edit button is clicked', () => {
    renderCard();

    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    expect(mockProps.editCard).toHaveBeenCalledWith(mockCard);
  });

  it('displays overdue status for past due dates', () => {
    const overdueCard = {
      ...mockCard,
      dueDate: '2023-01-01', // Past date
    };

    render(
      <DndProvider backend={HTML5Backend}>
        <Card {...mockProps} card={overdueCard} />
      </DndProvider>
    );

    const dateElement = screen.getByText(/Jan 1, 2023/);
    expect(dateElement).toHaveClass('text-red-500');
  });

  it('does not render when card is being edited', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <Card {...mockProps} existingCard={mockCard} />
      </DndProvider>
    );

    expect(screen.queryByText(mockCard.name)).not.toBeInTheDocument();
  });

  it('applies correct priority color class', () => {
    renderCard();

    const priorityElement = screen.getByText(mockCard.priority);
    expect(priorityElement).toHaveClass('bg-red-500');
  });
});
import Card from './Card';
import { ICard } from '../../types/todo';

// Mock the Modal component
vi.mock('../Modal', () => ({
  default: ({ children, onClose }: any) => (
    <div data-testid='modal'>
      {children}
      <button onClick={onClose}>Close Modal</button>
    </div>
  ),
}));

describe('Card Component', () => {
  const mockCard: ICard = {
    id: 'card1',
    name: 'Test Card',
    description: 'Test Description',
    priority: 'high',
    status: 'todo',
    dueDate: '2024-12-31',
    tags: ['test', 'important'],
    assignee: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  };

  const mockProps = {
    card: mockCard,
    columnId: 'col1',
    onMoveCard: vi.fn(),
    handleDeleteCard: vi.fn(),
    editCard: vi.fn(),
    existingCard: null,
  };

  const renderCard = () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <Card {...mockProps} />
      </DndProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders card with all information', () => {
    renderCard();

    expect(screen.getByText(mockCard.name)).toBeInTheDocument();
    expect(screen.getByText(mockCard.description)).toBeInTheDocument();
    expect(screen.getByText(mockCard.priority)).toBeInTheDocument();
    expect(screen.getByText(mockCard.assignee.name)).toBeInTheDocument();
    mockCard.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('shows delete confirmation modal when delete button is clicked', () => {
    renderCard();

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this card?')
    ).toBeInTheDocument();
  });

  it('calls handleDeleteCard when confirming deletion', () => {
    renderCard();

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    const confirmDelete = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(confirmDelete);

    expect(mockProps.handleDeleteCard).toHaveBeenCalledWith(
      mockCard.id,
      mockProps.columnId
    );
  });

  it('calls editCard when edit button is clicked', () => {
    renderCard();

    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    expect(mockProps.editCard).toHaveBeenCalledWith(mockCard);
  });

  it('displays overdue status for past due dates', () => {
    const overdueCard = {
      ...mockCard,
      dueDate: '2023-01-01', // Past date
    };

    render(
      <DndProvider backend={HTML5Backend}>
        <Card {...mockProps} card={overdueCard} />
      </DndProvider>
    );

    const dateElement = screen.getByText(/Jan 1, 2023/);
    expect(dateElement).toHaveClass('text-red-500');
  });

  it('does not render when card is being edited', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <Card {...mockProps} existingCard={mockCard} />
      </DndProvider>
    );

    expect(screen.queryByText(mockCard.name)).not.toBeInTheDocument();
  });

  it('applies correct priority color class', () => {
    renderCard();

    const priorityElement = screen.getByText(mockCard.priority);
    expect(priorityElement).toHaveClass('bg-red-500');
  });
});
