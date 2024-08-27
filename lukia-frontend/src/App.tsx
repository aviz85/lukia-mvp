import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UniverseVisualization from './components/UniverseVisualization';
import Home from './pages/Home'; // יש ליצור קומפוננטה זו אם היא לא קיימת
import './styles/UniverseVisualization.css';
import './styles/App.css'; // נוסיף סגנונות כלליים לאפליקציה

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <nav>
          <Link to="/">בית</Link>
          <Link to="/universe">תצוגת יקום</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/universe" element={<UniverseVisualization />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;