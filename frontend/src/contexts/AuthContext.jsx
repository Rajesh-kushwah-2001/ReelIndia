import { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const bootstrap = async () => {
      if (!localStorage.getItem('youplay_token')) return;
      try {
        const { data } = await client.get('/auth/me');
        setUser(data);
      } catch {
        localStorage.removeItem('youplay_token');
      }
    };
    bootstrap();
  }, []);

  const login = async (payload, mode = 'login') => {
    const { data } = await client.post(`/auth/${mode}`, payload);
    localStorage.setItem('youplay_token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('youplay_token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
