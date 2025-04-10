import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import userReducer from '../slice/userSlice';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { toast } from 'react-hot-toast';

// Mock the modules
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));
vi.mock('../../firebase.config.js', () => ({
  auth: {},
  firebaseConfig: {
    apiKey: 'test',
    authDomain: 'test',
    projectId: 'test',
    storageBucket: 'test',
    messagingSenderId: 'test',
    appId: 'test',
    measurementId: 'test',
  },
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

describe('Login Component', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders login form correctly', () => {
    renderLogin();

    expect(screen.getByText('Login to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Continue with Google' })
    ).toBeInTheDocument();
  });

  it('handles successful email login', async () => {
    const mockUser = { email: 'test@example.com' };
    vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce({
      user: mockUser,
    } as any);

    renderLogin();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
      expect(toast.success).toHaveBeenCalledWith(
        'Login successful with email and password'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles successful Google login', async () => {
    const mockUser = { email: 'test@example.com' };
    vi.mocked(signInWithPopup).mockResolvedValueOnce({
      user: mockUser,
    } as any);

    renderLogin();

    const googleButton = screen.getByRole('button', {
      name: 'Continue with Google',
    });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        'Login successful with Google'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles login failure', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce(
      new Error('Login failed')
    );

    renderLogin();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Login failed');
    });
  });

  it('handles Google login failure', async () => {
    vi.mocked(signInWithPopup).mockRejectedValueOnce(
      new Error('Google login failed')
    );

    renderLogin();

    const googleButton = screen.getByRole('button', {
      name: 'Continue with Google',
    });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Login failed');
    });
  });

  it('navigates to signup page when clicking sign up link', () => {
    renderLogin();

    const signupLink = screen.getByText('Sign up');
    fireEvent.click(signupLink);

    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });
});
