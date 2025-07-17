import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("ems_user")) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem("ems_token") || null
  );

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("ems_user", JSON.stringify(user));
      localStorage.setItem("ems_token", token);
    } else {
      localStorage.removeItem("ems_user");
      localStorage.removeItem("ems_token");
    }
  }, [user, token]);

  const login = async (username, password) => {
    const response = await axios.post(
      "http://localhost:8000/api/token/",
      { username, password }
    );
    setUser({ username });
    setToken(response.data.access);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
