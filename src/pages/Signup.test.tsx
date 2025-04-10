import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Signup from './Signup';
import userReducer from '../slice/userSlice';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-hot-toast';

// Mock the modules
vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getAuth: vi.fn(() => ({})),
    createUserWithEmailAndPassword: vi.fn(),
  };
});

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

describe('Signup Component', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
    vi.clearAllMocks();
  });

  const renderSignup = () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders signup form correctly', () => {
    renderSignup();

    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create account' })
    ).toBeInTheDocument();
  });

  it('handles successful signup', async () => {
    const mockUser = { email: 'test@example.com' };
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValueOnce({
      user: mockUser,
    } as any);

    renderSignup();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Create account' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
      expect(toast.success).toHaveBeenCalledWith(
        'Account created successfully'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('handles signup failure', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValueOnce(
      new Error('Signup failed')
    );

    renderSignup();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Create account' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Signup failed');
    });
  });

  it('navigates to login page when clicking login link', () => {
    renderSignup();

    const loginLink = screen.getByText('Login');
    fireEvent.click(loginLink);

    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });
});
