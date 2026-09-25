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

  return (
    <AuthContext.Provider value={{ user, authRegister }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
