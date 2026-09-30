import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, logout as apiLogout } from "../services/authService";

const AuthContext = createContext(null);

const defaultUserData = {
  name: "Ramesh Kumar",
  email: "ramesh.kumar@agrimitra.org",
  plan: "Premium Plan",
  subscriptionStatus: "Active",
  renewsOn: "15 Oct 2026",
  avatar: "/images/avatar-placeholder.png",
  location: "Indore, Madhya Pradesh",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("agrimitra_token");
    if (token) {
      getProfile()
        .then((res) => {
          if (res?.data) {
            setUser(res.data);
          } else {
            setUser(null);
          }
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("agrimitra_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      setUser: () => {},
      login: () => {},
      logout: () => {},
      loading: false,
      isAuthenticated: false
    };
  }
  return ctx;
}

