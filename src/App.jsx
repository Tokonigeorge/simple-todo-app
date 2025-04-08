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

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/team/:id' element={<TeamPage />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
