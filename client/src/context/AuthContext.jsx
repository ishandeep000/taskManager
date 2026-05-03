import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";

const AuthContext = createContext(null);
const storageKey = "team-task-manager-auth";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : { token: null, user: null };
  });
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!auth.token) {
        setBooting(false);
        return;
      }

      try {
        const data = await apiRequest("/auth/me", { token: auth.token });
        setAuth((current) => ({ ...current, user: data.user }));
      } catch (error) {
        localStorage.removeItem(storageKey);
        setAuth({ token: null, user: null });
      } finally {
        setBooting(false);
      }
    };

    loadUser();
  }, []);

  const persist = (value) => {
    setAuth(value);
    localStorage.setItem(storageKey, JSON.stringify(value));
  };

  const login = async (payload, endpoint) => {
    const data = await apiRequest(endpoint, {
      method: "POST",
      body: payload
    });
    persist(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        booting,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
