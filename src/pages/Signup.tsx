import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.config';

import { useAppDispatch } from '../store/hook';
import { toast } from 'react-hot-toast';
import { setUser } from '../slice/userSlice';
import { Link, useNavigate } from 'react-router-dom';
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      dispatch(setUser(result.user));
      toast.success('Account created successfully');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 b-white p-8 rounded-lg shadwo-md'>
        <div>
          <h2 className='mb-8 text-center text-2xl font-bold'>
            Create an account
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
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none sm:text-sm'
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
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none sm:text-sm'
            />
          </div>
          <button
            disabled={isLoading}
            type='submit'
            className='w-full py-2 disabled:opacity-50 disabled:cursor-not-allowed px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <div>
            <span className='text-sm text-gray-500'>
              Already have an account?{' '}
              <Link to='/login' className='text-blue-500 hover:text-blue-600'>
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Signup;
