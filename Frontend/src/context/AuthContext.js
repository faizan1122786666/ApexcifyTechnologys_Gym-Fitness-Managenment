import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('fitnessDesk_token');
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('fitnessDesk_user', JSON.stringify(res.data.data));
          } else {
            localStorage.removeItem('fitnessDesk_token');
            localStorage.removeItem('fitnessDesk_user');
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('fitnessDesk_token');
          localStorage.removeItem('fitnessDesk_user');
        }
      } else {
        const savedUser = localStorage.getItem('fitnessDesk_user');
        if (savedUser) {
           setUser(JSON.parse(savedUser));
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.data.success) {
         setUser(res.data.user);
         localStorage.setItem('fitnessDesk_token', res.data.token);
         localStorage.setItem('fitnessDesk_user', JSON.stringify(res.data.user));
         return { success: true, user: res.data.user };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed. Note: Ensure backend is running.' };
    }
  };

  const signup = async (name, email, password, role = 'member') => {
    try {
      const res = await authService.signup({ name, email, password, role });
      if (res.data.success || res.status === 201) {
         // Usually signup doesn't auto login, or it does. Let's assume it logs auth token
         if(res.data.token) {
           setUser(res.data.user);
           localStorage.setItem('fitnessDesk_token', res.data.token);
           localStorage.setItem('fitnessDesk_user', JSON.stringify(res.data.user));
         }
         return { success: true, user: res.data.user || {} };
      }
      return { success: false, error: 'Signup failed' };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitnessDesk_token');
    localStorage.removeItem('fitnessDesk_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTrainer: user?.role === 'trainer',
    isMember: user?.role === 'member',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
