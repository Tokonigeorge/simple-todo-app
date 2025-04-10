import './App.css';
import Dashboard from './pages/Dashboard';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from './store/hook';
import TeamPage from './pages/Team';
import ProjectPage from './pages/Project';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';
import AuthPersistence from './AuthPersistence';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector((state) => state.user.user);
  const initializing = useAppSelector((state) => state.user.initializing);
  if (initializing) {
    return <div>Initializing...</div>;
  }
  console.log(user);
  if (!user) {
    return <Navigate to='/login' replace />;
  }
  return children;
};

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  return (
    <>
      <AuthPersistence />
      {!isAuthPage && <Header />}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/team/:id'
          element={
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/project/:id'
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default AppRoutes;
