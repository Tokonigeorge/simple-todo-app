import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import userReducer from '../slice/userSlice';
import { signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';

// Mock the modules
vi.mock('firebase/auth', () => ({
  signOut: vi.fn(),
  auth: {},
}));

vi.mock('../../firebase.config.js', () => ({
  auth: {},
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Header Component', () => {
  let store: ReturnType<typeof configureStore>;

  const mockUser = {
    uid: '123',
    email: 'test@example.com',
    photoURL: 'https://example.com/photo.jpg',
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
      preloadedState: {
        user: {
          user: mockUser,
          initializing: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const renderHeader = () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders header with app title', () => {
    renderHeader();
    expect(screen.getByText('Simple Todo App')).toBeInTheDocument();
  });

  it('displays user email and avatar when user is logged in', () => {
    renderHeader();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByAltText('user avatar')).toHaveAttribute(
      'src',
      'https://example.com/photo.jpg'
    );
  });

  it('shows dropdown menu when clicking user profile', () => {
    renderHeader();

    const userProfile = screen.getByText('test@example.com');
    fireEvent.click(userProfile);

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('hides dropdown menu when clicking outside', () => {
    renderHeader();

    // Show menu
    const userProfile = screen.getByText('test@example.com');
    fireEvent.click(userProfile);

    // Click outside
    fireEvent.click(document.body);

    // Menu should be hidden
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('handles successful logout', async () => {
    vi.mocked(signOut).mockResolvedValueOnce(undefined);

    renderHeader();

    // Open menu and click logout
    const userProfile = screen.getByText('test@example.com');
    fireEvent.click(userProfile);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Logout successful');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('handles logout error', async () => {
    const mockError = new Error('Logout failed');
    vi.mocked(signOut).mockRejectedValueOnce(mockError);

    // Spy on console.error
    const consoleSpy = vi.spyOn(console, 'error');

    renderHeader();

    // Open menu and click logout
    const userProfile = screen.getByText('test@example.com');
    fireEvent.click(userProfile);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Logout error:', mockError);
    });
  });
});
