import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/api';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (user?.role === 'admin') {
      try {
        const res = await notificationService.getNotifications();
        setNotifications(res.data || []);
        setUnreadCount(res.data?.filter(n => !n.isRead).length || 0);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };


  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'Classes', path: '/#classes' },
    { name: 'Pricing', path: '/#pricing' },
  ];

  const dashboardLink = user?.role === 'admin' ? '/admin' : user?.role === 'trainer' ? '/trainer' : '/member';

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfile(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300 overflow-hidden bg-white/5">
              <img src="/images/logo.png" alt="FitnessDesk Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-display font-bold text-white tracking-wide">
              Fitness<span className="gradient-text">Desk</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {!isAuthenticated && navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary-400 ${
                  location.pathname === link.path ? 'text-primary-400' : 'text-dark-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to={dashboardLink}
                className="text-sm font-medium text-dark-300 hover:text-primary-400 transition-colors duration-200"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Notification Bell (Admin Only) */}
                {user?.role === 'admin' && (
                  <div className="relative" onMouseEnter={() => { setShowNotifications(true); setShowProfile(false); }} onMouseLeave={() => setShowNotifications(false)}>
                    <button className="relative p-2 text-dark-400 hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 glass-card p-4 animate-slide-up shadow-2xl">
                        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                           <h3 className="font-semibold text-white">Notifications</h3>
                           {unreadCount > 0 && (
                             <button 
                               onClick={async () => {
                                  await notificationService.markAllRead();
                                  fetchNotifications();
                               }}
                               className="text-[10px] text-primary-400 hover:text-primary-300 uppercase font-bold"
                             >
                               Mark all read
                             </button>
                           )}
                        </div>
                        <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
                          {notifications.length > 0 ? notifications.map(n => (
                            <div 
                              key={n._id} 
                              onClick={() => !n.isRead && handleMarkRead(n._id)}
                              className={`flex gap-3 p-3 rounded-lg transition-colors cursor-pointer ${n.isRead ? 'opacity-60 grayscale' : 'bg-white/5 hover:bg-white/10'}`}
                            >
                              <span className="text-xl">
                                {n.type === 'NEW_USER' ? '👤' : n.type === 'NEW_PAYMENT' ? '💳' : '🔔'}
                              </span>
                              <div className="flex-1">
                                <p className={`text-sm ${n.isRead ? 'text-dark-400' : 'text-white font-medium'}`}>{n.message}</p>
                                <p className="text-[10px] text-dark-500 mt-1">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                              {!n.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>}
                            </div>
                          )) : (
                            <p className="text-center text-dark-500 py-4 text-sm italic">No notifications yet</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}


                {/* Profile */}
                <div className="relative" onMouseEnter={() => { setShowProfile(true); setShowNotifications(false); }} onMouseLeave={() => setShowProfile(false)}>
                  <button
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                      {user?.avatar?.startsWith('/') ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-emerald flex items-center justify-center text-sm font-bold text-white">
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-dark-300">{user?.name?.split(' ')[0]}</span>
                    <svg className={`w-4 h-4 text-dark-400 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-56 glass-card p-2 animate-slide-up">
                      <div className="p-3 border-b border-white/5">
                        <p className="font-semibold text-white text-sm">{user?.name}</p>
                        <p className="text-xs text-dark-400">{user?.email}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${
                          user?.role === 'admin' ? 'bg-amber-500/20 text-amber-400' :
                          user?.role === 'trainer' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {user?.role}
                        </span>
                      </div>
                      <div className="p-1 mt-1">
                        <Link
                          to={dashboardLink}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          onClick={() => setShowProfile(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                          </svg>
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-dark-300 hover:text-white transition-colors">
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary text-sm !py-2 !px-6">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-dark-300 hover:text-white transition-colors"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-950/95 backdrop-blur-xl border-t border-white/5 animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            {!isAuthenticated && navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-4 py-3 text-dark-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  to={dashboardLink}
                  className="block px-4 py-3 text-dark-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <div className="pt-2 space-y-2">
                <Link to="/login" className="block text-center px-4 py-3 text-dark-300 border border-white/10 rounded-xl hover:bg-white/5" onClick={() => setIsOpen(false)}>
                  Log In
                </Link>
                <Link to="/signup" className="block text-center btn-primary" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
