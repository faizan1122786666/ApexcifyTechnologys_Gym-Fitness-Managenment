import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Enhanced token refresh mechanism
  const refreshToken = useCallback(async () => {
    const token = localStorage.getItem('fitnessDesk_token');
    if (!token || isRefreshing) return false;

    setIsRefreshing(true);
    try {
      const res = await authService.getProfile();
      if (res.data && res.data._id) {
        setUser(res.data);
        localStorage.setItem('fitnessDesk_user', JSON.stringify(res.data));
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear invalid token
      localStorage.removeItem('fitnessDesk_token');
      localStorage.removeItem('fitnessDesk_user');
      setUser(null);
    } finally {
      setIsRefreshing(false);
    }
    return false;
  }, [isRefreshing]);

  // Enhanced authentication initialization
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('fitnessDesk_token');
      const savedUser = localStorage.getItem('fitnessDesk_user');
      
      if (token) {
        try {
          // Try to get fresh user data
          const res = await authService.getProfile();
          if (res.data && res.data._id) {
            setUser(res.data);
            localStorage.setItem('fitnessDesk_user', JSON.stringify(res.data));
          } else {
            // Fallback to saved user data if API fails
            if (savedUser) {
              const parsedUser = JSON.parse(savedUser);
              // Validate token expiration (3 days)
              const tokenAge = Date.now() - (parsedUser.tokenCreatedAt || 0);
              const threeDays = 3 * 24 * 60 * 60 * 1000;
              
              if (tokenAge < threeDays) {
                setUser(parsedUser);
              } else {
                // Token expired
                localStorage.removeItem('fitnessDesk_token');
                localStorage.removeItem('fitnessDesk_user');
                setUser(null);
              }
            }
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          // Use saved user as fallback
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              setUser(parsedUser);
            } catch (e) {
              localStorage.removeItem('fitnessDesk_user');
            }
          }
        }
      } else if (savedUser) {
        // No token but have saved user - clear it
        localStorage.removeItem('fitnessDesk_user');
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Auto-refresh token periodically (every 5 minutes)
  useEffect(() => {
    if (user && !loading) {
      const interval = setInterval(refreshToken, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [user, loading, refreshToken]);

  // Enhanced login function
  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.data && res.data.token) {
        const userData = {
          ...res.data,
          tokenCreatedAt: Date.now() // Add timestamp for token validation
        };
        setUser(userData);
        localStorage.setItem('fitnessDesk_token', res.data.token);
        localStorage.setItem('fitnessDesk_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed. Note: Ensure backend is running.' };
    }
  };

  // Enhanced signup function
  const signup = async (name, email, password, role = 'member') => {
    try {
      const res = await authService.signup({ name, email, password, role });
      if (res.data && (res.status === 201 || res.data._id)) {
        if (res.data.token) {
          const userData = {
            ...res.data,
            tokenCreatedAt: Date.now()
          };
          setUser(userData);
          localStorage.setItem('fitnessDesk_token', res.data.token);
          localStorage.setItem('fitnessDesk_user', JSON.stringify(userData));
        }
        return { success: true, user: res.data };
      }
      return { success: false, error: 'Signup failed' };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    }
  };

  // Enhanced logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitnessDesk_token');
    localStorage.removeItem('fitnessDesk_user');
    // Clear any cached data
    sessionStorage.clear();
  };

  // Update user function
  const updateUser = (userData) => {
    const updatedUser = { 
      ...user, 
      ...userData,
      tokenCreatedAt: user?.tokenCreatedAt || Date.now()
    };
    setUser(updatedUser);
    localStorage.setItem('fitnessDesk_user', JSON.stringify(updatedUser));
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isTrainer = user?.role === 'trainer';
  const isMember = user?.role === 'member';

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    loading,
    isRefreshing,
    isAuthenticated,
    isAdmin,
    isTrainer,
    isMember,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;