import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'; // Import setPersistence
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import { AuthProvider } from './components/AuthContext'; // Import the AuthProvider


initializeApp(firebaseConfig);

//const auth = getAuth(); // Get the auth instance
//setPersistence(auth, browserLocalPersistence); // Set persistence to local

ReactDOM.render(
  <React.StrictMode>
    {/* Wrap your App component with AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
