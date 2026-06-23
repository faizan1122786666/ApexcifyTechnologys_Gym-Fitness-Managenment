import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const LoginPage = lazy(() => import('./pages/Login/LoginPage'));
const SignupPage = lazy(() => import('./pages/Signup/SignupPage'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const TrainerDashboard = lazy(() => import('./pages/Trainer/TrainerDashboard'));
const MemberDashboard = lazy(() => import('./pages/Member/MemberDashboard'));

// Enhanced loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-dark-950 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-accent-emerald/30 border-t-accent-emerald rounded-full animate-spin" style={{animationDirection: 'reverse'}}></div>
      </div>
      <p className="text-primary-400 font-semibold mt-4 animate-pulse">Loading FitnessDesk...</p>
    </div>
  </div>
);

// Enhanced Protected Route
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App bg-dark-950 min-h-screen text-white relative overflow-hidden">
          {/* Enhanced background effects */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-accent-emerald/10 to-transparent rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-primary-500/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
            
            {/* Animated particles */}
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary-400/40 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 6}s`,
                  animationDuration: `${4 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                <Route path="/admin/*" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/trainer/*" element={
                  <ProtectedRoute allowedRoles={['trainer', 'admin']}>
                    <TrainerDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/member/*" element={
                  <ProtectedRoute allowedRoles={['member', 'admin', 'trainer']}>
                    <MemberDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/unauthorized" element={
                  <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                    <div className="text-center glass-card p-8 max-w-md">
                      <div className="text-6xl mb-4">🚫</div>
                      <h1 className="text-2xl font-bold text-white mb-2">Unauthorized Access</h1>
                      <p className="text-dark-400 mb-4">You don't have permission to access this area.</p>
                      <Link to="/" className="btn-primary">
                        Go Home
                      </Link>
                    </div>
                  </div>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>

          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            className="z-50"
            toastClassName="glass-card border border-white/10 backdrop-blur-xl"
            progressClassName="bg-gradient-to-r from-primary-500 to-accent-emerald"
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;