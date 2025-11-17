import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  const [userData, setUserData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const tokenData = JSON.parse(token);
        // Check if token is not expired (within 1 hour)
        const now = new Date().getTime();
        const diff = now - tokenData.time;
        if (diff < 60 * 60 * 1000) {
          setIsAuthenticated(true);
        } else {
          // Token expired, clear it
          localStorage.clear();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error parsing token:", error);
        localStorage.clear();
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Update authentication status when userData changes
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    setIsAuthenticated(!!token && Object.keys(userData).length > 0);
  }, [userData]);

  const logout = () => {
    localStorage.clear();
    setUserData({});
    setIsAuthenticated(false);
  };

  const value = {
    login,
    setLogin,
    signup,
    setSignup,
    userData,
    setUserData,
    isAuthenticated,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
