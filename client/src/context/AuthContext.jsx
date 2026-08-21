import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jobPortalUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('jobPortalUser', JSON.stringify(user));
    else localStorage.removeItem('jobPortalUser');
  }, [user]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem('jobPortalToken', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (details) => {
    const data = await authService.register(details);
    localStorage.setItem('jobPortalToken', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('jobPortalToken');
    setUser(null);
  };

  const updateUser = (updates) => setUser((current) => ({ ...current, ...updates }));

  const value = useMemo(() => ({ user, login, register, logout, updateUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
