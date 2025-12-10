import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.user);
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    // Do NOT clear server cart - preserve user's items for next login
    await api.post("/auth/logout");
    setUser(null);
    // Clear local cart stored for anonymous sessions
    try {
      localStorage.removeItem("cart");
    } catch {
      // ignore
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.error("Failed to refresh user:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading, authLoading: loading }}>
      {children}
    </AuthContext.Provider>
  );
}
