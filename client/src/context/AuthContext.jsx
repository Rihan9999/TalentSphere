import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem('talentsphere_token') || localStorage.getItem('campushire_token') || null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on startup if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          setProfile(res.data.profile);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, user: userData, profile: profileData } = res.data;
      localStorage.setItem('talentsphere_token', newToken);
      localStorage.setItem('talentsphere_user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      setProfile(profileData);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      const { token: newToken, user: userData, student: studentProfile } = res.data;
      localStorage.setItem('talentsphere_token', newToken);
      localStorage.setItem('talentsphere_user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      setProfile(studentProfile);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('talentsphere_token');
    localStorage.removeItem('talentsphere_user');
    localStorage.removeItem('campushire_token');
    localStorage.removeItem('campushire_user');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
