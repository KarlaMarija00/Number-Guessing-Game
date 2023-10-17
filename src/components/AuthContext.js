// Create an AuthContext.js to manage user authentication state
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);

  const login = async (email, password) => {
    // Perform login logic
    // If successful, set userEmail
    setUserEmail(email);
  };

  const logout = async () => {
    // Perform logout logic
    // Clear userEmail
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
