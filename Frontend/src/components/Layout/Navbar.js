import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/api';
import { Bell, User, Menu, X, LogOut, Settings, UserCircle, Sparkles, Activity } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Enhanced scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced notification fetching
  const fetchNotifications = useCallback(async () => {
    if (user?.role === 'admin') {
      try {
        const res = await notificationService.getNotifications();
        setNotifications(res.data || []);
        setUnreadCount(res.data?.filter(n => !n.isRead).length || 0);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    }
  }, [user?.role]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully! 👋');
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'Classes', path: '/#classes' },
    { name: 'Trainers', path: '/#trainers' },
    { name: 'Pricing', path: '/#pricing' },
  ];

  const dashboardLink = user?.role === 'admin' ? '/admin' : user?.role === 'trainer' ? '/trainer' : '/member';

  // Enhanced navbar with glass morphism
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 overflow-hidden bg-gradient-to-br from-primary-500/20 to-accent-emerald/20 backdrop-blur-sm border border-white/10 shadow-glow">
                <div className="relative">
                  <img src="/images/logo.png" alt="FitnessDesk Logo" className="w-8 h-8 object-cover rounded-full" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-primary-400 to-accent-emerald rounded-full animate-pulse"></div>
                </div>
              </div>
              <span className="text-2xl font-display font-bold text-white tracking-wide">
                Fitness<span className="gradient-text">Desk</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-all duration-200 hover:text-primary-400 relative group ${
                    location.pathname === link.path ? 'text-primary-400' : 'text-dark-300'
                  }`}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-emerald transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}

              {/* Enhanced User Menu */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-4">
                  {/* Notifications */}
                  {user.role === 'admin' && (
                    <div className="relative">
                      <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-dark-300 hover:text-primary-400 transition-all duration-200 rounded-full hover:bg-white/5"
                      >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      {/* Enhanced Notifications Dropdown */}
                      {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 glass-card border border-white/10 rounded-2xl shadow-glow-lg z-50 animate-slide-up">
                          <div className="p-4 border-b border-white/10">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-primary-400" />
                              Notifications
                            </h3>
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                              notifications.map((notification) => (
                                <div
                                  key={notification._id}
                                  className={`p-4 border-b border-white/5 hover:bg-white/5 transition-all duration-200 cursor-pointer ${
                                    !notification.isRead ? 'bg-primary-500/5' : ''
                                  }`}
                                  onClick={() => handleMarkRead(notification._id)}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${
                                      !notification.isRead ? 'bg-primary-400 animate-pulse' : 'bg-dark-600'
                                    }`}></div>
                                    <div className="flex-1">
                                      <p className="text-sm text-white">{notification.message}</p>
                                      <p className="text-xs text-dark-400 mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-8 text-center text-dark-400">
                                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No notifications yet</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowProfile(!showProfile)}
                      className="flex items-center gap-3 p-2 rounded-full hover:bg-white/5 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-emerald flex items-center justify-center">
                        {user.profilePic ? (
                          <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <span className="text-white font-semibold text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-white hidden lg:block">{user.name}</span>
                      <UserCircle className="w-4 h-4 text-dark-400 group-hover:text-primary-400 transition-colors duration-200" />
                    </button>

                    {/* Enhanced Profile Dropdown */}
                    {showProfile && (
                      <div className="absolute right-0 mt-2 w-56 glass-card border border-white/10 rounded-2xl shadow-glow-lg z-50 animate-slide-up">
                        <div className="p-4 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-emerald flex items-center justify-center">
                              {user.profilePic ? (
                                <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover rounded-full" />
                              ) : (
                                <span className="text-white font-semibold">
                                  {user.name?.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{user.name}</p>
                              <p className="text-xs text-dark-400 capitalize">{user.role}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <Link
                            to={`/${user.role}/profile`}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                            onClick={() => setShowProfile(false)}
                          >
                            <User className="w-4 h-4" />
                            Profile Settings
                          </Link>
                          <Link
                            to={`/${user.role}`}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                            onClick={() => setShowProfile(false)}
                          >
                            <Activity className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 mt-2"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-dark-300 hover:text-white transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary text-sm px-6 py-2"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-dark-300 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden glass-card border-t border-white/10 animate-slide-up">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === link.path 
                      ? 'text-primary-400 bg-primary-500/10' 
                      : 'text-dark-300 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {isAuthenticated && user && (
                <div className="pt-4 border-t border-white/10">
                  <Link
                    to={dashboardLink}
                    className="block px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-accent-emerald rounded-lg transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <UserCircle className="w-4 h-4" />
                      Dashboard
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;