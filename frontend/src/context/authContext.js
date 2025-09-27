// src/context/authContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Simulate fetching user info from token
      setUser({ username: "exampleUser" }); // Replace with actual fetch if needed
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token); // Save token in localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
