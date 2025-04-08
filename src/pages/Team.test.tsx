// src/pages/Team.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TeamPage from './Team';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockStore = configureStore([]);
const initialState = {
  todo: {
    teams: [
      {
        id: '1',
        name: 'Team Name',
        description: 'Team Description',
        members: [{ id: '1', name: 'John Doe', email: 'john@example.com' }],
        projects: [],
      },
    ],
  },
};

test('renders TeamPage component', () => {
  const store = mockStore(initialState);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/team/1']}>
        <Routes>
          <Route path='/team/:id' element={<TeamPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  // Check if the "Back" button is present
  const backButton = screen.getByText(/Back/i);
  expect(backButton).toBeInTheDocument();

  // Check if team information is displayed
  const teamName = screen.getByText(/Team Name/i);
  expect(teamName).toBeInTheDocument();
});

test('navigates back when "Back" button is clicked', () => {
  const store = mockStore(initialState);
  const navigate = jest.fn();

  // Override the mock implementation of useNavigate
  (useNavigate as jest.Mock).mockImplementation(() => navigate);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/team/1']}>
        <Routes>
          <Route path='/team/:id' element={<TeamPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  const backButton = screen.getByText(/Back/i);
  fireEvent.click(backButton);

  // Check if navigate was called
  expect(navigate).toHaveBeenCalledWith(-1);
});

test('displays "Team not found" when no team is available', () => {
  const store = mockStore({ todo: { teams: [] } });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/team/invalid-id']}>
        <Routes>
          <Route path='/team/:id' element={<TeamPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  const notFoundMessage = screen.getByText(/Team not found/i);
  expect(notFoundMessage).toBeInTheDocument();
});

test('opens modal to create a new project', () => {
  const store = mockStore(initialState);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/team/1']}>
        <Routes>
          <Route path='/team/:id' element={<TeamPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  const createProjectButton = screen.getAllByText(/Create Project/i);
  fireEvent.click(createProjectButton[0]);

  // Check if the modal is opened
  const modalTitle = screen.getAllByText(/Create Project/i);
  expect(modalTitle[1]).toBeInTheDocument();
});
