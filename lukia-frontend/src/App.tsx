import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateLukon from './pages/CreateLukon';
import LukonCanvas from './pages/LukonCanvas';
import './App.css'; // Add this line
// Import other pages as needed

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>Lukia</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/create">Create Lukon</Link>
            <Link to="/canvas">Lukon Canvas</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateLukon />} />
            <Route path="/canvas" element={<LukonCanvas />} />
          </Routes>
        </main>
        <footer>
          <p>&copy; 2023 Lukia. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;