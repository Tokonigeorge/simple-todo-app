import React, { useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../../firebase.config';
import { Link, useNavigate } from 'react-router-dom';
import { persistUser, setUser } from '../slice/userSlice';
import { useAppDispatch } from '../store/hook';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, provider);
      const savedUser = await dispatch(persistUser(result.user)).unwrap();
      dispatch(setUser(savedUser));
      toast.success('Login successful with Google');
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const savedUser = await dispatch(persistUser(result.user)).unwrap();
      dispatch(setUser(savedUser));
      toast.success('Login successful with email and password');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 b-white p-8 rounded-lg shadwo-md'>
        <div>
          <h2 className='mb-8 text-center text-2xl font-bold'>
            Login to your account
          </h2>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label
              htmlFor='email'
              className='text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              required
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 block w-full border p-2 rounded-md border-gray-300 shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none sm:text-sm'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label
              htmlFor='password'
              className='text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              required
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-1 block w-full border p-2 rounded-md border-gray-300 shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none sm:text-sm'
            />
          </div>
          <button
            disabled={isLoading}
            type='submit'
            className='w-full py-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed px-4 rounded-md bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50'
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div>
            <span className='text-sm text-gray-500'>Or Continue with</span>
          </div>
          <button
            disabled={isLoading}
            type='button'
            onClick={handleGoogleLogin}
            className='w-full  py-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed px-4 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50'
          >
            Continue with Google
          </button>

          <div>
            <span className='text-sm text-gray-500'>
              Don't have an account?{' '}
              <Link to='/signup' className='text-blue-500 hover:text-blue-600'>
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
