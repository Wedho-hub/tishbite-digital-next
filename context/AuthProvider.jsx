"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { loginAdmin, logoutAdmin, verifyAdmin } from "@/lib/adminApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyAdmin()
      .then((a) => setAdmin(a))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginAdmin(email, password);
      if (res.success) setAdmin(res.admin);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutAdmin();
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
