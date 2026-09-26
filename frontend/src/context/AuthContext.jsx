import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const authRegister = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);

      console.log("Register response:", response.data);

      setUser(response.data.user);

      return response.data;
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message,
      );

      throw error;
    }
  };

  const authLogin = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, authRegister, authLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
