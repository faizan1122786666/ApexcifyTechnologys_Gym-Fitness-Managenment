import React, { createContext, useContext, useState, useEffect } from 'react';

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
          // Backend returns the user object directly in res.data
          if (res.data && res.data._id) {
            setUser(res.data);
            localStorage.setItem('fitnessDesk_user', JSON.stringify(res.data));
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
      // Backend returns { _id, name, email, role, token } directly in res.data
      if (res.data && res.data.token) {
        setUser(res.data);
        localStorage.setItem('fitnessDesk_token', res.data.token);
        localStorage.setItem('fitnessDesk_user', JSON.stringify(res.data));
        return { success: true, user: res.data };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed. Note: Ensure backend is running.' };
    }
  };

  const signup = async (name, email, password, role = 'member') => {
    try {
      const res = await authService.signup({ name, email, password, role });
      // Backend returns { _id, name, email, role, token } directly in res.data
      if (res.data && (res.status === 201 || res.data._id)) {
        if (res.data.token) {
          setUser(res.data);
          localStorage.setItem('fitnessDesk_token', res.data.token);
          localStorage.setItem('fitnessDesk_user', JSON.stringify(res.data));
        }
        return { success: true, user: res.data };
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

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('fitnessDesk_user', JSON.stringify(updatedUser));
  };
 
  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTrainer: user?.role === 'trainer',
    isMember: user?.role === 'member',
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
