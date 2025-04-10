import './App.css';
import Dashboard from './pages/Dashboard';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import TeamPage from './pages/Team';
import ProjectPage from './pages/Project';
import { Toaster } from 'react-hot-toast';

import AppRoutes from './routes';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position='top-right' />
        <AppRoutes />
      </Router>
    </Provider>
  );
}

export default App;
