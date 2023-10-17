import React, { useState } from 'react';
import { createUser } from './firebase';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; // Import your existing styles

function Registration() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegistration = async () => {
    try {
      const userCredential = await createUser(email, password);
      const user = userCredential.user;
      navigate('/login');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Registration</h2>
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
                handleRegistration();
              }
            }}
          />
        </div>
        <div>
          <button type="button" onClick={handleRegistration} className='flex-end'>
            Register
          </button>
        </div>
      </form>
      {errorMessage && <p className="registration-error">{errorMessage}</p>}
    </div>
  );
}

export default Registration;
