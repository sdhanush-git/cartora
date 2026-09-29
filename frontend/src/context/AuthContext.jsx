import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          return;
        }

        const { data } = await api.get("/auth/profile");

        setUser(data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    getProfile();
  }, []);

  const authLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, authRegister, authLogin, authLoading, authLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
