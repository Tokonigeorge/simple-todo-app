import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CardForm from './CardForm';
import { Team, ICard } from '../../types/todo';
import userEvent from '@testing-library/user-event';

describe('CardForm Component', () => {
  const mockTeam: Team = {
    id: '1',
    name: 'Test Team',
    members: [
      { id: 'member1', name: 'John Doe', email: 'john@example.com' },
      { id: 'member2', name: 'Jane Smith', email: 'jane@example.com' },
    ],
    projects: [],
  };

  const mockOnSubmit = vi.fn();

  const defaultProps = {
    columnName: 'Todo',
    team: mockTeam,
    onSubmit: mockOnSubmit,
    existingCard: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders form with empty fields when no existing card', () => {
    render(<CardForm {...defaultProps} />);

    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    expect(screen.getByLabelText(/priority/i)).toHaveValue('low');
    expect(screen.getByLabelText(/assignee/i)).toHaveValue('');
  });

  it('renders form with existing card data', () => {
    const existingCard: ICard = {
      id: '1',
      name: 'Test Card',
      description: 'Test Description',
      priority: 'high',
      status: 'todo',
      dueDate: '2024-03-20T00:00:00.000Z',
      assignee: mockTeam.members[0],
      tags: ['frontend', 'bug'],
    };

    render(<CardForm {...defaultProps} existingCard={existingCard} />);

    expect(screen.getByLabelText(/title/i)).toHaveValue('Test Card');
    expect(screen.getByLabelText(/description/i)).toHaveValue(
      'Test Description'
    );
    expect(screen.getByLabelText(/priority/i)).toHaveValue('high');
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('bug')).toBeInTheDocument();
  });

  it('handles label addition and removal', async () => {
    render(<CardForm {...defaultProps} />);

    const labelInput = screen.getByRole('textbox', { name: /labels/i });
    await userEvent.type(labelInput, 'new-label');

    const addLabelButton = screen.getByRole('button', { name: /add label/i });
    await userEvent.click(addLabelButton);

    expect(screen.getByText('new-label')).toBeInTheDocument();

    // Remove label
    const removeButton = screen.getByRole('button', { name: '' });
    await userEvent.click(removeButton);

    expect(screen.queryByText('new-label')).not.toBeInTheDocument();
  });

  it('validates required fields on submit', async () => {
    const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<CardForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /add card/i });
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<CardForm {...defaultProps} />);

    // Fill required fields
    await userEvent.type(screen.getByLabelText('Title'), 'New Card');
    await userEvent.type(
      screen.getByLabelText('Description'),
      'New Description'
    );

    const dueDateInput = screen.getByLabelText('Due Date');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await userEvent.type(dueDateInput, tomorrow.toISOString().split('T')[0]);

    // Select priority
    await userEvent.selectOptions(screen.getByLabelText('Priority'), 'high');

    // Select assignee
    await userEvent.selectOptions(screen.getByLabelText('Assignee'), 'member1');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add card/i });
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Card',
        description: 'New Description',
        priority: 'high',
        status: 'todo',
      })
    );
  });

  it('resets form after successful submission', async () => {
    render(<CardForm {...defaultProps} />);

    // Fill and submit form
    await userEvent.type(screen.getByLabelText('Title'), 'New Card');
    const dueDateInput = screen.getByLabelText('Due Date');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await userEvent.type(dueDateInput, tomorrow.toISOString().split('T')[0]);

    const submitButton = screen.getByRole('button', { name: /add card/i });
    await userEvent.click(submitButton);

    // Check if form is reset
    expect(screen.getByLabelText('Title')).toHaveValue('');
    expect(screen.getByLabelText('Description')).toHaveValue('');
    expect(screen.getByLabelText('Priority')).toHaveValue('low');
  });
});
