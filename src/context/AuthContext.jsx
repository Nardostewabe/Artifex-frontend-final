// ✅ FIX: Added 'React' to the import
import React, { createContext, useContext, useState, useEffect } from "react";
import { decodeToken } from "../utils/jwt";
import { useModal } from "./ModalContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { showAlert } = useModal();
  // Initialize state by checking local storage
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);

  // Helper to check expiration
  const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true; // If can't decode or no exp, assume invalid

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  useEffect(() => {
    // 1. Initial Check on Mount
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        // Set up auto-logout
        const decoded = decodeToken(token);
        const timeLeft = (decoded.exp * 1000) - Date.now();

        // If less than 0 (should be caught by isTokenExpired, but for safety), logout
        if (timeLeft <= 0) {
          logout();
        } else {
          // Auto logout when time expires
          const timer = setTimeout(async () => {
            // Check if showAlert exists before calling it (safety check)
            if (showAlert) { 
                await showAlert("Session expired. Please log in again.", "Session Expired", "warning");
            }
            logout();
          }, timeLeft);

          return () => clearTimeout(timer);
        }
      }
    }
  }, [token]);

  const login = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);