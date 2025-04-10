import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../store/hook';
import { useAppDispatch } from '../store/hook';
import { removeUser, setInitializing } from '../slice/userSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
const Header = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (user?.uid) {
        await dispatch(removeUser(user?.uid));
      }
      toast.success('Logout successful');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className='flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200'>
      <h1 className='text-2xl mb-2'>Simple Todo App</h1>
      {user && (
        <div className='relative' ref={menuRef}>
          <div
            className='flex items-center gap-2 cursor-pointer'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className='text-sm text-gray-500'>{user.email}</span>
            <img
              src={user.photoURL || ''}
              alt='user avatar'
              className='w-8 h-8 rounded-full'
            />
          </div>
          {isMenuOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10'>
              <button
                onClick={handleLogout}
                className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
