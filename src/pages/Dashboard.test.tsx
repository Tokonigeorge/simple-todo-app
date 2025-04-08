import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import '@testing-library/jest-dom';

test('renders Dashboard component with no teams', () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </Provider>
  );
  const dashboardElement = screen.getByText(/Welcome!/i);
  expect(dashboardElement).toBeInTheDocument();

  // Check if "No team found" message is displayed
  const noTeamElement = screen.getByText(/No team found/i);
  expect(noTeamElement).toBeInTheDocument();
});
test('opens modal to create a team', () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </Provider>
  );
  // Click the "Create Team" button using data-testid
  const createTeamButton = screen.getByTestId('open-create-team-modal');
  fireEvent.click(createTeamButton);

  // Check if the modal is opened by looking for a unique element inside the modal
  const modalTitle = screen.getByRole('heading', { name: /Create Team/i });
  expect(modalTitle).toBeInTheDocument();
});

test('adds a new team', () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </Provider>
  );

  // Open the modal
  const createTeamButton = screen.getByTestId('open-create-team-modal');
  fireEvent.click(createTeamButton);

  // Fill out the form
  fireEvent.change(screen.getByPlaceholderText(/Team Name/i), {
    target: { value: 'New Team' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Team Description/i), {
    target: { value: 'A new team description' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Team Member Name/i), {
    target: { value: 'John Doe' },
  });

  // Add a member
  const addMemberButton = screen.getByText(/Add Member/i);
  fireEvent.click(addMemberButton);

  // Submit the form
  const submitButton = screen.getByTestId('submit-create-team');
  fireEvent.click(submitButton);

  // Check if the new team is added
  const newTeamElement = screen.getByText('New Team');
  expect(newTeamElement).toBeInTheDocument();
});
