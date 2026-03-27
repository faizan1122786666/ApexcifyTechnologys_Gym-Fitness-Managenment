import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: '📊' },
    { name: 'Members', path: '/admin/members', icon: '👥' },
    { name: 'Trainers', path: '/admin/trainers', icon: '🏋️' },
    { name: 'Classes', path: '/admin/classes', icon: '📅' },
    { name: 'Payments', path: '/admin/payments', icon: '💳' },
    { name: 'Attendance', path: '/admin/attendance', icon: '📋' },
    { name: 'Subscriptions', path: '/admin/subscriptions', icon: '💎' },
    { name: 'Profile Settings', path: '/admin/profile', icon: '⚙️' },
  ];

  const trainerLinks = [
    { name: 'Overview', path: '/trainer', icon: '📊' },
    { name: 'My Classes', path: '/trainer/classes', icon: '📅' },
    { name: 'Members', path: '/trainer/members', icon: '👥' },
    { name: 'Workout Plans', path: '/trainer/workouts', icon: '💪' },
    { name: 'Diet Plans', path: '/trainer/diets', icon: '🥗' },
    { name: 'Schedule', path: '/trainer/schedule', icon: '🗓️' },
    { name: 'Profile Settings', path: '/trainer/profile', icon: '⚙️' },
  ];

  const memberLinks = [
    { name: 'Overview', path: '/member', icon: '📊' },
    { name: 'Classes', path: '/member/classes', icon: '📅' },
    { name: 'My Workouts', path: '/member/workouts', icon: '💪' },
    { name: 'Diet Plan', path: '/member/diet', icon: '🥗' },
    { name: 'Attendance', path: '/member/attendance', icon: '📋' },
    { name: 'Payments', path: '/member/payments', icon: '💳' },
    { name: 'Subscription', path: '/member/subscription', icon: '💎' },
    { name: 'Profile Settings', path: '/member/profile', icon: '⚙️' },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'trainer' ? trainerLinks : memberLinks;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-dark-950 border-r border-white/5 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 flex items-center justify-center overflow-hidden rounded-full bg-white/5">
                <img src="/images/logo.png" alt="FitnessDesk Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-display font-bold text-white tracking-wide">
              Fitness<span className="gradient-text">Desk</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-dark-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-full flex items-center justify-center text-lg shrink-0">
               {user?.avatar?.startsWith('/') ? (
                 <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-emerald text-white flex items-center justify-center font-bold">
                   {user?.name?.[0]?.toUpperCase() || 'U'}
                 </div>
               )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${
                user?.role === 'admin' ? 'bg-amber-500/20 text-amber-400' :
                user?.role === 'trainer' ? 'bg-blue-500/20 text-blue-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <p className="text-[10px] uppercase font-semibold text-dark-500 tracking-wider px-4 mb-2">
            Navigation
          </p>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={
                location.pathname === link.path
                  ? 'sidebar-link-active'
                  : 'sidebar-link'
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-sm">{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <Link
            to="/"
            className="sidebar-link text-dark-500 hover:text-dark-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
