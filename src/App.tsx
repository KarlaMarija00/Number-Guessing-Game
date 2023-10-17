import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import Game from './components/Game';
import './styles.css';
import Leaderboard from './components/Leaderboard';
import { getUserEmail } from './components/firebase'; // Import the getUserEmail function
import { useAuth } from './components/AuthContext'; // Import the AuthContext

function LandingPage() {
  return (
    <div>
      <p className='game-description'>
        You have 15 tries to guess the 5-digit random array. <br />Each digit [0, 9] can appear more than once in the array. <br />Your rank on the leaderboard is based on your best time. <br /><br />These are your clues: <br />1. <b>CDCP</b> [correct digit, correct position] <br />2. <b>CDWP</b> [correct digit, wrong position]
      </p>
      <div className="landing-page">
        <div className="button-container">
          <Link to="/login" className="landing-button" id='landing-butt'>
            Login
          </Link>
          <Link to="/registration" className="landing-button" id='landing-butt'>
            Register
          </Link>
          <Link to="/game" className="landing-button" id='landing-butt'>
            Start New Game
          </Link>
          <Link to="/leaderboard" className="landing-button" id='landing-butt'>
            Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  // Use state to store the user's email
  const { userEmail } = useAuth(); // Get user email from context

  return (
    <div>
      <Router>
        <div>
          <nav id='nav'>
            <Link to="/" className='game-link'>
              Code Cracker
            </Link>
            <p className="user-greeting" id="user-greeting">
              Hi, {userEmail ? userEmail : 'Guest'}!
            </p>
          </nav>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/game" element={<Game />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            {/* Add more routes here */}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;