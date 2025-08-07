import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Interview from './pages/Interview';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/interview/:userId" element={<Interview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
