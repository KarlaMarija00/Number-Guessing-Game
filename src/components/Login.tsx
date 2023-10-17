import React, { useState } from 'react';
import { signInUser } from './firebase'; // Import signInUser from firebase.ts
import { useNavigate } from 'react-router-dom';
import '../styles.css'; 
import { useAuth } from './AuthContext'; // Import the AuthContext


function Login() {
  const { login } = useAuth(); // Get the login function from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(email, password); // Use the login function to set user email
      // Redirect to the game page after successful login
      console.log('Logged in: ' + email);
      navigate('/game'); // Use navigate without .push
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Login</h2>
      <form className="registration-form">
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleLogin();
              }
            }}
          />
        </div>
        <div>
          <button type="button" onClick={handleLogin} className='registration-button'>
            Login
          </button>
        </div>
      </form>
      {errorMessage && <p className="registration-error">{errorMessage}</p>}
    </div>
  );  
}

export default Login;
