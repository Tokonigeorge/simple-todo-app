// src/pages/Project.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProjectPage from './Project';
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
        projects: [
          {
            id: '1',
            name: 'Project Name',
            description: 'Project Description',
          },
        ],
      },
    ],
  },
};

test('renders ProjectPage component', () => {
  const store = mockStore(initialState);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/project/1']}>
        <Routes>
          <Route path='/project/:id' element={<ProjectPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  // Check if the "Back" button is present
  const backButton = screen.getByText(/Back/i);
  expect(backButton).toBeInTheDocument();

  // Check if project and team information is displayed
  const projectName = screen.getByText(/Project Name/i);
  expect(projectName).toBeInTheDocument();

  const teamName = screen.getByText(/Team: /i);
  expect(teamName).toBeInTheDocument();
});

test('navigates back when "Back" button is clicked', () => {
  const store = mockStore(initialState);
  const navigate = jest.fn();

  // Override the mock implementation of useNavigate
  (useNavigate as jest.Mock).mockImplementation(() => navigate);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/project/1']}>
        <Routes>
          <Route path='/project/:id' element={<ProjectPage />} />
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
      <MemoryRouter initialEntries={['/project/invalid-id']}>
        <Routes>
          <Route path='/project/:id' element={<ProjectPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  const notFoundMessage = screen.getByText(/Team not found/i);
  expect(notFoundMessage).toBeInTheDocument();
});
