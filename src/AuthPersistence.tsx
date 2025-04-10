import { useEffect } from 'react';
import { auth } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch } from './store/hook';
import { setInitializing, setUser } from './slice/userSlice';
import { userService } from './services/api';

const AuthPersistence = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const savedUser = await userService.getUserByUid(user.uid);
          if (savedUser) {
            dispatch(setUser(savedUser));
          } else {
            const newUser = await userService.saveUser(user);
            dispatch(setUser(newUser));
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        dispatch(setInitializing(false));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return null;
};
export default AuthPersistence;
