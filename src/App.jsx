import './App.css';
import TodoContainer from './components/TodoContainer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<TodoContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
