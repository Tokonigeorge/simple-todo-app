import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterComponent from './FilterComponent';
import { Team } from '../types/todo';

describe('FilterComponent', () => {
  const mockTeam: Team = {
    id: '1',
    name: 'Test Team',
    members: [
      { id: 'member1', name: 'John Doe', email: 'john@example.com' },
      { id: 'member2', name: 'Jane Smith', email: 'jane@example.com' },
    ],
    projects: [],
  };

  const mockFilter = {
    priority: 'all',
    assignee: 'all',
  };

  const mockSetFilter = vi.fn();

  const renderFilterComponent = () => {
    return render(
      <FilterComponent
        filter={mockFilter}
        setFilter={mockSetFilter}
        team={mockTeam}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders filter options correctly', () => {
    renderFilterComponent();

    // Check priority filter
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(
      screen.getAllByRole('option', { name: 'All' })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('option', { name: 'High' })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('option', { name: 'Medium' })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('option', { name: 'Low' })[0]
    ).toBeInTheDocument();

    // Check assignee filter
    expect(screen.getByLabelText('Assignee')).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'John Doe' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Jane Smith' })
    ).toBeInTheDocument();
  });

  it('handles priority filter change', () => {
    renderFilterComponent();

    const prioritySelect = screen.getByLabelText('Priority');
    fireEvent.change(prioritySelect, { target: { value: 'high' } });

    expect(mockSetFilter).toHaveBeenCalledWith({
      ...mockFilter,
      priority: 'high',
    });
  });

  it('handles assignee filter change', () => {
    renderFilterComponent();

    const assigneeSelect = screen.getByLabelText('Assignee');
    fireEvent.change(assigneeSelect, { target: { value: 'member1' } });

    expect(mockSetFilter).toHaveBeenCalledWith({
      ...mockFilter,
      assignee: 'member1',
    });
  });

  it('clears filters when clear button is clicked', () => {
    renderFilterComponent();

    const clearButton = screen.getByRole('button', { name: 'Clear' });
    fireEvent.click(clearButton);

    expect(mockSetFilter).toHaveBeenCalledWith({
      priority: 'all',
      assignee: 'all',
    });
  });

  it('maintains current filter state when changing one filter', () => {
    const currentFilter = {
      priority: 'high',
      assignee: 'member1',
    };

    render(
      <FilterComponent
        filter={currentFilter}
        setFilter={mockSetFilter}
        team={mockTeam}
      />
    );

    const prioritySelect = screen.getByLabelText('Priority');
    fireEvent.change(prioritySelect, { target: { value: 'medium' } });

    expect(mockSetFilter).toHaveBeenCalledWith({
      ...currentFilter,
      priority: 'medium',
    });
  });

  it('sets initial select values based on filter prop', () => {
    const currentFilter = {
      priority: 'high',
      assignee: 'member1',
    };

    render(
      <FilterComponent
        filter={currentFilter}
        setFilter={mockSetFilter}
        team={mockTeam}
      />
    );

    const prioritySelect = screen.getByLabelText(
      'Priority'
    ) as HTMLSelectElement;
    const assigneeSelect = screen.getByLabelText(
      'Assignee'
    ) as HTMLSelectElement;

    expect(prioritySelect.value).toBe('high');
    expect(assigneeSelect.value).toBe('member1');
  });
});
